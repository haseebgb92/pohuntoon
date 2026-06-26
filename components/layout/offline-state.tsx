import { brand } from "@/lib/config/brand";

export function OfflineState() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[0_12px_32px_rgba(23,43,77,0.06)]">
      <p className="text-sm font-semibold text-foreground">{brand.offline.title}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Some live content may be unavailable until you reconnect.
      </p>
    </div>
  );
}
