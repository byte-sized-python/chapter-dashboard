import { getAccess } from "@/lib/access";
import { redirect } from "next/navigation";

/**
 * Shown when Auth0 authenticated someone whose email is neither in
 * HQ_ADMIN_EMAILS nor in chapterMemberships. There is no pending state —
 * access is simply blocked until HQ adds them.
 */
export default async function NoAccessPage() {
  const access = await getAccess();
  if (!access) redirect("/auth/login");
  if (access.role !== "unassigned") redirect("/");

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--gradient-site)",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "rgba(255,255,255,0.9)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          boxShadow: "var(--shadow-card)",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          textAlign: "center",
          alignItems: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-mark-rounded.svg"
          alt="Byte-Sized Python"
          style={{ width: 48, height: 48 }}
        />
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-heading)",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          You&apos;re not in a chapter yet
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.6,
            color: "var(--slate-600)",
          }}
        >
          Your account hasn&apos;t been added to a chapter yet. Contact BSP HQ
          to get access.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)" }}>
          Signed in as {access.email}
        </p>
        <a href="/auth/logout" className="bsp-btn bsp-btn--outline bsp-btn--md">
          Sign out
        </a>
      </div>
    </main>
  );
}
