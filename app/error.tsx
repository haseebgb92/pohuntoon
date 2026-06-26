"use client";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[60dvh] items-center justify-center px-4 py-10">
      <section className="w-full max-w-lg rounded-[2rem] bg-white p-6 text-center shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
        <p className="text-sm font-semibold text-[#6E4BD8]">We hit a snag</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">This page could not load</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Refresh the content or retry when your connection is stable.</p>
        {error.digest ? <p className="mt-3 text-xs text-muted-foreground">Reference: {error.digest}</p> : null}
        <button className="mt-6 min-h-11 rounded-2xl bg-[#6E4BD8] px-5 text-sm font-semibold text-white" onClick={reset} type="button">
          Retry
        </button>
      </section>
    </main>
  );
}
