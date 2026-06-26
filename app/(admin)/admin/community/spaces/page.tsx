import { SpaceCard } from "@/components/community/space-card";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCommunitySpaces } from "@/lib/community/service";

export default async function AdminCommunitySpacesPage() {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_community");
  const spaces = await getCommunitySpaces(user);

  return (
    <div className="space-y-6">
      <section className="rounded-[2.25rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)] sm:p-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Spaces</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Create and manage organization community areas. Space creation is available through the API and admin workflows.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {spaces.map((space) => <SpaceCard href={`/app/community/${space.slug}`} key={space.id} space={space} />)}
      </div>
    </div>
  );
}
