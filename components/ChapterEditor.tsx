"use client";

import { useActionState, useState } from "react";

import { IDLE, updateChapterAction } from "@/app/actions";
import type { Chapter } from "@/lib/types";
import { Button, ErrorNote, Field, IconButton, Input } from "./ui";
import { CloseIcon, PencilIcon } from "./icons";

export function ChapterEditor({ chapter }: { chapter: Chapter }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateChapterAction,
    IDLE,
  );

  // Close on a fresh successful result; see PostComposer for why this is a
  // render-phase adjustment rather than an effect.
  const [seen, setSeen] = useState(state);
  if (seen !== state) {
    setSeen(state);
    if (state.ok) setOpen(false);
  }

  return (
    <>
      <IconButton
        size="md"
        aria-label={`Edit ${chapter.name}`}
        title="Edit chapter"
        onClick={() => setOpen(true)}
      >
        <PencilIcon />
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
            aria-label="Edit chapter"
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
                  Edit chapter
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

              <Field label="Chapter name" htmlFor="c-name">
                <Input
                  id="c-name"
                  name="name"
                  required
                  defaultValue={chapter.name}
                />
              </Field>
              <Field label="Location" htmlFor="c-location">
                <Input
                  id="c-location"
                  name="location"
                  required
                  defaultValue={chapter.location}
                />
              </Field>

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
                <Button type="submit" disabled={pending}>
                  {pending ? "Saving…" : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
