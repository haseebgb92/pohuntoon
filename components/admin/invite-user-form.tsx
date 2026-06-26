"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function InviteUserForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setMessage(null);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        role: String(formData.get("role")),
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Unable to invite user." }));
      setMessage(payload.error || "Unable to invite user.");
      return;
    }

    setMessage("Invitation created.");
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-3 rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)] md:grid-cols-[1fr_1fr_12rem_auto]">
      <input className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="name" placeholder="Full name" required />
      <input className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="email" placeholder="Email" required type="email" />
      <select className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="role" defaultValue="PARTNER">
        <option value="PARTNER">Partner</option>
        <option value="PARTNER_MANAGER">Partner Manager</option>
        <option value="ORG_ADMIN">Org Admin</option>
        <option value="VIEWER">Viewer</option>
      </select>
      <button className="min-h-11 rounded-2xl bg-[#6E4BD8] px-4 text-sm font-semibold text-white" type="submit">Invite</button>
      {message ? <p className="md:col-span-4 text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}
