"use client";

import { useRouter } from "next/navigation";
import type { Role, UserStatus } from "@prisma/client";

import { formatLeadDateTime } from "@/lib/leads/format";

type UserCardProps = {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    lastLoginAt: Date | null;
    submittedLeads?: Array<{ id: string }>;
    lessonProgressRecords?: Array<{ id: string; status: string }>;
    organization?: { name: string };
  };
};

export function UserCard({ user }: UserCardProps) {
  const router = useRouter();
  const completedTraining = user.lessonProgressRecords?.filter((item) => item.status === "COMPLETED").length ?? 0;

  async function update(action: "SUSPEND" | "ACTIVATE" | "RESET_PASSWORD", role?: Role) {
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, role }),
    });
    router.refresh();
  }

  return (
    <article className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#6E4BD8]/10 text-sm font-bold text-[#6E4BD8]">
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-foreground">{user.name}</h2>
          <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[#29B7E5]/10 px-2 py-1 text-[#1E4E9A]">{user.role}</span>
            <span className="rounded-full bg-surface px-2 py-1 text-muted-foreground">{user.status}</span>
            <span className="rounded-full bg-surface px-2 py-1 text-muted-foreground">{user.organization?.name}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
        <div className="rounded-2xl bg-surface p-3"><strong className="block text-base text-foreground">{user.submittedLeads?.length ?? 0}</strong>Leads</div>
        <div className="rounded-2xl bg-surface p-3"><strong className="block text-base text-foreground">{completedTraining}</strong>Training</div>
        <div className="rounded-2xl bg-surface p-3"><strong className="block text-base text-foreground">{user.lastLoginAt ? formatLeadDateTime(user.lastLoginAt) : "Never"}</strong>Login</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {user.status === "SUSPENDED" ? (
          <button className="min-h-10 rounded-2xl bg-[#2CBF6D] px-3 text-sm font-medium text-white" onClick={() => update("ACTIVATE")} type="button">Activate</button>
        ) : (
          <button className="min-h-10 rounded-2xl bg-[#F5A623]/20 px-3 text-sm font-medium text-[#7A4C00]" onClick={() => update("SUSPEND")} type="button">Suspend</button>
        )}
        <button className="min-h-10 rounded-2xl bg-surface px-3 text-sm font-medium text-foreground" onClick={() => update("RESET_PASSWORD")} type="button">Reset password</button>
        <select className="min-h-10 rounded-2xl border border-input px-3 text-sm" defaultValue={user.role} onChange={(event) => update("ACTIVATE", event.target.value as Role)}>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ORG_ADMIN">Org Admin</option>
          <option value="PARTNER_MANAGER">Partner Manager</option>
          <option value="PARTNER">Partner</option>
          <option value="VIEWER">Viewer</option>
        </select>
      </div>
    </article>
  );
}
