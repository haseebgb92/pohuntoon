import { EmptyState } from "@/components/shared/empty-state";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-xl">
        <EmptyState
          title="Unauthorized access"
          description="You do not have permission to view this area in Pohuntoon. Contact your administrator if this looks incorrect."
        />
      </div>
    </div>
  );
}
