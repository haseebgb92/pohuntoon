import { EmptyState } from "@/components/shared/empty-state";
import { brand } from "@/lib/config/brand";

export default function AccountSuspendedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-xl">
        <EmptyState
          title="Your account has been suspended"
          description={`Access to ${brand.name} is currently disabled for this account. Please contact your administrator for details.`}
        />
      </div>
    </div>
  );
}
