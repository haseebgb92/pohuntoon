import type { ReactNode } from "react";

export function AppBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}
