import { NotificationType, type Prisma } from "@prisma/client";

import { adminRoles } from "@/lib/auth/permissions";
import type { AuthenticatedAppUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/db/prisma";
import { createNotificationEvent } from "@/lib/notifications/service";
import { defaultCommunitySpaces } from "@/lib/community/config";
import {
  communityCommentSchema,
  communityFeedFilterSchema,
  communityPostSchema,
  communityPostUpdateSchema,
  communityReactionSchema,
  communityReportSchema,
  communitySpaceSchema,
  moderationSchema,
} from "@/lib/community/schemas";

function canModerateCommunity(user: AuthenticatedAppUser) {
  return adminRoles.includes(user.role);
}

function spaceVisibilityWhere(user: AuthenticatedAppUser): Prisma.CommunitySpaceWhereInput {
  if (canModerateCommunity(user)) {
    return {};
  }

  return { visibility: { in: ["PUBLIC", "PRIVATE"] } };
}

function postInclude(userId: string) {
  return {
    author: { select: { id: true, name: true, avatarUrl: true, role: true } },
    space: { select: { id: true, name: true, slug: true, color: true, icon: true } },
    reactions: { select: { id: true, type: true, userId: true } },
    savedBy: { where: { userId }, select: { id: true, userId: true } },
    comments: {
      where: { parentId: null, deletedAt: null, isHidden: false },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true, role: true } },
        reactions: { select: { id: true, type: true, userId: true } },
        replies: {
          where: { deletedAt: null, isHidden: false },
          include: {
            author: { select: { id: true, name: true, avatarUrl: true, role: true } },
            reactions: { select: { id: true, type: true, userId: true } },
          },
          orderBy: { createdAt: "asc" as const },
          take: 8,
        },
      },
      orderBy: { createdAt: "asc" as const },
      take: 8,
    },
    _count: { select: { comments: true, reactions: true, savedBy: true } },
  } satisfies Prisma.CommunityPostInclude;
}

export async function ensureDefaultCommunitySpaces(user: AuthenticatedAppUser) {
  await Promise.all(
    defaultCommunitySpaces.map((space) =>
      prisma.communitySpace.upsert({
        where: { organizationId_slug: { organizationId: user.organizationId, slug: space.slug } },
        update: {},
        create: {
          organizationId: user.organizationId,
          createdById: user.id,
          ...space,
        },
      }),
    ),
  );
}

export async function getCommunityHomeData(
  user: AuthenticatedAppUser,
  search: Record<string, string | undefined>,
) {
  await ensureDefaultCommunitySpaces(user);
  const filters = communityFeedFilterSchema.parse(search);
  const spaces = await getCommunitySpaces(user);
  const space = filters.space ? spaces.find((item) => item.slug === filters.space) : null;

  const postWhere: Prisma.CommunityPostWhereInput = {
    organizationId: user.organizationId,
    deletedAt: null,
    isHidden: false,
    space: spaceVisibilityWhere(user),
  };

  if (space) {
    postWhere.spaceId = space.id;
  }

  if (filters.tab === "announcements") {
    postWhere.type = "ANNOUNCEMENT";
  } else if (filters.tab === "questions") {
    postWhere.type = "QUESTION";
  } else if (filters.tab === "wins") {
    postWhere.type = "WIN";
  } else if (filters.tab === "training") {
    postWhere.OR = [{ type: "RESOURCE_SHARE" }, { space: { slug: "sales-training" } }];
  } else if (filters.tab === "support") {
    postWhere.space = { ...spaceVisibilityWhere(user), slug: "support" };
  }

  const [posts, members] = await Promise.all([
    prisma.communityPost.findMany({
      where: postWhere,
      include: postInclude(user.id),
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 20,
    }),
    prisma.user.findMany({
      where: { organizationId: user.organizationId, status: "ACTIVE" },
      select: { id: true, name: true, avatarUrl: true, role: true },
      orderBy: { name: "asc" },
      take: 12,
    }),
  ]);

  return { filters, posts, spaces, members };
}

export async function getCommunitySpaces(user: AuthenticatedAppUser) {
  return prisma.communitySpace.findMany({
    where: {
      organizationId: user.organizationId,
      isArchived: false,
      ...spaceVisibilityWhere(user),
    },
    orderBy: [{ postCount: "desc" }, { name: "asc" }],
  });
}

export async function getCommunitySpaceData(user: AuthenticatedAppUser, spaceSlug: string) {
  await ensureDefaultCommunitySpaces(user);
  const space = await prisma.communitySpace.findFirst({
    where: {
      organizationId: user.organizationId,
      slug: spaceSlug,
      isArchived: false,
      ...spaceVisibilityWhere(user),
    },
  });

  if (!space) {
    return null;
  }

  const data = await getCommunityHomeData(user, { space: spaceSlug });
  return { ...data, space };
}

export async function getCommunityPostDetail(user: AuthenticatedAppUser, postId: string) {
  return prisma.communityPost.findFirst({
    where: {
      id: postId,
      organizationId: user.organizationId,
      deletedAt: null,
      isHidden: canModerateCommunity(user) ? undefined : false,
      space: spaceVisibilityWhere(user),
    },
    include: postInclude(user.id),
  });
}

