import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Firestore admin handle.
 *
 * Credentials resolve in this order:
 *   1. FIREBASE_SERVICE_ACCOUNT_KEY — the service account JSON, inline.
 *      Vercel env vars are single-line, so the JSON may also be base64 encoded.
 *   2. Application Default Credentials (GOOGLE_APPLICATION_CREDENTIALS, or the
 *      ambient service account when running on Google infrastructure).
 */
function credentialFromEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return undefined;

  const json = raw.trimStart().startsWith("{")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");

  const parsed = JSON.parse(json) as {
    project_id: string;
    client_email: string;
    private_key: string;
  };

  return cert({
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    // Vercel stores newlines escaped; restore them or the key won't parse.
    privateKey: parsed.private_key.replace(/\\n/g, "\n"),
  });
}

function firebaseApp() {
  if (getApps().length) return getApp();

  const credential = credentialFromEnv();
  return initializeApp({
    ...(credential ? { credential } : {}),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const db = getFirestore(firebaseApp());
