import Link from "next/link";
import { MessageCircle, MoreHorizontal, Share2 } from "lucide-react";

import { ReportButton, SavedButton } from "@/components/community/post-actions";
import { ReactionBar } from "@/components/community/reaction-bar";
import { communityTypeLabels } from "@/lib/community/config";
import type { CommunityPostWithDetails } from "@/lib/community/types";
import { formatLeadDateTime } from "@/lib/leads/format";

function initials(name?: string | null) {
  return (name || "P").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function PostCard({ post }: { post: CommunityPostWithDetails }) {
  const saved = post.savedBy.length > 0;
  const preview = post.body.length > 220 ? `${post.body.slice(0, 220)}...` : post.body;

  return (
    <article className="rounded-[2rem] bg-white p-4 shadow-[0_18px_45px_rgba(23,43,77,0.08)] transition hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#6E4BD8]/10 text-sm font-bold text-[#6E4BD8]">
          {initials(post.author?.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">{post.author?.name || "Pohuntoon member"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="rounded-full bg-[#29B7E5]/10 px-2 py-1 text-[#1E4E9A]">{post.author?.role || "PARTNER"}</span>
                <span className="mx-2">•</span>
                <Link className="font-medium" href={`/app/community/${post.space.slug}`}>{post.space.name}</Link>
                <span className="mx-2">•</span>
                {formatLeadDateTime(post.createdAt)}
              </p>
            </div>
            <button className="rounded-2xl p-2 text-muted-foreground" type="button" aria-label="More post actions">
              <MoreHorizontal className="size-5" />
            </button>
          </div>
          <div className="mt-4 space-y-2">
            <span className="inline-flex rounded-full bg-[#F5A623]/20 px-3 py-1 text-xs font-semibold text-[#7A4C00]">{communityTypeLabels[post.type]}</span>
            <Link href={`/app/community/post/${post.id}`}>
              <h2 className="mt-2 text-lg font-semibold leading-7 text-foreground">{post.title}</h2>
            </Link>
            <p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">{preview}</p>
          </div>
          {Array.isArray(post.attachments) && post.attachments.length > 0 ? (
            <div className="mt-4 rounded-3xl bg-surface p-4 text-sm text-muted-foreground">{post.attachments.length} attachment preview</div>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ReactionBar compact postId={post.id} reactions={post.reactions} />
            <Link className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-surface px-3 text-sm font-medium text-foreground" href={`/app/community/post/${post.id}`}>
              <MessageCircle className="size-4" /> {post._count.comments} Reply
            </Link>
            <SavedButton postId={post.id} saved={saved} />
            <button className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-surface px-3 text-sm font-medium text-muted-foreground" type="button">
              <Share2 className="size-4" /> Share
            </button>
            <ReportButton postId={post.id} />
          </div>
        </div>
      </div>
    </article>
  );
}
