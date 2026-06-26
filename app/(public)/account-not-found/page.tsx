import { EmptyState } from "@/components/shared/empty-state";
import { brand } from "@/lib/config/brand";

export default function AccountNotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-xl">
        <EmptyState
          title="Account not found"
          description={`Your Supabase account is authenticated, but no ${brand.name} user record was found. Please contact an administrator.`}
        />
      </div>
    </div>
  );
}
