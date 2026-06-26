import type { Role } from "@prisma/client";

import { permissions } from "@/lib/auth/permissions";

const roleDescriptions: Record<Role, string> = {
  SUPER_ADMIN: "Global platform owner with access to every organization and system area.",
  ORG_ADMIN: "Organization owner with complete tenant administration.",
  PARTNER_MANAGER: "Can manage partners, leads, content, community moderation, and settings.",
  PARTNER: "Can learn, use resources, submit leads, participate in community, and manage own profile.",
  VIEWER: "Read-focused access for learning, resources, notifications, and community viewing.",
};

export function RoleCard({ role }: { role: Role }) {
  return (
    <article className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <h2 className="text-base font-semibold text-foreground">{role.replaceAll("_", " ")}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{roleDescriptions[role]}</p>
    </article>
  );
}

export function PermissionMatrix({ groups }: { groups: Array<{ group: string; permissions: string[] }> }) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <section className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]" key={group.group}>
          <h2 className="text-base font-semibold text-foreground">{group.group}</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {group.permissions.map((permission) => <span className="rounded-2xl bg-surface px-3 py-2 text-sm text-muted-foreground" key={permission}>{permission}</span>)}
          </div>
        </section>
      ))}
      <p className="text-sm text-muted-foreground">Future custom roles can reuse the same permission catalog: {permissions.length} permissions currently defined.</p>
    </div>
  );
}
