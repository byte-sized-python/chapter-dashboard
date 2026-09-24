import {
  AssignMemberCard,
  CreateChapterCard,
  MembershipTable,
} from "@/components/PeopleManager";
import { PageHeader } from "@/components/ui";
import { requireHqAdmin } from "@/lib/access";
import { listChapters, listMemberships } from "@/lib/data";

export default async function PeoplePage() {
  await requireHqAdmin();

  const [chapters, memberships] = await Promise.all([
    listChapters(),
    listMemberships(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="HQ Admin"
        title="People & chapters"
        sub="Create chapters and control who can sign in to each one."
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <CreateChapterCard />
        </div>
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <AssignMemberCard chapters={chapters} />
        </div>
      </div>

      <MembershipTable memberships={memberships} chapters={chapters} />
    </>
  );
}
