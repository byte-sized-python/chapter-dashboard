"use client";

import { useActionState, useState } from "react";

import { submitReportAction } from "@/app/actions";
import { IDLE } from "@/lib/action-state";
import { monthLabel } from "@/lib/dates";
import { Button, Card, ErrorNote, Field, Input, Textarea } from "./ui";

/** Grade bands from the prototype; "Other" falls back to free text. */
const BANDS = ["K–2", "3–5", "6–8", "9–12"];

export function ReportForm({
  months,
  defaultMonth,
  chapterName,
  alreadySubmitted,
}: {
  months: string[];
  defaultMonth: string;
  chapterName: string;
  alreadySubmitted: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    submitReportAction,
    IDLE,
  );
  const [bands, setBands] = useState<string[]>([]);
  const [otherGrades, setOtherGrades] = useState("");

  const gradeLevels = [...bands, otherGrades.trim()]
    .filter(Boolean)
    .join(", ");

  function toggle(band: string) {
    setBands((prev) =>
      prev.includes(band) ? prev.filter((b) => b !== band) : [...prev, band],
    );
  }

  return (
    <Card>
      <form
        action={formAction}
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div>
          <div className="eyebrow">{chapterName}</div>
          <h2
            style={{
              margin: "6px 0 0",
              fontFamily: "var(--font-heading)",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Monthly report
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 14,
              color: "var(--muted-foreground)",
            }}
          >
            Covers every session your chapter ran that month. Any instructor at{" "}
            {chapterName} can submit it.
          </p>
        </div>

        {state.error ? <ErrorNote>{state.error}</ErrorNote> : null}
        {state.ok ? (
          <div
            role="status"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(22,163,74,0.12)",
              border: "1px solid rgba(22,163,74,0.3)",
              fontSize: 14,
              color: "var(--success)",
            }}
          >
            Report sent to HQ.
          </div>
        ) : null}

        {alreadySubmitted && !state.ok ? (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "var(--bsp-yellow-20)",
              border: "1px solid rgba(254,211,59,0.6)",
              fontSize: 14,
            }}
          >
            {chapterName} has already submitted for {monthLabel(defaultMonth)}.
            Submitting again adds another entry to the history.
          </div>
        ) : null}

        <Field label="Month" htmlFor="f-month">
          <select
            id="f-month"
            name="month"
            className="bsp-select"
            defaultValue={defaultMonth}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
          </select>
        </Field>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
            gap: 16,
          }}
        >
          <Field label="Students taught" htmlFor="f-students">
            <Input
              id="f-students"
              name="studentsTaught"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="0"
              required
            />
          </Field>
          <Field label="Sessions run" htmlFor="f-sessions">
            <Input
              id="f-sessions"
              name="sessionsRun"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="0"
              required
            />
          </Field>
        </div>

        <div>
          <span className="bsp-field-label">Grade levels served</span>
          <input type="hidden" name="gradeLevels" value={gradeLevels} />
          <div
            role="group"
            aria-label="Grade levels served"
            style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
          >
            {BANDS.map((band) => {
              const selected = bands.includes(band);
              return (
                <button
                  key={band}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggle(band)}
                  className={`bsp-chip bsp-chip--interactive ${
                    selected ? "bsp-chip--yellow" : ""
                  }`}
                >
                  {band}
                </button>
              );
            })}
          </div>
          <input
            className="bsp-input"
            style={{ marginTop: 10 }}
            placeholder="Anything else? e.g. mixed ages, after-school club"
            value={otherGrades}
            onChange={(e) => setOtherGrades(e.target.value)}
            aria-label="Other grade levels"
          />
        </div>

        <Field
          label="Attendance"
          htmlFor="f-attendance"
          hint="A number or a rough figure — whatever your chapter tracks."
        >
          <Input
            id="f-attendance"
            name="attendance"
            placeholder="e.g. 18 per session, or ~75%"
          />
        </Field>

        <Field label="Curriculum progress" htmlFor="f-progress">
          <Textarea
            id="f-progress"
            name="curriculumProgress"
            rows={3}
            required
            placeholder="Which units or concepts did you cover?"
          />
        </Field>

        <Field label="Blockers or notes (optional)" htmlFor="f-notes">
          <Textarea
            id="f-notes"
            name="blockersNotes"
            rows={2}
            placeholder="Anything HQ should know or help with"
          />
        </Field>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Submitting…" : "Submit report"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
