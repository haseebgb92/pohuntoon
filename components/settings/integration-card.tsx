export function IntegrationCard({ integration }: { integration: { name: string; provider: string; status: string; isEnabled: boolean } }) {
  const connected = integration.status === "CONNECTED";

  return (
    <article className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">{integration.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{integration.provider}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${connected ? "bg-[#2CBF6D]/12 text-[#167A45]" : "bg-surface text-muted-foreground"}`}>{integration.status.replaceAll("_", " ")}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">Architecture-ready integration. Credentials and sync workflows remain future implementation.</p>
    </article>
  );
}
