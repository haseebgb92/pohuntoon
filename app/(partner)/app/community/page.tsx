import Link from "next/link";

import { CommunityFeed } from "@/components/community/community-feed";
import { PostComposer } from "@/components/community/post-composer";
import { SpaceCard } from "@/components/community/space-card";
import { SpaceTabs } from "@/components/community/space-tabs";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCommunityHomeData } from "@/lib/community/service";

export default async function CommunityPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_community");
  const params = await searchParams;
  const { posts, spaces, members } = await getCommunityHomeData(user, params);

  return (
    <div className="space-y-6">
      <section className="rounded-[2.25rem] bg-gradient-to-br from-[#6E4BD8] via-[#7559DD] to-[#29B7E5] p-5 text-white shadow-[0_24px_60px_rgba(110,75,216,0.25)] sm:p-6">
        <p className="text-sm font-medium text-white/80">Pohuntoon Community</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Share ideas. Ask questions. Celebrate wins.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">A focused social layer for partners and teams, built around spaces instead of noisy feeds.</p>
      </section>
      <SpaceTabs />
      <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)_20rem]">
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-sm font-semibold text-muted-foreground">Spaces</h2>
          {spaces.slice(0, 6).map((space) => <SpaceCard key={space.id} space={space} />)}
        </aside>
        <main className="space-y-4">
          <PostComposer spaces={spaces} />
          <CommunityFeed posts={posts} />
        </main>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
            <h2 className="text-base font-semibold text-foreground">Members</h2>
            <div className="mt-4 space-y-3">
              {members.map((member) => (
                <div className="flex items-center gap-3" key={member.id}>
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-[#6E4BD8]/10 text-xs font-bold text-[#6E4BD8]">{member.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
            <h2 className="text-base font-semibold text-foreground">Events</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Community events, webinars, and office hours will appear here.</p>
            <Link className="mt-4 inline-flex min-h-10 items-center rounded-2xl bg-surface px-4 text-sm font-medium text-[#6E4BD8]" href="/app/notifications">Notify me</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
