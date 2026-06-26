import type { LucideIcon } from "lucide-react";

export function AdminDashboardCards({
  cards,
}: {
  cards: Array<{ label: string; value: string | number; detail: string; icon: LucideIcon; tone?: string }>;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]" key={card.label}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{card.value}</p>
              </div>
              <div className={`flex size-12 items-center justify-center rounded-2xl ${card.tone || "bg-[#6E4BD8]/10 text-[#6E4BD8]"}`}>
                <Icon className="size-5" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{card.detail}</p>
          </article>
        );
      })}
    </section>
  );
}
