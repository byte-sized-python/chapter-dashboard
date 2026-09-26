"use client";

import { useActionState, useEffect, useState } from "react";

import { createPostAction } from "@/app/actions";
import { IDLE } from "@/lib/action-state";
import { POST_CATEGORIES, POST_CATEGORY_LABELS } from "@/lib/types";
import { Button, Field, IconButton, Input, Textarea, ErrorNote } from "./ui";
import { CloseIcon, PlusIcon } from "./icons";

export function PostComposer() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>("announcement");
  const [state, formAction, pending] = useActionState(createPostAction, IDLE);

  // Close once the post actually saved. This has to be an effect, not a
  // render-phase state adjustment: the latter fires while the Server Action's
  // response is still being applied by the Router, and React throws "Cannot
  // update a component (Router) while rendering a different component".
  useEffect(() => {
    if (state.ok) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
      setCategory("announcement");
    }
  }, [state]);

  // Escape closes the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Button size="lg" onClick={() => setOpen(true)}>
        <PlusIcon />
        New post
      </Button>

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
            aria-label="New post"
            style={{
              width: "100%",
              maxWidth: 600,
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
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading)",
                      fontSize: 22,
                      fontWeight: 700,
                    }}
                  >
                    New post
                  </h2>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 14,
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Visible to every chapter instructor.
                  </p>
                </div>
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

              <Field label="Title" htmlFor="p-title">
                <Input
                  id="p-title"
                  name="title"
                  autoFocus
                  required
                  placeholder="What's the update?"
                />
              </Field>

              <div>
                <span className="bsp-field-label">Category</span>
                <input type="hidden" name="category" value={category} />
                <div className="bsp-segmented" role="radiogroup">
                  {POST_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={category === c}
                      onClick={() => setCategory(c)}
                      className={`bsp-segmented__item ${
                        category === c ? "bsp-segmented__item--active" : ""
                      }`}
                    >
                      {POST_CATEGORY_LABELS[c]}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Body" htmlFor="p-body">
                <Textarea
                  id="p-body"
                  name="body"
                  rows={6}
                  required
                  placeholder="Write the details instructors need."
                />
              </Field>

              <Field label="Link (optional)" htmlFor="p-link">
                <Input
                  id="p-link"
                  name="link"
                  type="url"
                  placeholder="https://"
                />
              </Field>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  paddingTop: 4,
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
                  {pending ? "Posting…" : "Publish"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
