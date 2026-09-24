import { ChapterList, type ChapterRow } from "@/components/ChapterList";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { requireHqAdmin } from "@/lib/access";
import { latestReportByChapter, listChapters } from "@/lib/data";
import { currentMonth, monthLabel } from "@/lib/dates";

/**
 * Layout B rollup: the chapter list stays mounted on the left while the
 * selected chapter's submission history renders on the right.
 */
export default async function ChaptersLayout({ children }: LayoutProps<"/chapters">) {
  await requireHqAdmin();

  const [chapters, latest] = await Promise.all([
    listChapters(),
    latestReportByChapter(),
  ]);

  const month = currentMonth();
  const rows: ChapterRow[] = chapters.map((c) => {
    const report = latest.get(c.id);
    return {
      id: c.id,
      name: c.name,
      latestLine: report
        ? `${monthLabel(report.month)} · ${report.studentsTaught} students, ${report.sessionsRun} sessions`
        : "No reports yet",
      status: report?.month === month ? "Submitted" : "Missing",
    };
  });

  const missing = rows.filter((r) => r.status === "Missing").length;

  return (
    <>
      <PageHeader
        eyebrow="HQ Admin"
        title="Chapters"
        sub={
          chapters.length === 0
            ? "No chapters yet — add your first one from People."
            : `${missing} of ${chapters.length} ${
                chapters.length === 1 ? "chapter has" : "chapters have"
              } not reported for ${monthLabel(month)}.`
        }
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <Card>
            {rows.length === 0 ? (
              <div style={{ padding: 16 }}>
                <EmptyState>No chapters yet.</EmptyState>
              </div>
            ) : (
              <div style={{ paddingTop: 8 }}>
                <ChapterList rows={rows} />
              </div>
            )}
          </Card>
        </div>

        <div style={{ flex: "999 1 440px", minWidth: 0 }}>{children}</div>
      </div>
    </>
  );
}
