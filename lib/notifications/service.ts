import { NotificationType, type Prisma } from "@prisma/client";

import { requireOrganizationAccess } from "@/lib/auth/guards";
import type { AuthenticatedAppUser } from "@/lib/auth/get-current-user";
import { adminRoles } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import {
  notificationFilterSchema,
  notificationPreferenceSchema,
  notificationSubscriptionSchema,
  type NotificationCategory,
} from "@/lib/notifications/schemas";

export type NotificationChannel = "IN_APP" | "BROWSER_PUSH" | "EMAIL" | "WHATSAPP";

type NotificationRecipient = {
  userId: string;
  organizationId: string;
};

type CreateNotificationEventInput = {
  title: string;
  message: string;
  type?: NotificationType;
  linkUrl?: string;
  entityType?: string;
  entityId?: string;
  recipients: NotificationRecipient[];
  channels?: NotificationChannel[];
};

const notificationTypeCategories: Record<NotificationType, NotificationCategory> = {
  SYSTEM: "system",
  TRAINING: "training",
  LEAD_UPDATE: "leads",
  RESOURCE: "resources",
  COMMUNITY: "community",
  ANNOUNCEMENT: "system",
};

function buildNotificationWhere(
  user: AuthenticatedAppUser,
  category: NotificationCategory,
): Prisma.NotificationWhereInput {
  const where: Prisma.NotificationWhereInput = {
    organizationId: user.organizationId,
    deletedAt: null,
  };

  if (!adminRoles.includes(user.role)) {
    where.userId = user.id;
  }

  if (category === "unread") {
    where.readAt = null;
  } else if (category !== "all") {
    where.type = {
      in: Object.entries(notificationTypeCategories)
        .filter(([, mappedCategory]) => mappedCategory === category)
        .map(([type]) => type as NotificationType),
    };
  }

  return where;
}

async function deliverInAppNotifications(
  payload: CreateNotificationEventInput,
  recipients: NotificationRecipient[],
) {
  if (recipients.length === 0) {
    return;
  }

  const rows: Prisma.NotificationCreateManyInput[] = recipients.map((recipient) => ({
    organizationId: recipient.organizationId,
    userId: recipient.userId,
    title: payload.title,
    message: payload.message,
    type: payload.type ?? NotificationType.LEAD_UPDATE,
    linkUrl: payload.linkUrl,
    entityType: payload.entityType,
    entityId: payload.entityId,
  }));

  await prisma.notification.createMany({ data: rows });
}

async function deliverBrowserPushNotifications(
  payload: CreateNotificationEventInput,
  recipients: NotificationRecipient[],
) {
  const recipientIds = recipients.map((recipient) => recipient.userId);

  if (recipientIds.length === 0) {
    return;
  }

  await prisma.notificationSubscription.findMany({
    where: {
      userId: { in: recipientIds },
      isActive: true,
    },
    select: { id: true },
  });

  void payload;
}

export async function createNotificationEvent(payload: CreateNotificationEventInput) {
  const channels = payload.channels ?? ["IN_APP", "BROWSER_PUSH"];
  const recipients = payload.recipients.filter(
    (recipient, index, collection) =>
      collection.findIndex((entry) => entry.userId === recipient.userId) === index,
  );

  if (channels.includes("IN_APP")) {
    await deliverInAppNotifications(payload, recipients);
  }

  if (channels.includes("BROWSER_PUSH")) {
    await deliverBrowserPushNotifications(payload, recipients);
  }
}

export async function getNotificationCenterData(
  user: AuthenticatedAppUser,
  search: Record<string, string | undefined>,
) {
  const filters = notificationFilterSchema.parse(search);
  const where = buildNotificationWhere(user, filters.category);

  const [notifications, unreadCount, activity, preferences] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: 25,
    }),
    prisma.notification.count({
      where: {
        organizationId: user.organizationId,
        userId: user.id,
        readAt: null,
        deletedAt: null,
      },
    }),
    prisma.activityLog.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 12,
    }),
    getNotificationPreferences(user),
  ]);

  return { filters, notifications, unreadCount, activity, preferences };
}

export async function getCurrentUserNotifications(userId: string, organizationId: string) {
  return prisma.notification.findMany({
    where: {
      userId,
      organizationId,
      deletedAt: null,
    },
    orderBy: [{ createdAt: "desc" }],
    take: 20,
  });
}

export async function getNotificationPreferences(user: AuthenticatedAppUser) {
  return prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      organizationId: user.organizationId,
      userId: user.id,
    },
  });
}

export async function updateNotificationPreferences(user: AuthenticatedAppUser, payload: unknown) {
  const parsed = notificationPreferenceSchema.parse(payload);

  return prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: {
      training: parsed.training,
      leadUpdates: parsed.leadUpdates,
      announcements: parsed.announcements,
      browserPush: parsed.browserPush,
      email: parsed.email,
      quietHours: parsed.quietHours || null,
      digestFrequency: parsed.digestFrequency,
    },
    create: {
      organizationId: user.organizationId,
      userId: user.id,
      training: parsed.training,
      leadUpdates: parsed.leadUpdates,
      announcements: parsed.announcements,
      browserPush: parsed.browserPush,
      email: parsed.email,
      quietHours: parsed.quietHours || null,
      digestFrequency: parsed.digestFrequency,
    },
  });
}

export async function markNotificationRead(
  user: AuthenticatedAppUser,
  notificationId: string,
  read = true,
) {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });

  if (!notification) {
    throw new Error("Notification not found.");
  }

  requireOrganizationAccess(user, notification.organizationId);

  if (!adminRoles.includes(user.role) && notification.userId !== user.id) {
    throw new Error("You do not have access to this notification.");
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: read ? new Date() : null },
  });
}

export async function markAllNotificationsRead(user: AuthenticatedAppUser) {
  await prisma.notification.updateMany({
    where: {
      organizationId: user.organizationId,
      userId: user.id,
      readAt: null,
      deletedAt: null,
    },
    data: { readAt: new Date() },
  });
}

export async function deleteNotification(user: AuthenticatedAppUser, notificationId: string) {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });

  if (!notification) {
    throw new Error("Notification not found.");
  }

  requireOrganizationAccess(user, notification.organizationId);

  if (!adminRoles.includes(user.role) && notification.userId !== user.id) {
    throw new Error("You do not have access to this notification.");
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { deletedAt: new Date() },
  });
}

export async function registerNotificationSubscription(
  user: AuthenticatedAppUser,
  payload: unknown,
  userAgent?: string | null,
) {
  const parsed = notificationSubscriptionSchema.parse(payload);

  await prisma.notificationSubscription.upsert({
    where: { endpoint: parsed.endpoint },
    update: {
      organizationId: user.organizationId,
      userId: user.id,
      p256dh: parsed.keys.p256dh,
      auth: parsed.keys.auth,
      userAgent,
      isActive: true,
    },
    create: {
      organizationId: user.organizationId,
      userId: user.id,
      endpoint: parsed.endpoint,
      p256dh: parsed.keys.p256dh,
      auth: parsed.keys.auth,
      userAgent,
      isActive: true,
    },
  });

  await updateNotificationPreferences(user, { browserPush: true });
}

export async function removeNotificationSubscription(user: AuthenticatedAppUser, endpoint: string) {
  await prisma.notificationSubscription.updateMany({
    where: {
      organizationId: user.organizationId,
      userId: user.id,
      endpoint,
    },
    data: { isActive: false },
  });
}
