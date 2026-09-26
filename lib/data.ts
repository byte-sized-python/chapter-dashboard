import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { cache } from "react";

import { db } from "./firestore";
import type {
  Chapter,
  ChapterMembership,
  MonthlyReport,
  Post,
  PostCategory,
} from "./types";

/**
 * Firestore document ids may not contain "/". Emails effectively never do, but
 * encoding it keeps the id injective for the quoted-local-part edge case while
 * staying readable in the Firestore console (unlike encodeURIComponent, which
 * would mangle "@" too).
 */
export function membershipDocId(email: string): string {
  return email.trim().toLowerCase().replace(/%/g, "%25").replace(/\//g, "%2F");
}

function toIso(value: unknown): string | null {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return null;
}

/* ------------------------------------------------------------------ chapters */

const chapters = () => db.collection("chapters");

function toChapter(
  doc: FirebaseFirestore.DocumentSnapshot,
): Chapter | null {
  const data = doc.data();
  if (!data) return null;
  return {
    id: doc.id,
    name: (data.name as string) ?? "",
    location: (data.location as string) ?? "",
    createdAt: toIso(data.createdAt),
  };
}

// cache() dedupes these reads within a single request: the root layout, a
// nested layout and a page can each call listChapters()/getChapter() and
// only the first one actually hits Firestore.
export const listChapters = cache(async (): Promise<Chapter[]> => {
  const snap = await chapters().orderBy("name").get();
  return snap.docs.map(toChapter).filter((c): c is Chapter => c !== null);
});

export const getChapter = cache(
  async (chapterId: string): Promise<Chapter | null> => {
    if (!chapterId) return null;
    return toChapter(await chapters().doc(chapterId).get());
  },
);

export async function createChapter(input: {
  name: string;
  location: string;
}): Promise<string> {
  const ref = await chapters().add({
    name: input.name,
    location: input.location,
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateChapter(
  chapterId: string,
  input: { name: string; location: string },
): Promise<void> {
  await chapters().doc(chapterId).update({
    name: input.name,
    location: input.location,
  });
}

/* -------------------------------------------------------------- memberships */

const memberships = () => db.collection("chapterMemberships");

function toMembership(
  doc: FirebaseFirestore.DocumentSnapshot,
): ChapterMembership | null {
  const data = doc.data();
  if (!data) return null;
  return {
    id: doc.id,
    // Older rows may predate the stored `email` field; the id round-trips.
    email:
      (data.email as string) ??
      doc.id.replace(/%2F/gi, "/").replace(/%25/g, "%"),
    chapterId: (data.chapterId as string) ?? "",
    name: (data.name as string) ?? null,
    addedAt: toIso(data.addedAt),
  };
}

export async function getMembershipByEmail(
  email: string,
): Promise<ChapterMembership | null> {
  const doc = await memberships().doc(membershipDocId(email)).get();
  return toMembership(doc);
}

export const listMemberships = cache(
  async (): Promise<ChapterMembership[]> => {
    const snap = await memberships().get();
    return snap.docs
      .map(toMembership)
      .filter((m): m is ChapterMembership => m !== null)
      .sort((a, b) => a.email.localeCompare(b.email));
  },
);

/**
 * Instructors for one chapter. A scoped query — cheaper than
 * listMemberships() + filter when a page only needs one chapter's people.
 */
export const listMembershipsForChapter = cache(
  async (chapterId: string): Promise<ChapterMembership[]> => {
    const snap = await memberships().where("chapterId", "==", chapterId).get();
    return snap.docs
      .map(toMembership)
      .filter((m): m is ChapterMembership => m !== null)
      .sort((a, b) => a.email.localeCompare(b.email));
  },
);

/**
 * Assign an email to a chapter. Email-to-chapter is one-to-one, so a reassign
 * overwrites the existing row rather than adding a second one.
 */
export async function assignMembership(input: {
  email: string;
  chapterId: string;
  name?: string | null;
}): Promise<void> {
  const email = input.email.trim().toLowerCase();
  await memberships()
    .doc(membershipDocId(email))
    .set(
      {
        email,
        chapterId: input.chapterId,
        name: input.name ?? null,
        addedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
}

export async function removeMembership(email: string): Promise<void> {
  await memberships().doc(membershipDocId(email)).delete();
}

/**
 * Delete a chapter and revoke access for everyone assigned to it. A batched
 * write — the chapter doc and every membership doc for it are removed
 * together, atomically, so a failure never leaves memberships pointing at a
 * chapter that no longer exists (or vice versa).
 *
 * Historical monthlyReports for the chapter are left in place; they're
 * orphaned but harmless (no page reads them once the chapter itself is
 * gone), and treating a nonprofit's past attendance/curriculum records as
 * disposable felt like the wrong default for a delete the user didn't
 * explicitly ask to extend to reports.
 */
export async function deleteChapter(chapterId: string): Promise<void> {
  const memberSnap = await memberships()
    .where("chapterId", "==", chapterId)
    .get();

  const batch = db.batch();
  for (const doc of memberSnap.docs) {
    batch.delete(doc.ref);
  }
  batch.delete(chapters().doc(chapterId));
  await batch.commit();
}

/* --------------------------------------------------------------------- posts */

const posts = () => db.collection("posts");

function toPost(doc: FirebaseFirestore.DocumentSnapshot): Post | null {
  const data = doc.data();
  if (!data) return null;
  return {
    id: doc.id,
    category: data.category as PostCategory,
    title: (data.title as string) ?? "",
    body: (data.body as string) ?? "",
    link: (data.link as string) || null,
    createdBy: (data.createdBy as string) ?? "",
    createdAt: toIso(data.createdAt),
  };
}

export async function listPosts(category?: PostCategory): Promise<Post[]> {
  // Filtering in memory keeps this to a single-field index. The feed is small
  // and a composite category+createdAt index would need manual provisioning.
  const snap = await posts().orderBy("createdAt", "desc").limit(200).get();
  const all = snap.docs.map(toPost).filter((p): p is Post => p !== null);
  return category ? all.filter((p) => p.category === category) : all;
}

export async function createPost(input: {
  category: PostCategory;
  title: string;
  body: string;
  link: string | null;
  createdBy: string;
}): Promise<string> {
  const ref = await posts().add({
    ...input,
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function deletePost(postId: string): Promise<void> {
  await posts().doc(postId).delete();
}

/* ------------------------------------------------------------ monthlyReports */

const reports = () => db.collection("monthlyReports");

function toReport(
  doc: FirebaseFirestore.DocumentSnapshot,
): MonthlyReport | null {
  const data = doc.data();
  if (!data) return null;
  return {
    id: doc.id,
    chapterId: (data.chapterId as string) ?? "",
    submittedBy: (data.submittedBy as string) ?? "",
    month: (data.month as string) ?? "",
    studentsTaught: Number(data.studentsTaught ?? 0),
    sessionsRun: Number(data.sessionsRun ?? 0),
    gradeLevels: (data.gradeLevels as string) ?? "",
    attendance: (data.attendance as string) ?? "",
    curriculumProgress: (data.curriculumProgress as string) ?? "",
    blockersNotes: (data.blockersNotes as string) ?? "",
    submittedAt: toIso(data.submittedAt),
  };
}

/** A chapter's full submission history, newest month first. */
export const listReportsForChapter = cache(
  async (chapterId: string): Promise<MonthlyReport[]> => {
    const snap = await reports().where("chapterId", "==", chapterId).get();
    return snap.docs
      .map(toReport)
      .filter((r): r is MonthlyReport => r !== null)
      .sort((a, b) => b.month.localeCompare(a.month));
  },
);

/**
 * The most recent month this chapter reported, or null. Built on
 * listReportsForChapter, so a page that needs both the latest report and the
 * full history for the same chapter (report page, root layout) pays for one
 * Firestore read, not two.
 */
export const latestReportForChapter = cache(
  async (chapterId: string): Promise<MonthlyReport | null> => {
    const reports = await listReportsForChapter(chapterId);
    return reports[0] ?? null;
  },
);

/**
 * Latest report per chapter, for the HQ rollup. Reads the whole collection —
 * fine at BSP's scale (a handful of chapters x 12 months) and avoids needing a
 * composite index per chapter.
 */
export const latestReportByChapter = cache(
  async (): Promise<Map<string, MonthlyReport>> => {
    const snap = await reports().get();
    const latest = new Map<string, MonthlyReport>();

    for (const doc of snap.docs) {
      const report = toReport(doc);
      if (!report) continue;
      const current = latest.get(report.chapterId);
      if (!current || report.month > current.month) {
        latest.set(report.chapterId, report);
      }
    }
    return latest;
  },
);

export async function submitReport(input: {
  chapterId: string;
  submittedBy: string;
  month: string;
  studentsTaught: number;
  sessionsRun: number;
  gradeLevels: string;
  attendance: string;
  curriculumProgress: string;
  blockersNotes: string;
}): Promise<string> {
  const ref = await reports().add({
    ...input,
    submittedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}
