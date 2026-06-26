import { PostCard } from "@/components/community/post-card";
import type { CommunityPostWithDetails } from "@/lib/community/types";

export function EmptyCommunityState() {
  return (
    <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-[#6E4BD8]/10 text-2xl">💬</div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">Start the conversation</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Ask a question, celebrate a win, or share an idea with your partner community.</p>
    </div>
  );
}

export function CommunityFeed({ posts }: { posts: CommunityPostWithDetails[] }) {
  if (posts.length === 0) {
    return <EmptyCommunityState />;
  }

  return (
    <section className="space-y-4" aria-label="Community feed">
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
      <div className="rounded-[2rem] border border-dashed border-border bg-white/70 p-5 text-center text-sm text-muted-foreground">
        More posts load as the feed grows.
      </div>
    </section>
  );
}
