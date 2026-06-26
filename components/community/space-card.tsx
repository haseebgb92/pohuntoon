import Link from "next/link";
import { CircleHelp, GraduationCap, LifeBuoy, Megaphone, MessageCircle, MessagesSquare, Trophy } from "lucide-react";

import type { CommunitySpaceSummary } from "@/lib/community/types";
import { communityVisibilityLabels } from "@/lib/community/config";

const icons = { Megaphone, CircleHelp, GraduationCap, Trophy, MessagesSquare, LifeBuoy, MessageCircle };

function getIcon(name: string) {
  return icons[name as keyof typeof icons] ?? MessageCircle;
}

type SpaceCardProps = {
  space: CommunitySpaceSummary;
  href?: string;
};

export function SpaceCard({ space, href = `/app/community/${space.slug}` }: SpaceCardProps) {
  const Icon = getIcon(space.icon);

  return (
    <Link className="block rounded-[2rem] bg-white p-4 shadow-[0_18px_45px_rgba(23,43,77,0.08)] transition hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0" href={href}>
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: space.color }}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground">{space.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{space.description || "A focused place to collaborate."}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-surface px-2 py-1">{space.memberCount} members</span>
            <span className="rounded-full bg-surface px-2 py-1">{space.postCount} posts</span>
            <span className="rounded-full bg-surface px-2 py-1">{communityVisibilityLabels[space.visibility]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
