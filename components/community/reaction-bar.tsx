"use client";

import { useRouter } from "next/navigation";

import { reactionIcons, reactionLabels } from "@/lib/community/config";

type ReactionType = keyof typeof reactionLabels;

export function ReactionBar({
  postId,
  reactions,
  compact = false,
}: {
  postId: string;
  reactions: Array<{ type: ReactionType; userId: string }>;
  compact?: boolean;
}) {
  const router = useRouter();

  async function react(type: ReactionType) {
    await fetch(`/api/community/posts/${postId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, target: "post" }),
    });
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2" aria-label="Post reactions">
      {(Object.keys(reactionLabels) as ReactionType[]).map((type) => {
        const count = reactions.filter((reaction) => reaction.type === type).length;
        return (
          <button
            className={`${compact ? "min-h-9 px-3" : "min-h-10 px-3"} rounded-2xl bg-surface text-sm font-medium text-foreground transition hover:bg-[#6E4BD8]/10 motion-reduce:transition-none`}
            key={type}
            onClick={() => react(type)}
            type="button"
          >
            <span aria-hidden="true">{reactionIcons[type]}</span> {compact ? count : `${reactionLabels[type]} ${count}`}
          </button>
        );
      })}
    </div>
  );
}
