import Link from "next/link";

import { CommunityFeed } from "@/components/community/community-feed";
import { SpaceCard } from "@/components/community/space-card";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCommunityHomeData } from "@/lib/community/service";

export default async function AdminCommunityPage() {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_community");
  const { posts, spaces } = await getCommunityHomeData(user, {});

  return (
    <div className="space-y-6">
      <section className="rounded-[2.25rem] bg-gradient-to-br from-[#172B4D] via-[#1E4E9A] to-[#29B7E5] p-5 text-white shadow-[0_24px_60px_rgba(30,78,154,0.24)] sm:p-6">
        <p className="text-sm font-medium text-white/80">Admin Community</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Community operations</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">Manage spaces, pin announcements, and keep the organization conversation healthy.</p>
      </section>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link className="rounded-[2rem] bg-white p-5 font-semibold text-foreground shadow-[0_18px_45px_rgba(23,43,77,0.08)]" href="/admin/community/spaces">Manage spaces</Link>
        <Link className="rounded-[2rem] bg-white p-5 font-semibold text-foreground shadow-[0_18px_45px_rgba(23,43,77,0.08)]" href="/admin/community/moderation">Moderation queue</Link>
        <Link className="rounded-[2rem] bg-[#6E4BD8] p-5 font-semibold text-white shadow-[0_18px_45px_rgba(110,75,216,0.22)]" href="/app/community">Open community</Link>
      </div>
      <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="space-y-3">
          {spaces.slice(0, 6).map((space) => <SpaceCard href="/admin/community/spaces" key={space.id} space={space} />)}
        </aside>
        <CommunityFeed posts={posts} />
      </div>
    </div>
  );
}
