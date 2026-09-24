"use client";

import { useActionState } from "react";

import {
  assignMembershipAction,
  createChapterAction,
  IDLE,
  removeMembershipAction,
} from "@/app/actions";
import type { Chapter, ChapterMembership } from "@/lib/types";
import { formatDate } from "@/lib/dates";
import {
  Button,
  Card,
  EmptyState,
  ErrorNote,
  Field,
  Input,
  Select,
} from "./ui";
import { TrashIcon } from "./icons";

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div
      style={{
        padding: "20px 24px 0",
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
        {title}
      </h2>
      <p style={{ margin: 0, fontSize: 14, color: "var(--muted-foreground)" }}>
        {sub}
      </p>
    </div>
  );
}

export function CreateChapterCard() {
  const [state, formAction, pending] = useActionState(
    createChapterAction,
    IDLE,
  );

  return (
    <Card>
      <SectionTitle
        title="Add a chapter"
        sub="Chapters are created here by HQ — there's no self-serve signup."
      />
      <form
        action={formAction}
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {state.error ? <ErrorNote>{state.error}</ErrorNote> : null}
        <Field label="Chapter name" htmlFor="new-name">
          <Input id="new-name" name="name" required placeholder="Austin" />
        </Field>
        <Field label="Location" htmlFor="new-location">
          <Input
            id="new-location"
            name="location"
            required
            placeholder="Austin, TX"
          />
        </Field>
        <div>
          <Button type="submit" disabled={pending}>
            {pending ? "Adding…" : "Add chapter"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function AssignMemberCard({ chapters }: { chapters: Chapter[] }) {
  const [state, formAction, pending] = useActionState(
    assignMembershipAction,
    IDLE,
  );

  return (
    <Card>
      <SectionTitle
        title="Add someone to a chapter"
        sub="They'll land in that chapter's view the next time they sign in. Tell them directly — no invite email is sent."
      />
      <form
        action={formAction}
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
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
            Saved. They now have access.
          </div>
        ) : null}

        <Field label="Email" htmlFor="m-email">
          <Input
            id="m-email"
            name="email"
            type="email"
            required
            placeholder="instructor@example.org"
          />
        </Field>
        <Field label="Name (optional)" htmlFor="m-name">
          <Input id="m-name" name="name" placeholder="Jordan Lee" />
        </Field>
        <Field
          label="Chapter"
          htmlFor="m-chapter"
          hint="One chapter per person. Assigning again moves them."
        >
          <Select id="m-chapter" name="chapterId" required defaultValue="">
            <option value="" disabled>
              Pick a chapter…
            </option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <div>
          <Button type="submit" disabled={pending || chapters.length === 0}>
            {pending ? "Saving…" : "Add to chapter"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function RemoveButton({ email }: { email: string }) {
  const [, formAction, pending] = useActionState(removeMembershipAction, IDLE);
  return (
    <form action={formAction}>
      <input type="hidden" name="email" value={email} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        disabled={pending}
        aria-label={`Remove ${email}`}
        title="Remove access"
      >
        <TrashIcon size={15} />
      </Button>
    </form>
  );
}

export function MembershipTable({
  memberships,
  chapters,
}: {
  memberships: ChapterMembership[];
  chapters: Chapter[];
}) {
  const nameFor = new Map(chapters.map((c) => [c.id, c.name]));

  return (
    <Card>
      <SectionTitle
        title="Who has access"
        sub={`${memberships.length} ${
          memberships.length === 1 ? "person" : "people"
        } assigned to a chapter. HQ Admins are set by the HQ_ADMIN_EMAILS environment variable and don't appear here.`}
      />
      <div style={{ padding: "16px 16px 20px" }}>
        {memberships.length === 0 ? (
          <EmptyState>Nobody has been added to a chapter yet.</EmptyState>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {memberships.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(180px,2fr) minmax(120px,1fr) 110px 44px",
                  gap: 12,
                  alignItems: "center",
                  padding: "10px 12px",
                  borderTop: "1px solid var(--slate-100)",
                  fontSize: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontWeight: 600, overflowWrap: "anywhere" }}>
                    {m.email}
                  </span>
                  {m.name ? (
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {m.name}
                    </span>
                  ) : null}
                </div>
                <span style={{ color: "var(--slate-600)" }}>
                  {nameFor.get(m.chapterId) ?? "Unknown chapter"}
                </span>
                <span
                  style={{ fontSize: 13, color: "var(--muted-foreground)" }}
                >
                  {formatDate(m.addedAt)}
                </span>
                <RemoveButton email={m.email} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
