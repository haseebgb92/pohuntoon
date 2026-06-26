import { CommentThread } from "@/components/community/comment-thread";
import { PostCard } from "@/components/community/post-card";
import { ReactionBar } from "@/components/community/reaction-bar";
import type { CommunityPostWithDetails } from "@/lib/community/types";

export function PostDetail({ post, relatedPosts }: { post: CommunityPostWithDetails; relatedPosts: CommunityPostWithDetails[] }) {
  return (
    <div className="space-y-5">
      <PostCard post={post} />
      {Array.isArray(post.attachments) && post.attachments.length > 0 ? (
        <section className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
          <h2 className="text-base font-semibold text-foreground">Attachments</h2>
          <p className="mt-2 text-sm text-muted-foreground">Attachment preview is ready for file storage integration.</p>
        </section>
      ) : null}
      <section className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
        <h2 className="mb-3 text-base font-semibold text-foreground">Reactions</h2>
        <ReactionBar postId={post.id} reactions={post.reactions} />
      </section>
      <CommentThread comments={post.comments} postId={post.id} />
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Related posts</h2>
        {relatedPosts.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-5 text-sm text-muted-foreground shadow-[0_12px_28px_rgba(23,43,77,0.07)]">No related posts yet.</div>
        ) : (
          relatedPosts.map((item) => <PostCard key={item.id} post={item} />)
        )}
      </section>
    </div>
  );
}
