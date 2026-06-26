import type { Role, UserStatus } from "@prisma/client";
import Link from "next/link";

import { formatLeadDateTime } from "@/lib/leads/format";

type PartnerCardProps = {
  partner: {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    lastLoginAt: Date | null;
    submittedLeads: Array<{ id: string; status: string }>;
    lessonProgressRecords: Array<{ id: string; status: string }>;
    organization: { name: string };
  };
};

export function PartnerCard({ partner }: PartnerCardProps) {
  const completed = partner.lessonProgressRecords.filter((item) => item.status === "COMPLETED").length;
  const trainingProgress = partner.lessonProgressRecords.length ? Math.round((completed / partner.lessonProgressRecords.length) * 100) : 0;

  return (
    <article className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <div className="flex items-start gap-3">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-3xl bg-[#6E4BD8]/10 text-base font-bold text-[#6E4BD8]">
          {partner.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-foreground">{partner.organization.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{partner.name} • {partner.email}</p>
          <span className="mt-2 inline-flex rounded-full bg-surface px-2 py-1 text-xs text-muted-foreground">{partner.status}</span>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Training</span><strong>{trainingProgress}%</strong></div>
        <div className="h-2 rounded-full bg-surface-strong"><div className="h-2 rounded-full bg-[#6E4BD8]" style={{ width: `${trainingProgress}%` }} /></div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
        <div className="rounded-2xl bg-surface p-3"><strong className="block text-base text-foreground">{partner.submittedLeads.length}</strong>Leads</div>
        <div className="rounded-2xl bg-surface p-3"><strong className="block text-base text-foreground">{completed}</strong>Training</div>
        <div className="rounded-2xl bg-surface p-3"><strong className="block text-base text-foreground">{partner.lastLoginAt ? formatLeadDateTime(partner.lastLoginAt) : "Never"}</strong>Login</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link className="min-h-10 rounded-2xl bg-[#6E4BD8] px-3 py-2 text-sm font-medium text-white" href={`/admin/users?query=${encodeURIComponent(partner.email)}`}>View</Link>
        <Link className="min-h-10 rounded-2xl bg-surface px-3 py-2 text-sm font-medium text-foreground" href={`/admin/users?query=${encodeURIComponent(partner.email)}`}>Edit</Link>
        <button className="min-h-10 rounded-2xl bg-[#F5A623]/20 px-3 text-sm font-medium text-[#7A4C00]" type="button">Suspend</button>
        <button className="min-h-10 rounded-2xl bg-surface px-3 text-sm font-medium text-muted-foreground" type="button">Message</button>
      </div>
    </article>
  );
}