async function notifyCommunityRecipients(user: AuthenticatedAppUser, postId: string, title: string, message: string) {
  const recipients = await prisma.user.findMany({
    where: {
      organizationId: user.organizationId,
      status: "ACTIVE",
      id: { not: user.id },
    },
    select: { id: true, organizationId: true },
    take: 50,
  });

  await createNotificationEvent({
    title,
    message,
    type: NotificationType.COMMUNITY,
    linkUrl: `/app/community/post/${postId}`,
    entityType: "community_post",
    entityId: postId,
    recipients: recipients.map((recipient) => ({ userId: recipient.id, organizationId: recipient.organizationId })),
  });
}

export async function createCommunityPost(user: AuthenticatedAppUser, payload: unknown) {
  const parsed = communityPostSchema.parse(payload);
  const space = await prisma.communitySpace.findFirst({
    where: {
      id: parsed.spaceId,
      organizationId: user.organizationId,
      isArchived: false,
      ...spaceVisibilityWhere(user),
    },
  });

  if (!space) {
    throw new Error("Community space not found.");
  }

  if (parsed.type === "ANNOUNCEMENT" && !canModerateCommunity(user)) {
    throw new Error("Only admins can publish announcements.");
  }

  const post = await prisma.communityPost.create({
    data: {
      organizationId: user.organizationId,
      spaceId: parsed.spaceId,
      authorId: user.id,
      type: parsed.type,
      title: parsed.title,
      body: parsed.body,
      attachments: parsed.attachments.length ? parsed.attachments : undefined,
      pollOptions: parsed.pollOptions.length ? parsed.pollOptions : undefined,
    },
  });

  await prisma.communitySpace.update({ where: { id: parsed.spaceId }, data: { postCount: { increment: 1 } } });
  await prisma.activityLog.create({
    data: {
      organizationId: user.organizationId,
      userId: user.id,
      action: "community.post.created",
      entityType: "community_post",
      entityId: post.id,
      metadata: { description: `${user.name} shared ${parsed.title}` },
    },
  });

  if (parsed.type === "ANNOUNCEMENT") {
    await notifyCommunityRecipients(user, post.id, "New community announcement", parsed.title);
  }

  return post;
}

export async function updateCommunityPost(user: AuthenticatedAppUser, postId: string, payload: unknown) {
  const parsed = communityPostUpdateSchema.parse(payload);
  const post = await prisma.communityPost.findFirst({ where: { id: postId, organizationId: user.organizationId } });

  if (!post) {
    throw new Error("Post not found.");
  }

  if (post.authorId !== user.id && !canModerateCommunity(user)) {
    throw new Error("You do not have permission to update this post.");
  }

  return prisma.communityPost.update({
    where: { id: postId },
    data: {
      title: parsed.title,
      body: parsed.body,
      type: parsed.type,
      attachments: parsed.attachments,
      pollOptions: parsed.pollOptions,
      isPinned: canModerateCommunity(user) ? parsed.isPinned : undefined,
      isHidden: canModerateCommunity(user) ? parsed.isHidden : undefined,
    },
  });
}

export async function deleteCommunityPost(user: AuthenticatedAppUser, postId: string) {
  const post = await prisma.communityPost.findFirst({ where: { id: postId, organizationId: user.organizationId } });

  if (!post) {
    throw new Error("Post not found.");
  }

  if (post.authorId !== user.id && !canModerateCommunity(user)) {
    throw new Error("You do not have permission to delete this post.");
  }

  return prisma.communityPost.update({ where: { id: postId }, data: { deletedAt: new Date() } });
}

export async function createCommunityComment(user: AuthenticatedAppUser, postId: string, payload: unknown) {
  const parsed = communityCommentSchema.parse(payload);
  const post = await getCommunityPostDetail(user, postId);

  if (!post) {
    throw new Error("Post not found.");
  }

  if (parsed.parentId) {
    const parent = await prisma.communityComment.findFirst({
      where: { id: parsed.parentId, postId, organizationId: user.organizationId, parentId: null },
    });

    if (!parent) {
      throw new Error("Parent comment not found.");
    }
  }

  const comment = await prisma.communityComment.create({
    data: {
      organizationId: user.organizationId,
      postId,
      authorId: user.id,
      parentId: parsed.parentId || null,
      body: parsed.body,
    },
  });

  if (post.authorId && post.authorId !== user.id) {
    await createNotificationEvent({
      title: parsed.parentId ? "New comment reply" : "New post reply",
      message: `${user.name} replied to ${post.title}`,
      type: NotificationType.COMMUNITY,
      linkUrl: `/app/community/post/${postId}`,
      entityType: "community_comment",
      entityId: comment.id,
      recipients: [{ userId: post.authorId, organizationId: user.organizationId }],
    });
  }

  return comment;
}

