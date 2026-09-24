export const POST_CATEGORIES = [
  "announcement",
  "resource",
  "curriculum_drop",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  announcement: "Announcement",
  resource: "Resource",
  curriculum_drop: "Curriculum Drop",
};

export function isPostCategory(value: unknown): value is PostCategory {
  return POST_CATEGORIES.includes(value as PostCategory);
}

export type Chapter = {
  id: string;
  name: string;
  location: string;
  createdAt: string | null;
};

export type ChapterMembership = {
  /** The sanitized document id. Use `email` for anything user-facing. */
  id: string;
  email: string;
  chapterId: string;
  name: string | null;
  addedAt: string | null;
};

export type Post = {
  id: string;
  category: PostCategory;
  title: string;
  body: string;
  link: string | null;
  createdBy: string;
  createdAt: string | null;
};

export type MonthlyReport = {
  id: string;
  chapterId: string;
  submittedBy: string;
  /** Always "YYYY-MM". */
  month: string;
  studentsTaught: number;
  sessionsRun: number;
  gradeLevels: string;
  attendance: string;
  curriculumProgress: string;
  blockersNotes: string;
  submittedAt: string | null;
};
