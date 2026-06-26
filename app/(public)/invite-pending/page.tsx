import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";

export default function InvitePendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-xl">
        <EmptyState
          title="Invite pending"
          description="Your account exists, but setup is not complete yet. Continue the invite flow to activate your access."
          action={
            <Link
              className="inline-flex min-h-11 items-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground"
              href="/accept-invite"
            >
              Continue invite flow
            </Link>
          }
        />
      </div>
    </div>
  );
}
