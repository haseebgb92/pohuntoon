import { brand } from "@/lib/config/brand";

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-[color:var(--primary)]">
          {brand.name}
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          {brand.offline.title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
          {brand.offline.description}
        </p>
        <p className="mt-6 text-xs text-[color:var(--text-secondary)]">
          Open the app again after your connection returns.
        </p>
      </section>
    </main>
  );
}
