"use client";

import { useActionState, useState } from "react";

import { deleteChapterAction } from "@/app/actions";
import { IDLE } from "@/lib/action-state";
import type { Chapter } from "@/lib/types";
import { Button, ErrorNote, IconButton } from "./ui";
import { CloseIcon, TrashIcon } from "./icons";

/**
 * Deleting a chapter is destructive and hard to reverse: it also revokes
 * every assigned instructor's access, since chapterMemberships/{email} is
 * their only path in. This confirms explicitly and names who loses access
 * before submitting, rather than a bare delete button.
 */
export function DeleteChapterButton({
  chapter,
  instructorEmails,
}: {
  chapter: Chapter;
  instructorEmails: string[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    deleteChapterAction,
    IDLE,
  );
  // No client-side redirect-on-success here: deleteChapterAction calls
  // next/navigation's redirect("/chapters") itself once the delete
  // succeeds, which Next treats as authoritative. Reacting to `state.ok`
  // instead raced against Next's own revalidation of this (now-deleted)
  // chapter's page and lost, leaving the admin stuck on a 404.

  return (
    <>
      <IconButton
        size="md"
        aria-label={`Delete ${chapter.name}`}
        title="Delete chapter"
        onClick={() => setOpen(true)}
      >
        <TrashIcon />
      </IconButton>

      {open ? (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(15,23,42,0.35)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "56px 16px",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Delete ${chapter.name}`}
            style={{
              width: "100%",
              maxWidth: 480,
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 24,
              boxShadow: "var(--shadow-hero)",
            }}
          >
            <form
              action={formAction}
              style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <input type="hidden" name="chapterId" value={chapter.id} />
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <h2
                  style={{
                    margin: 0,
                    flex: 1,
                    fontFamily: "var(--font-heading)",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  Delete {chapter.name}?
                </h2>
                <IconButton
                  type="button"
                  size="lg"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              </div>

              {state.error ? <ErrorNote>{state.error}</ErrorNote> : null}

              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "#b91c1c",
                }}
              >
                This permanently deletes {chapter.name} and can&apos;t be
                undone.{" "}
                {instructorEmails.length > 0 ? (
                  <>
                    It also revokes platform access for{" "}
                    {instructorEmails.length === 1
                      ? "the instructor below"
                      : `all ${instructorEmails.length} instructors below`}{" "}
                    — they won&apos;t be able to sign in until re-added to a
                    different chapter:
                    <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                      {instructorEmails.map((email) => (
                        <li key={email}>{email}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  "No one is currently assigned to it."
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="destructive" disabled={pending}>
                  {pending ? "Deleting…" : "Delete chapter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
