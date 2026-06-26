import type { Prisma } from "@prisma/client";

export type CommunityPostWithDetails = Prisma.CommunityPostGetPayload<{
  include: {
    author: { select: { id: true; name: true; avatarUrl: true; role: true } };
    space: { select: { id: true; name: true; slug: true; color: true; icon: true } };
    reactions: { select: { id: true; type: true; userId: true } };
    savedBy: { select: { id: true; userId: true } };
    comments: {
      include: {
        author: { select: { id: true; name: true; avatarUrl: true; role: true } };
        reactions: { select: { id: true; type: true; userId: true } };
        replies: {
          include: {
            author: { select: { id: true; name: true; avatarUrl: true; role: true } };
            reactions: { select: { id: true; type: true; userId: true } };
          };
        };
      };
    };
    _count: { select: { comments: true; reactions: true; savedBy: true } };
  };
}>;

export type CommunitySpaceSummary = Prisma.CommunitySpaceGetPayload<Record<string, never>>;

export type CommunityMemberSummary = {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
};

export type ModerationReport = Prisma.ReportedContentGetPayload<{
  include: {
    reporter: { select: { id: true; name: true; role: true } };
    post: { select: { id: true; title: true; body: true; author: { select: { id: true; name: true } } } };
    comment: { select: { id: true; body: true; author: { select: { id: true; name: true } }; postId: true } };
  };
}>;
