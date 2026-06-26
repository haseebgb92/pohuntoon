import { brand } from "@/lib/config/brand";
import type { AuthenticatedAppUser } from "@/lib/auth/get-current-user";

type MobilePageHeaderProps = {
  areaLabel: string;
  user: AuthenticatedAppUser;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function MobilePageHeader({ areaLabel, user }: MobilePageHeaderProps) {
  const initials = getInitials(user.name);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center justify-between gap-4 px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            {brand.name}
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">{areaLabel}</p>
          <p className="truncate text-sm text-muted-foreground">{user.organizationName}</p>
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