export async function updateCommunityComment(user: AuthenticatedAppUser, commentId: string, body: string) {
  const comment = await prisma.communityComment.findFirst({ where: { id: commentId, organizationId: user.organizationId } });

  if (!comment) {
    throw new Error("Comment not found.");
  }

  if (comment.authorId !== user.id && !canModerateCommunity(user)) {
    throw new Error("You do not have permission to update this comment.");
  }

  const parsed = communityCommentSchema.parse({ body });
  return prisma.communityComment.update({ where: { id: commentId }, data: { body: parsed.body } });
}

export async function deleteCommunityComment(user: AuthenticatedAppUser, commentId: string) {
  const comment = await prisma.communityComment.findFirst({ where: { id: commentId, organizationId: user.organizationId } });

  if (!comment) {
    throw new Error("Comment not found.");
  }

  if (comment.authorId !== user.id && !canModerateCommunity(user)) {
    throw new Error("You do not have permission to delete this comment.");
  }

  return prisma.communityComment.update({ where: { id: commentId }, data: { deletedAt: new Date() } });
}

export async function reactToCommunityPost(user: AuthenticatedAppUser, postId: string, payload: unknown) {
  const parsed = communityReactionSchema.parse(payload);

  if (parsed.target === "comment") {
    if (!parsed.commentId) {
      throw new Error("Comment is required.");
    }

    const existing = await prisma.communityReaction.findUnique({
      where: { userId_commentId_type: { userId: user.id, commentId: parsed.commentId, type: parsed.type } },
    });

    if (existing) {
      await prisma.communityReaction.delete({ where: { id: existing.id } });
      return { active: false };
    }

    await prisma.communityReaction.create({
      data: { organizationId: user.organizationId, userId: user.id, commentId: parsed.commentId, type: parsed.type },
    });
    return { active: true };
  }

  const existing = await prisma.communityReaction.findUnique({
    where: { userId_postId_type: { userId: user.id, postId, type: parsed.type } },
  });

  if (existing) {
    await prisma.communityReaction.delete({ where: { id: existing.id } });
    return { active: false };
  }

  await prisma.communityReaction.create({
    data: { organizationId: user.organizationId, userId: user.id, postId, type: parsed.type },
  });
  return { active: true };
}

export async function toggleSavedPost(user: AuthenticatedAppUser, postId: string) {
  const existing = await prisma.savedPost.findUnique({ where: { userId_postId: { userId: user.id, postId } } });

  if (existing) {
    await prisma.savedPost.delete({ where: { id: existing.id } });
    return { saved: false };
  }

  await prisma.savedPost.create({ data: { organizationId: user.organizationId, userId: user.id, postId } });
  return { saved: true };
}

export async function reportCommunityContent(user: AuthenticatedAppUser, payload: unknown) {
  const parsed = communityReportSchema.parse(payload);

  return prisma.reportedContent.create({
    data: {
      organizationId: user.organizationId,
      reporterId: user.id,
      contentType: parsed.contentType,
      postId: parsed.postId,
      commentId: parsed.commentId,
      reason: parsed.reason,
    },
  });
}

export async function createCommunitySpace(user: AuthenticatedAppUser, payload: unknown) {
  if (!canModerateCommunity(user)) {
    throw new Error("You do not have permission to manage spaces.");
  }

  const parsed = communitySpaceSchema.parse(payload);
  return prisma.communitySpace.create({
    data: {
      organizationId: user.organizationId,
      createdById: user.id,
      ...parsed,
    },
  });
}

export async function getModerationQueue(user: AuthenticatedAppUser) {
  if (!canModerateCommunity(user)) {
    throw new Error("You do not have permission to moderate community content.");
  }

  return prisma.reportedContent.findMany({
    where: { organizationId: user.organizationId, status: "OPEN" },
    include: {
      reporter: { select: { id: true, name: true, role: true } },
      post: { select: { id: true, title: true, body: true, author: { select: { id: true, name: true } } } },
      comment: { select: { id: true, body: true, author: { select: { id: true, name: true } }, postId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function moderateCommunityContent(user: AuthenticatedAppUser, payload: unknown) {
  if (!canModerateCommunity(user)) {
    throw new Error("You do not have permission to moderate community content.");
  }

  const parsed = moderationSchema.parse(payload);

  if (parsed.action === "HIDE_POST" && parsed.postId) {
    await prisma.communityPost.update({ where: { id: parsed.postId }, data: { isHidden: true } });
  }

  if (parsed.action === "DELETE_POST" && parsed.postId) {
    await prisma.communityPost.update({ where: { id: parsed.postId }, data: { deletedAt: new Date() } });
  }

  if (parsed.action === "DELETE_COMMENT" && parsed.commentId) {
    await prisma.communityComment.update({ where: { id: parsed.commentId }, data: { deletedAt: new Date() } });
  }

  if (parsed.reportId) {
    await prisma.reportedContent.update({
      where: { id: parsed.reportId },
      data: { status: parsed.action === "DISMISS_REPORT" ? "DISMISSED" : "REVIEWED", moderatorId: user.id },
    });
  }
}
