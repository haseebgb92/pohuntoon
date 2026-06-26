import { z } from "zod";

export const notificationCategories = [
  "all",
  "unread",
  "training",
  "leads",
  "resources",
  "community",
  "system",
] as const;

export const notificationFilterSchema = z.object({
  category: z.enum(notificationCategories).optional().default("all"),
  cursor: z.string().trim().optional(),
});

export const notificationPreferenceSchema = z.object({
  training: z.coerce.boolean().default(true),
  leadUpdates: z.coerce.boolean().default(true),
  announcements: z.coerce.boolean().default(true),
  browserPush: z.coerce.boolean().default(false),
  email: z.coerce.boolean().default(false),
  quietHours: z.string().trim().max(80).optional().default(""),
  digestFrequency: z.enum(["IMMEDIATE", "DAILY", "WEEKLY"]).optional().default("IMMEDIATE"),
});

export const notificationSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export type NotificationCategory = (typeof notificationCategories)[number];
export type NotificationFilterInput = z.infer<typeof notificationFilterSchema>;
export type NotificationPreferenceInput = z.infer<typeof notificationPreferenceSchema>;
export type NotificationSubscriptionInput = z.infer<typeof notificationSubscriptionSchema>;
