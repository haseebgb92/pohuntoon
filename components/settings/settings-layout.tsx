import Link from "next/link";
import type { ReactNode } from "react";

const sections = [
  ["General", "/app/settings"],
  ["Profile", "/app/profile"],
  ["Organization", "/admin/organization"],
  ["Branding", "/admin/organization#branding"],
  ["Users", "/admin/users"],
  ["Roles", "/admin/roles"],
  ["Notifications", "/app/settings/notifications"],
  ["Security", "/app/account"],
  ["Integrations", "/admin/integrations"],
  ["Audit Logs", "/admin/audit"],
];

export function SettingsLayout({ children, title, description }: { children: ReactNode; title: string; description: string }) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2.25rem] bg-gradient-to-br from-[#6E4BD8] via-[#7559DD] to-[#29B7E5] p-5 text-white shadow-[0_24px_60px_rgba(110,75,216,0.25)] sm:p-6">
        <p className="text-sm font-medium text-white/80">Platform Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">{description}</p>
      </section>
      <div className="grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <nav className="grid gap-2 rounded-[2rem] bg-white p-3 shadow-[0_18px_45px_rgba(23,43,77,0.08)]" aria-label="Settings sections">
            {sections.map(([label, href]) => <Link className="min-h-11 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground" href={href} key={label}>{label}</Link>)}
          </nav>
        </aside>
        <main className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {sections.slice(0, 8).map(([label, href]) => <Link className="rounded-2xl bg-white p-4 text-sm font-semibold text-foreground shadow-[0_12px_28px_rgba(23,43,77,0.07)]" href={href} key={label}>{label}</Link>)}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
