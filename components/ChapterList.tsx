"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { Badge } from "./ui";

export type ChapterRow = {
  id: string;
  name: string;
  latestLine: string;
  status: "Submitted" | "Missing";
};

export function ChapterList({ rows }: { rows: ChapterRow[] }) {
  // The selected chapter is the child segment under /chapters.
  const selected = useSelectedLayoutSegment();

  return (
    <div
      style={{
        padding: "0 8px 8px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {rows.map((row) => {
        const active = selected === row.id;
        return (
          <Link
            key={row.id}
            href={`/chapters/${row.id}`}
            aria-current={active ? "true" : undefined}
            className={`bsp-row ${active ? "bsp-row--active" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              minHeight: 60,
              padding: "10px 12px",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700 }}>{row.name}</span>
              <span
                style={{ fontSize: 13, color: "var(--muted-foreground)" }}
              >
                {row.latestLine}
              </span>
            </div>
            <Badge variant={row.status === "Submitted" ? "success" : "danger"}>
              {row.status}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
