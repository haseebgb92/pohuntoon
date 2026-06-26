import Link from "next/link";

import type { Notification, NotificationType } from "@prisma/client";
import { Bell, BookOpen, CheckCircle2, FileText, Megaphone, MessageCircle, Shield, Sparkles, Target } from "lucide-react";

import { NotificationCardActions } from "@/components/notifications/notification-actions";
import { formatLeadDateTime } from "@/lib/leads/format";
import { cn } from "@/lib/utils/cn";

const notificationTone: Record<NotificationType, { icon: typeof Bell; className: string; label: string }> = {
  SYSTEM: { icon: Shield, className: "bg-[#6E4BD8]/10 text-[#6E4BD8]", label: "System" },
  TRAINING: { icon: BookOpen, className: "bg-[#29B7E5]/12 text-[#1E4E9A]", label: "Training" },
  LEAD_UPDATE: { icon: Target, className: "bg-[#F5A623]/16 text-[#9A5F00]", label: "Lead" },
  RESOURCE: { icon: FileText, className: "bg-[#2CBF6D]/12 text-[#167A45]", label: "Resource" },
  COMMUNITY: { icon: MessageCircle, className: "bg-[#6E4BD8]/10 text-[#6E4BD8]", label: "Community" },
  ANNOUNCEMENT: { icon: Megaphone, className: "bg-[#6E4BD8]/10 text-[#6E4BD8]", label: "Announcement" },
};

function getActionLabel(notification: Notification) {
  if (notification.type === "TRAINING") {
    return "Continue Learning";
  }

  if (notification.type === "RESOURCE") {
    return "Download Resource";
  }

  if (notification.type === "LEAD_UPDATE") {
    return notification.title.toLowerCase().includes("document") ? "Upload Documents" : "View Lead";
  }

  return "Open";
}

type NotificationCardProps = {
  notification: Notification;
};

export function NotificationCard({ notification }: NotificationCardProps) {
  const tone = notificationTone[notification.type];
  const Icon = tone.icon;
  const isUnread = !notification.readAt;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[2rem] bg-white p-4 shadow-[0_18px_45px_rgba(23,43,77,0.08)] transition duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5",
        isUnread && "ring-2 ring-[#6E4BD8]/12",
      )}
    >
      <div className="absolute inset-y-0 right-0 hidden w-24 items-center justify-center bg-[#2CBF6D] text-sm font-semibold text-white sm:group-hover:flex">
        Mark read
      </div>
      <div className="relative z-10 flex gap-4 bg-white">
        <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", tone.className)}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{tone.label}</p>
              <h2 className="mt-1 text-base font-semibold leading-6 text-foreground">{notification.title}</h2>
            </div>
            {isUnread ? <span className="mt-2 size-2.5 rounded-full bg-[#6E4BD8]" aria-label="Unread" /> : <CheckCircle2 className="mt-1 size-4 text-[#2CBF6D]" aria-label="Read" />}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{notification.message}</p>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <time className="text-xs text-muted-foreground" dateTime={notification.createdAt.toISOString()}>{formatLeadDateTime(notification.createdAt)}</time>
            <div className="flex flex-wrap items-center gap-2">
              <NotificationCardActions notificationId={notification.id} />
              {notification.linkUrl ? (
                <Link className="inline-flex min-h-10 items-center rounded-2xl bg-[#6E4BD8] px-4 text-sm font-medium text-white shadow-[0_10px_22px_rgba(110,75,216,0.22)]" href={notification.linkUrl}>
                  {getActionLabel(notification)}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function EmptyNotificationState() {
  return (
    <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-[#6E4BD8]/10 text-[#6E4BD8]">
        <Sparkles className="size-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">All caught up</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">New learning, resource, lead, and system updates will appear here.</p>
    </div>
  );
}
