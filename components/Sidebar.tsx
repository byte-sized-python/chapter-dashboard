"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Avatar, Badge } from "./ui";
import { BuildingIcon, ClipboardIcon, FeedIcon, LogOutIcon, UsersIcon } from "./icons";

export type NavItem = {
  href: string;
  label: string;
  icon: "feed" | "users" | "building" | "clipboard";
  /** Red count badge, e.g. chapters missing this month's report. */
  badge?: number;
  /** Small coral dot, e.g. this chapter's report is still due. */
  dot?: boolean;
};

const ICONS: Record<NavItem["icon"], ReactNode> = {
  feed: <FeedIcon />,
  users: <UsersIcon />,
  building: <BuildingIcon />,
  clipboard: <ClipboardIcon />,
};

function initialsFor(name: string | null, email: string): string {
  const source = (name ?? "").trim();
  if (source) {
    const parts = source.split(/\s+/);
    const letters =
      parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0];
    return letters.toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function Sidebar({
  items,
  userName,
  userEmail,
  userRole,
}: {
  items: NavItem[];
  userName: string | null;
  userEmail: string;
  userRole: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      style={{
        width: 232,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100dvh",
        alignSelf: "flex-start",
        borderRight: "1px solid var(--border)",
        background: "rgba(255,255,255,0.9)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: "20px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 6px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-mark-rounded.svg"
          alt="Byte-Sized Python"
          style={{ width: 34, height: 34, display: "block" }}
        />
        <div
          style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Chapter Hub
          </span>
          <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
            Byte-Sized Python
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`bsp-nav-item ${active ? "bsp-nav-item--active" : ""}`}
            >
              {ICONS[item.icon]}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? <Badge variant="danger">{item.badge}</Badge> : null}
              {item.dot ? (
                <span
                  aria-label="Report due"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: "var(--bsp-coral)",
                  }}
                />
              ) : null}
            </Link>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 6px 0",
          borderTop: "1px solid var(--border)",
        }}
      >
        <Avatar initials={initialsFor(userName, userEmail)} size="md" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.25,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={userEmail}
          >
            {userName ?? userEmail}
          </span>
          <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
            {userRole}
          </span>
        </div>
      </div>

      <a
        href="/auth/logout"
        className="bsp-nav-item"
        style={{ fontSize: 13, fontWeight: 500, minHeight: 36 }}
      >
        <LogOutIcon />
        <span>Sign out</span>
      </a>
    </nav>
  );
}
