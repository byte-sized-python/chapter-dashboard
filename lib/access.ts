import { redirect } from "next/navigation";

import { auth0 } from "./auth0";
import { getChapter, getMembershipByEmail } from "./data";
import type { Chapter } from "./types";

export type Access =
  | { role: "hq_admin"; email: string; name: string | null }
  | {
      role: "instructor";
      email: string;
      name: string | null;
      chapter: Chapter;
    }
  | { role: "unassigned"; email: string; name: string | null };

/** Parsed once per process; the env var doesn't change at runtime. */
const HQ_ADMIN_EMAILS: ReadonlySet<string> = new Set(
  (process.env.HQ_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

export function isHqAdminEmail(email: string): boolean {
  return HQ_ADMIN_EMAILS.has(email.trim().toLowerCase());
}

/**
 * Resolve what the signed-in user is allowed to do.
 *
 * Order matters and is fixed by spec:
 *   1. HQ_ADMIN_EMAILS  — env only, never stored in Firestore.
 *   2. chapterMemberships/{email} — a direct document read, one chapter max.
 *   3. otherwise blocked.
 *
 * Returns null when there is no Auth0 session at all.
 */
export async function getAccess(): Promise<Access | null> {
  const session = await auth0.getSession();
  const user = session?.user;
  if (!user?.email) return null;

  const email = user.email.trim().toLowerCase();
  const name = (user.name as string | undefined) ?? null;

  // Access is granted purely on the strength of an email address, so an
  // unverified one would let anybody claim an HQ admin or instructor identity
  // by signing up with that address. Set ALLOW_UNVERIFIED_EMAILS=true only if
  // your Auth0 connection cannot mark emails verified.
  const requireVerified = process.env.ALLOW_UNVERIFIED_EMAILS !== "true";
  if (requireVerified && user.email_verified === false) {
    return { role: "unassigned", email, name };
  }

  if (isHqAdminEmail(email)) {
    return { role: "hq_admin", email, name };
  }

  const membership = await getMembershipByEmail(email);
  if (membership) {
    const chapter = await getChapter(membership.chapterId);
    if (chapter) {
      return { role: "instructor", email, name: membership.name ?? name, chapter };
    }
    // Membership points at a chapter that no longer exists — treat as blocked
    // rather than crashing, so HQ can reassign them.
  }

  return { role: "unassigned", email, name };
}

/**
 * Require a signed-in user with some level of access. Redirects to Auth0 when
 * signed out, and to /no-access when the email isn't recognised.
 */
export async function requireAccess(): Promise<
  Extract<Access, { role: "hq_admin" | "instructor" }>
> {
  const access = await getAccess();
  if (!access) redirect("/auth/login");
  if (access.role === "unassigned") redirect("/no-access");
  return access;
}

/** Require HQ Admin. Instructors are sent back to their own chapter view. */
export async function requireHqAdmin(): Promise<
  Extract<Access, { role: "hq_admin" }>
> {
  const access = await requireAccess();
  if (access.role !== "hq_admin") redirect("/");
  return access;
}

/** Require an instructor. HQ admins are sent to the HQ dashboard. */
export async function requireInstructor(): Promise<
  Extract<Access, { role: "instructor" }>
> {
  const access = await requireAccess();
  if (access.role !== "instructor") redirect("/");
  return access;
}
