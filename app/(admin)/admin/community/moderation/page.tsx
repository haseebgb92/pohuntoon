import { ModerationQueue } from "@/components/community/moderation-queue";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getModerationQueue } from "@/lib/community/service";

export default async function CommunityModerationPage() {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_community");
  const reports = await getModerationQueue(user);

  return (
    <div className="space-y-6">
      <section className="rounded-[2.25rem] bg-gradient-to-br from-[#F5A623] to-[#6E4BD8] p-5 text-white shadow-[0_24px_60px_rgba(110,75,216,0.22)] sm:p-6">
        <p className="text-sm font-medium text-white/80">Community moderation</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Keep the space healthy</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">Review reported posts, comments, flagged content, and warning placeholders.</p>
      </section>
      <ModerationQueue reports={reports} />
    </div>
  );
}
