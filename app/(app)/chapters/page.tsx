import { Card } from "@/components/ui";

export default function ChaptersIndexPage() {
  return (
    <Card>
      <div
        style={{
          padding: "56px 24px",
          textAlign: "center",
          color: "var(--muted-foreground)",
          fontSize: 15,
        }}
      >
        Pick a chapter to see its full submission history.
      </div>
    </Card>
  );
}
