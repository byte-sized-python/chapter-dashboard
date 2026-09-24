import Link from "next/link";

import { PostCard } from "@/components/PostCard";
import { PostComposer } from "@/components/PostComposer";
import { Badge, EmptyState, PageHeader } from "@/components/ui";
import { requireAccess } from "@/lib/access";
import { latestReportForChapter, listPosts } from "@/lib/data";
import { currentMonth, monthName } from "@/lib/dates";
import {
  POST_CATEGORIES,
  POST_CATEGORY_LABELS,
  isPostCategory,
} from "@/lib/types";

export default async function FeedPage({ searchParams }: PageProps<"/">) {
  const access = await requireAccess();
  const params = await searchParams;

  const raw = typeof params.category === "string" ? params.category : "";
  const category = isPostCategory(raw) ? raw : undefined;
  const posts = await listPosts(category);

  const isHq = access.role === "hq_admin";

  // Instructors get a nudge in the header when their report is outstanding.
  let reportDue = false;
  if (access.role === "instructor") {
    const latest = await latestReportForChapter(access.chapter.id);
    reportDue = latest?.month !== currentMonth();
  }

  return (
    <>
      <PageHeader
        eyebrow={isHq ? "HQ Admin" : access.role === "instructor" ? access.chapter.name : ""}
        title="Feed"
        sub={
          isHq
            ? "Announcements, resources and curriculum drops you've sent to every chapter."
            : "Everything HQ has shared with BSP chapters."
        }
        actions={
          <>
            {isHq ? <PostComposer /> : null}
            {reportDue ? (
              <Link href="/report" style={{ textDecoration: "none" }}>
                <Badge variant="danger">
                  {monthName(currentMonth())} report still due
                </Badge>
              </Link>
            ) : null}
          </>
        }
      />

      <section
        aria-label="Feed"
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "100%", overflowX: "auto" }}>
            <div className="bsp-segmented">
              <Link
                href="/"
                className={`bsp-segmented__item ${
                  !category ? "bsp-segmented__item--active" : ""
                }`}
              >
                All
              </Link>
              {POST_CATEGORIES.map((c) => (
                <Link
                  key={c}
                  href={`/?category=${c}`}
                  className={`bsp-segmented__item ${
                    category === c ? "bsp-segmented__item--active" : ""
                  }`}
                >
                  {POST_CATEGORY_LABELS[c]}
                </Link>
              ))}
            </div>
          </div>
          <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>

        {posts.length === 0 ? (
          <EmptyState>
            {category
              ? "No posts in this category yet."
              : "No posts yet. HQ updates will show up here."}
          </EmptyState>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} canManage={isHq} />
          ))
        )}
      </section>
    </>
  );
}
