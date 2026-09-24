import { formatDateTime, monthLabel } from "@/lib/dates";
import type { MonthlyReport } from "@/lib/types";
import { EmptyState, StatGrid } from "./ui";

/** One submission rendered as a bordered card, per the prototype's history. */
export function ReportEntry({ report }: { report: MonthlyReport }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-heading)",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {monthLabel(report.month)}
        </h3>
        <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
          {formatDateTime(report.submittedAt)} · {report.submittedBy}
        </span>
      </div>

      <StatGrid
        stats={[
          { label: "Students", value: String(report.studentsTaught) },
          { label: "Sessions", value: String(report.sessionsRun) },
          { label: "Attendance", value: report.attendance || "—" },
          { label: "Grades", value: report.gradeLevels || "—" },
        ]}
      />

      <div style={{ fontSize: 14, lineHeight: 1.55 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--muted-foreground)",
            marginBottom: 2,
          }}
        >
          Curriculum progress
        </div>
        <div style={{ color: "var(--slate-700)", whiteSpace: "pre-line" }}>
          {report.curriculumProgress}
        </div>
      </div>

      {report.blockersNotes ? (
        <div style={{ fontSize: 14, lineHeight: 1.55 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--muted-foreground)",
              marginBottom: 2,
            }}
          >
            Blockers or notes
          </div>
          <div style={{ color: "var(--slate-700)", whiteSpace: "pre-line" }}>
            {report.blockersNotes}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ReportHistory({ reports }: { reports: MonthlyReport[] }) {
  if (reports.length === 0) {
    return <EmptyState>No reports submitted yet.</EmptyState>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {reports.map((r) => (
        <ReportEntry key={r.id} report={r} />
      ))}
    </div>
  );
}
