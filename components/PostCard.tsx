import { relativeTime } from "@/lib/dates";
import { POST_CATEGORY_LABELS, type Post } from "@/lib/types";
import type { BadgeVariant } from "./ui";
import { Badge, Card } from "./ui";
import { LinkIcon } from "./icons";
import { DeletePostButton } from "./DeletePostButton";

/** Category → badge variant, matching the prototype's VARIANT map. */
const VARIANT: Record<Post["category"], BadgeVariant> = {
  announcement: "primary",
  resource: "secondary",
  curriculum_drop: "success",
};

/** Show the host rather than a naked URL, like the prototype's link label. */
function linkLabel(link: string): string {
  try {
    return new URL(link).host.replace(/^www\./, "");
  } catch {
    return link;
  }
}

export function PostCard({
  post,
  canManage,
}: {
  post: Post;
  canManage: boolean;
}) {
  return (
    <Card>
      <article
        style={{
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            minHeight: 28,
          }}
        >
          <Badge variant={VARIANT[post.category]}>
            {POST_CATEGORY_LABELS[post.category]}
          </Badge>
          <span
            title={post.createdAt ?? undefined}
            style={{ fontSize: 13, color: "var(--muted-foreground)" }}
          >
            {relativeTime(post.createdAt)} · {post.createdBy}
          </span>
          {canManage ? (
            <div style={{ display: "flex", gap: 2, marginLeft: "auto" }}>
              <DeletePostButton postId={post.id} />
            </div>
          ) : null}
        </div>

        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-heading)",
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.3,
            textWrap: "pretty",
          }}
        >
          {post.title}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.6,
            color: "var(--slate-600)",
            whiteSpace: "pre-line",
          }}
        >
          {post.body}
        </p>

        {post.link ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                minWidth: 0,
                overflowWrap: "anywhere",
              }}
            >
              <LinkIcon />
              {linkLabel(post.link)}
            </a>
          </div>
        ) : null}
      </article>
    </Card>
  );
}
