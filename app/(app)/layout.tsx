import { Sidebar, type NavItem } from "@/components/Sidebar";
import { requireAccess } from "@/lib/access";
import { currentMonth } from "@/lib/dates";
import {
  latestReportByChapter,
  latestReportForChapter,
  listChapters,
} from "@/lib/data";

/**
 * Layout B: fixed left sidebar + scrolling main column, over the faint
 * site gradient.
 */
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const access = await requireAccess();
  const month = currentMonth();

  let items: NavItem[];

  if (access.role === "hq_admin") {
    // Badge the Chapters tab with how many chapters still owe this month.
    const [chapters, latest] = await Promise.all([
      listChapters(),
      latestReportByChapter(),
    ]);
    const missing = chapters.filter(
      (c) => latest.get(c.id)?.month !== month,
    ).length;

    items = [
      { href: "/", label: "Feed", icon: "feed" },
      {
        href: "/chapters",
        label: "Chapters",
        icon: "users",
        badge: missing || undefined,
      },
      { href: "/people", label: "People", icon: "users" },
    ];
  } else {
    const latest = await latestReportForChapter(access.chapter.id);
    const due = latest?.month !== month;

    items = [
      { href: "/", label: "Feed", icon: "feed" },
      {
        href: "/report",
        label: "Monthly report",
        icon: "clipboard",
        dot: due,
      },
    ];
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100dvh",
        background: "var(--gradient-site)",
      }}
    >
      <Sidebar
        items={items}
        userName={access.name}
        userEmail={access.email}
        userRole={
          access.role === "hq_admin" ? "HQ Admin" : access.chapter.name
        }
      />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "32px 32px 64px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
