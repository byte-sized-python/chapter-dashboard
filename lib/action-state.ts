/**
 * Shared shape for useActionState results. Lives outside app/actions/index.ts
 * because that file has "use server" — Next.js only allows a "use server"
 * module to export async functions, so a plain object like IDLE (or a type)
 * can't be exported from there without breaking the server/client boundary.
 */
export type ActionState = { error: string | null; ok: boolean };

export const IDLE: ActionState = { error: null, ok: false };
