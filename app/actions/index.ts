"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAccess, isHqAdminEmail, requireHqAdmin } from "@/lib/access";
import type { ActionState } from "@/lib/action-state";
import * as data from "@/lib/data";
import { isPostCategory } from "@/lib/types";

function fail(error: string): ActionState {
  return { error, ok: false };
}

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Server Actions are reachable by direct POST, so every one re-checks access. */

/* ------------------------------------------------------------------ chapters */

export async function createChapterAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireHqAdmin();

  const name = text(form, "name");
  const location = text(form, "location");
  if (!name) return fail("Chapter name is required.");
  if (!location) return fail("Location is required.");

  await data.createChapter({ name, location });
  // "/", "layout" revalidates the root layout (sidebar nav) plus every
  // nested layout/page beneath it — /chapters, /chapters/[id], /people,
  // /report all live under it. The old per-page paths here were literal
  // "/hq/..." strings that don't match any real route in this app (routes
  // are "/", "/chapters", "/people", "/report" — no "/hq" prefix), so they
  // silently revalidated nothing and left stale data (e.g. a submitted
  // report not reflected in the sidebar's missing-report count).
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}

export async function deleteChapterAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireHqAdmin();

  const chapterId = text(form, "chapterId");
  if (!chapterId) return fail("Missing chapter.");

  const chapter = await data.getChapter(chapterId);
  if (!chapter) return fail("That chapter no longer exists.");

  await data.deleteChapter(chapterId);
  revalidatePath("/", "layout");
  // Thrown, not returned: the chapter's own detail page no longer exists,
  // so the redirect has to happen authoritatively from here rather than as
  // a client effect reacting to `ok: true` — that raced against Next's own
  // revalidation of the current (now-404) route and lost, leaving the admin
  // stranded on a 404 instead of back at the chapter list.
  redirect("/chapters");
}

export async function updateChapterAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireHqAdmin();

  const chapterId = text(form, "chapterId");
  const name = text(form, "name");
  const location = text(form, "location");
  if (!chapterId) return fail("Missing chapter.");
  if (!name) return fail("Chapter name is required.");
  if (!location) return fail("Location is required.");

  await data.updateChapter(chapterId, { name, location });
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}

/* -------------------------------------------------------------- memberships */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function assignMembershipAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireHqAdmin();

  const email = text(form, "email").toLowerCase();
  const chapterId = text(form, "chapterId");
  const name = text(form, "name");

  if (!EMAIL_RE.test(email)) return fail("Enter a valid email address.");
  if (!chapterId) return fail("Pick a chapter.");

  // An HQ admin is defined by the env var and outranks any membership row, so
  // a membership for that email would silently never take effect.
  if (isHqAdminEmail(email)) {
    return fail(
      "That email is an HQ Admin (set in HQ_ADMIN_EMAILS) and always sees the HQ view. Remove it from HQ_ADMIN_EMAILS first to assign it to a chapter.",
    );
  }

  const chapter = await data.getChapter(chapterId);
  if (!chapter) return fail("That chapter no longer exists.");

  await data.assignMembership({ email, chapterId, name: name || null });
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}

export async function removeMembershipAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireHqAdmin();

  const email = text(form, "email");
  if (!email) return fail("Missing email.");

  await data.removeMembership(email);
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}

/* --------------------------------------------------------------------- posts */

export async function createPostAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const access = await requireHqAdmin();

  const category = text(form, "category");
  const title = text(form, "title");
  const body = text(form, "body");
  const link = text(form, "link");

  if (!isPostCategory(category)) return fail("Pick a category.");
  if (!title) return fail("Title is required.");
  if (!body) return fail("Body is required.");
  if (link && !/^https?:\/\//i.test(link)) {
    return fail("Link must start with http:// or https://");
  }

  await data.createPost({
    category,
    title,
    body,
    link: link || null,
    createdBy: access.email,
  });
  // "/hq/feed" never matched a real route; the feed lives at "/".
  revalidatePath("/");
  return { error: null, ok: true };
}

export async function deletePostAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireHqAdmin();

  const postId = text(form, "postId");
  if (!postId) return fail("Missing post.");

  await data.deletePost(postId);
  revalidatePath("/");
  return { error: null, ok: true };
}

/* ------------------------------------------------------------ monthly report */

export async function submitReportAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  // Read access directly: the chapter comes from the session, never the form,
  // so an instructor cannot submit on another chapter's behalf.
  const access = await getAccess();
  if (!access) return fail("Your session expired. Reload and sign in again.");
  if (access.role !== "instructor") {
    return fail("Only chapter instructors can submit a monthly report.");
  }

  const month = text(form, "month");
  const studentsTaught = Number(text(form, "studentsTaught"));
  const sessionsRun = Number(text(form, "sessionsRun"));
  const gradeLevels = text(form, "gradeLevels");
  const attendance = text(form, "attendance");
  const curriculumProgress = text(form, "curriculumProgress");
  const blockersNotes = text(form, "blockersNotes");

  if (!/^\d{4}-\d{2}$/.test(month)) return fail("Pick a month.");
  if (!Number.isFinite(studentsTaught) || studentsTaught < 0) {
    return fail("Students taught must be a number.");
  }
  if (!Number.isFinite(sessionsRun) || sessionsRun < 0) {
    return fail("Sessions run must be a number.");
  }
  if (!gradeLevels) return fail("Grade levels are required.");
  if (!curriculumProgress) return fail("Curriculum progress is required.");

  await data.submitReport({
    chapterId: access.chapter.id,
    submittedBy: access.email,
    month,
    studentsTaught,
    sessionsRun,
    gradeLevels,
    attendance,
    curriculumProgress,
    blockersNotes,
  });
  // Broad invalidation: this affects the sidebar's due/missing indicators,
  // the /chapters rollup and that chapter's detail page, not just /report.
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}
