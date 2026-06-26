import type { ReactNode } from "react";

export function SettingsCard({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <article className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}
