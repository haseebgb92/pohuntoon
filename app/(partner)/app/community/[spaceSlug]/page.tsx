import { notFound } from "next/navigation";

import { CommunityFeed } from "@/components/community/community-feed";
import { PostComposer } from "@/components/community/post-composer";
import { SpaceCard } from "@/components/community/space-card";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCommunitySpaceData } from "@/lib/community/service";

export default async function CommunitySpacePage({ params }: { params: Promise<{ spaceSlug: string }> }) {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_community");
  const { spaceSlug } = await params;
  const data = await getCommunitySpaceData(user, spaceSlug);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2.25rem] p-5 text-white shadow-[0_24px_60px_rgba(110,75,216,0.25)] sm:p-6" style={{ background: `linear-gradient(135deg, ${data.space.color}, #29B7E5)` }}>
        <p className="text-sm font-medium text-white/80">Community Space</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{data.space.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">{data.space.description}</p>
      </section>
      <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SpaceCard space={data.space} />
        </aside>
        <main className="space-y-4">
          <PostComposer spaces={data.spaces} />
          <CommunityFeed posts={data.posts} />
        </main>
      </div>
    </div>
  );
}
