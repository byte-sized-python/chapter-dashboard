import { ReportForm } from "@/components/ReportForm";
import { ReportHistory } from "@/components/ReportHistory";
import { Card, PageHeader } from "@/components/ui";
import { requireInstructor } from "@/lib/access";
import { listReportsForChapter } from "@/lib/data";
import { currentMonth, monthLabel, recentMonths } from "@/lib/dates";

export default async function ReportPage() {
  const access = await requireInstructor();
  const reports = await listReportsForChapter(access.chapter.id);

  const month = currentMonth();
  const submittedThisMonth = reports.some((r) => r.month === month);

  return (
    <>
      <PageHeader
        eyebrow={access.chapter.name}
        title="Monthly report"
        sub={`Submit ${access.chapter.name}'s numbers for ${monthLabel(month)}.`}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        <div style={{ flex: "2 1 380px", minWidth: 0 }}>
          <ReportForm
            months={recentMonths(6)}
            defaultMonth={month}
            chapterName={access.chapter.name}
            alreadySubmitted={submittedThisMonth}
          />
        </div>

        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <Card>
            <div
              style={{
                padding: "20px 20px 8px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-heading)",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Past submissions
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "var(--muted-foreground)",
                }}
              >
                {reports.length}{" "}
                {reports.length === 1 ? "submission" : "submissions"} from{" "}
                {access.chapter.name}
              </p>
            </div>
            <div style={{ padding: "8px 16px 20px" }}>
              <ReportHistory reports={reports} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
