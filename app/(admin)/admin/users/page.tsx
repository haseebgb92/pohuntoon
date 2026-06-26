import { InviteUserForm } from "@/components/admin/invite-user-form";
import { UserCard } from "@/components/admin/user-card";
import { PageHeader } from "@/components/shared/page-header";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAdminUsers } from "@/lib/admin/service";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_users");
  const params = await searchParams;
  const users = await getAdminUsers(user, params);

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Invite, activate, suspend, reset, and assign roles with organization-scoped access." />
      <InviteUserForm />
      <form className="grid gap-3 rounded-[2rem] bg-white p-4 shadow-[0_18px_45px_rgba(23,43,77,0.08)] md:grid-cols-[1fr_12rem_12rem_auto]">
        <input className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="query" placeholder="Search users" defaultValue={params.query || ""} />
        <select className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="role" defaultValue={params.role || ""}>
          <option value="">All roles</option><option value="ORG_ADMIN">Org Admin</option><option value="PARTNER_MANAGER">Partner Manager</option><option value="PARTNER">Partner</option><option value="VIEWER">Viewer</option>
        </select>
        <select className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="status" defaultValue={params.status || ""}>
          <option value="">All statuses</option><option value="ACTIVE">Active</option><option value="INVITED">Invited</option><option value="SUSPENDED">Suspended</option>
        </select>
        <button className="min-h-11 rounded-2xl bg-surface px-4 text-sm font-semibold text-foreground" type="submit">Filter</button>
      </form>
      <div className="grid gap-4 lg:grid-cols-2">
        {users.map((item) => <UserCard key={item.id} user={item} />)}
      </div>
    </div>
  );
}
