"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { CommunityPostWithDetails } from "@/lib/community/types";
import { formatLeadDateTime } from "@/lib/leads/format";

function initials(name?: string | null) {
  return (name || "P").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

type Comment = CommunityPostWithDetails["comments"][number];

export function CommentThread({ postId, comments }: { postId: string; comments: Comment[] }) {
  const router = useRouter();
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setMessage(null);
    const response = await fetch(`/api/community/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: String(formData.get("body")), parentId: replyTo }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Unable to add comment." }));
      setMessage(payload.error || "Unable to add comment.");
      return;
    }

    setReplyTo(null);
    router.refresh();
  }

  return (
    <section className="space-y-4" aria-label="Comments">
      <form action={submit} className="rounded-[2rem] bg-white p-4 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
        <textarea className="min-h-24 w-full rounded-2xl border border-input px-3 py-3 text-sm" name="body" placeholder={replyTo ? "Write a reply..." : "Add a comment..."} required />
        {message ? <p className="mt-2 text-sm text-muted-foreground">{message}</p> : null}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button className="min-h-11 rounded-2xl bg-[#6E4BD8] px-4 text-sm font-semibold text-white" type="submit">Comment</button>
          {replyTo ? <button className="min-h-11 rounded-2xl bg-surface px-4 text-sm font-medium" onClick={() => setReplyTo(null)} type="button">Cancel reply</button> : null}
        </div>
      </form>
      <div className="space-y-3">
        {comments.map((comment) => (
          <article className="rounded-[2rem] bg-white p-4 shadow-[0_12px_28px_rgba(23,43,77,0.07)]" key={comment.id}>
            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#29B7E5]/10 text-xs font-bold text-[#1E4E9A]">{initials(comment.author?.name)}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{comment.author?.name || "Pohuntoon member"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatLeadDateTime(comment.createdAt)}</p>
                <p className="mt-3 text-sm leading-6 text-foreground whitespace-pre-line">{comment.body}</p>
                <button className="mt-3 min-h-10 rounded-2xl bg-surface px-3 text-sm font-medium text-[#6E4BD8]" onClick={() => setReplyTo(comment.id)} type="button">Reply</button>
                {comment.replies.length > 0 ? (
                  <div className="mt-4 space-y-3 border-l border-border pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <p className="text-xs font-semibold text-foreground">{reply.author?.name || "Pohuntoon member"}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
