import { z } from "zod";

export const communityFeedTabs = ["all", "announcements", "questions", "wins", "training", "support"] as const;

export const communityFeedFilterSchema = z.object({
  tab: z.enum(communityFeedTabs).optional().default("all"),
  space: z.string().trim().optional(),
});

export const communityPostSchema = z.object({
  spaceId: z.string().uuid(),
  type: z.enum(["ANNOUNCEMENT", "QUESTION", "DISCUSSION", "WIN", "RESOURCE_SHARE"]),
  title: z.string().trim().min(3).max(140),
  body: z.string().trim().min(3).max(5000),
  attachments: z.array(z.object({ name: z.string().trim(), url: z.string().trim(), type: z.string().trim().optional() })).optional().default([]),
  pollOptions: z.array(z.string().trim().min(1).max(80)).max(4).optional().default([]),
});

export const communityPostUpdateSchema = communityPostSchema.partial().extend({
  isPinned: z.coerce.boolean().optional(),
  isHidden: z.coerce.boolean().optional(),
});

export const communityCommentSchema = z.object({
  body: z.string().trim().min(1).max(2000),
  parentId: z.string().uuid().optional().nullable(),
});

export const communityReactionSchema = z.object({
  type: z.enum(["LIKE", "CELEBRATE", "HELPFUL", "IDEA"]),
  target: z.enum(["post", "comment"]).default("post"),
  commentId: z.string().uuid().optional(),
});

export const communityReportSchema = z.object({
  contentType: z.enum(["POST", "COMMENT"]),
  postId: z.string().uuid().optional(),
  commentId: z.string().uuid().optional(),
  reason: z.string().trim().min(3).max(500),
});

export const communitySpaceSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  description: z.string().trim().max(300).optional().default(""),
  icon: z.string().trim().max(40).optional().default("MessageCircle"),
  color: z.string().trim().max(20).optional().default("#6E4BD8"),
  visibility: z.enum(["PUBLIC", "PRIVATE", "ADMIN_ONLY"]).default("PUBLIC"),
});

export const moderationSchema = z.object({
  reportId: z.string().uuid().optional(),
  postId: z.string().uuid().optional(),
  commentId: z.string().uuid().optional(),
  action: z.enum(["HIDE_POST", "DELETE_POST", "DELETE_COMMENT", "DISMISS_REPORT", "WARN_USER"]),
});

export type CommunityFeedTab = (typeof communityFeedTabs)[number];
export type CommunityPostInput = z.infer<typeof communityPostSchema>;
export type CommunityCommentInput = z.infer<typeof communityCommentSchema>;
export type CommunitySpaceInput = z.infer<typeof communitySpaceSchema>;
