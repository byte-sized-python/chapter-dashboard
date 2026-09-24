import { notFound } from "next/navigation";

import { ChapterEditor } from "@/components/ChapterEditor";
import { ReportHistory } from "@/components/ReportHistory";
import { Badge, Card } from "@/components/ui";
import { requireHqAdmin } from "@/lib/access";
import {
  getChapter,
  listMemberships,
  listReportsForChapter,
} from "@/lib/data";
import { currentMonth, monthLabel } from "@/lib/dates";

export default async function ChapterDetailPage({
  params,
}: PageProps<"/chapters/[chapterId]">) {
  await requireHqAdmin();
  const { chapterId } = await params;

  const chapter = await getChapter(chapterId);
  if (!chapter) notFound();

  const [reports, memberships] = await Promise.all([
    listReportsForChapter(chapterId),
    listMemberships(),
  ]);

  const instructors = memberships.filter((m) => m.chapterId === chapterId);
  const month = currentMonth();
  const reported = reports.some((r) => r.month === month);

  return (
    <Card>
      <div
        style={{
          padding: "22px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div className="eyebrow">Submission history</div>
          <h2
            style={{
              margin: "6px 0 0",
              fontFamily: "var(--font-heading)",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {chapter.name} chapter
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 14,
              color: "var(--muted-foreground)",
            }}
          >
            {chapter.location} · {reports.length}{" "}
            {reports.length === 1 ? "report" : "reports"} ·{" "}
            {instructors.length}{" "}
            {instructors.length === 1 ? "instructor" : "instructors"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Badge variant={reported ? "success" : "danger"}>
            {reported
              ? `${monthLabel(month)} submitted`
              : `${monthLabel(month)} missing`}
          </Badge>
          <ChapterEditor chapter={chapter} />
        </div>
      </div>

      <div
        style={{
          padding: "20px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {!reported ? (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              fontSize: 14,
              color: "#b91c1c",
            }}
          >
            {chapter.name} hasn&apos;t submitted a report for{" "}
            {monthLabel(month)} yet.
          </div>
        ) : null}

        {instructors.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--muted-foreground)",
              }}
            >
              Instructors
            </span>
            {instructors.map((m) => (
              <span key={m.id} className="bsp-chip" style={{ fontSize: 13 }}>
                {m.email}
              </span>
            ))}
          </div>
        ) : null}

        <ReportHistory reports={reports} />
      </div>
    </Card>
  );
}
