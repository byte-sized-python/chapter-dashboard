"use client";

import { useActionState } from "react";

import { deletePostAction } from "@/app/actions";
import { IDLE } from "@/lib/action-state";
import { IconButton } from "./ui";
import { TrashIcon } from "./icons";

export function DeletePostButton({ postId }: { postId: string }) {
  const [, formAction, pending] = useActionState(deletePostAction, IDLE);

  return (
    <form action={formAction} style={{ display: "inline-flex" }}>
      <input type="hidden" name="postId" value={postId} />
      <IconButton
        type="submit"
        size="md"
        aria-label="Delete post"
        title="Delete post"
        disabled={pending}
      >
        <TrashIcon />
      </IconButton>
    </form>
  );
}
