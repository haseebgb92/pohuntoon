"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Preferences = {
  training: boolean;
  leadUpdates: boolean;
  announcements: boolean;
  browserPush: boolean;
  email: boolean;
  quietHours: string | null;
  digestFrequency: string;
};

type NotificationSettingsProps = {
  preferences: Preferences;
};

const rows: Array<{ key: keyof Preferences; label: string; description: string; future?: boolean }> = [
  { key: "training", label: "Training", description: "Course assignments, lesson progress, and certificates." },
  { key: "leadUpdates", label: "Lead updates", description: "Status changes, document requests, approvals, and funding updates." },
  { key: "announcements", label: "Announcements", description: "Organization updates and important system messages." },
  { key: "browserPush", label: "Browser Push", description: "Native PWA alerts on this device." },
  { key: "email", label: "Email", description: "Future-ready email delivery preference.", future: true },
];

export function NotificationSettings({ preferences }: NotificationSettingsProps) {
  const router = useRouter();
  const [values, setValues] = useState(preferences);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(nextValues = values) {
    setSaving(true);
    setMessage(null);
    const response = await fetch("/api/notifications/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextValues),
    });

    setSaving(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Unable to save preferences." }));
      setMessage(payload.error || "Unable to save preferences.");
      return;
    }

    setMessage("Preferences saved.");
    router.refresh();
  }

  async function requestPushPermission() {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setMessage("Browser push is not available on this device.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setMessage("Push permission was not granted.");
      return;
    }

    const next = { ...values, browserPush: true };
    setValues(next);
    await save(next);
  }

  return (
    <div className="space-y-4 rounded-[2rem] bg-white p-4 shadow-[0_18px_45px_rgba(23,43,77,0.08)] sm:p-6">
      {rows.map((row) => {
        const checked = Boolean(values[row.key]);

        return (
          <label className="flex min-h-20 items-center justify-between gap-4 rounded-3xl bg-surface/70 p-4" key={row.key}>
            <span>
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {row.label}
                {row.future ? <span className="rounded-full bg-[#F5A623]/20 px-2 py-0.5 text-xs text-[#7A4C00]">Future</span> : null}
              </span>
              <span className="mt-1 block text-sm leading-5 text-muted-foreground">{row.description}</span>
            </span>
            <button
              aria-pressed={checked}
              className={`relative h-8 w-14 rounded-full transition ${checked ? "bg-[#6E4BD8]" : "bg-surface-strong"}`}
              onClick={() => {
                const next = { ...values, [row.key]: !checked };
                setValues(next);
                if (row.key === "browserPush" && !checked) {
                  void requestPushPermission();
                } else {
                  void save(next);
                }
              }}
              type="button"
            >
              <span className={`absolute top-1 size-6 rounded-full bg-white shadow transition ${checked ? "left-7" : "left-1"}`} />
            </button>
          </label>
        );
      })}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 rounded-3xl bg-surface/70 p-4">
          <span className="text-sm font-semibold text-foreground">Quiet Hours</span>
          <input className="h-11 w-full rounded-2xl border border-input px-3 text-sm" disabled placeholder="Future ready" value={values.quietHours ?? ""} readOnly />
        </label>
        <label className="space-y-2 rounded-3xl bg-surface/70 p-4">
          <span className="text-sm font-semibold text-foreground">Digest Frequency</span>
          <select className="h-11 w-full rounded-2xl border border-input px-3 text-sm" disabled value={values.digestFrequency}>
            <option value="IMMEDIATE">Immediate</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        </label>
      </div>
      {message ? <p className="rounded-2xl bg-surface px-3 py-2 text-sm text-muted-foreground">{message}</p> : null}
      {saving ? <p className="text-sm text-muted-foreground">Saving...</p> : null}
    </div>
  );
}
