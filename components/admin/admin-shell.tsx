import type { ReactNode } from "react";

export function AdminShell({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

export function AdminSidebar({ items }: { items: Array<{ label: string; href: string }> }) {
  return (
    <aside className="rounded-[2rem] bg-white p-4 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <nav className="grid gap-2" aria-label="Admin sections">
        {items.map((item) => (
          <a className="min-h-11 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground" href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
