"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-dvh items-center justify-center bg-[#F8F9FC] px-6 py-12">
          <section className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
            <p className="text-sm font-semibold text-[#6E4BD8]">Pohuntoon</p>
            <h1 className="mt-3 text-2xl font-semibold text-[#172B4D]">Something went wrong</h1>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">We could not load this experience. Try again, or return after reconnecting.</p>
            {error.digest ? <p className="mt-3 text-xs text-[#6B7280]">Reference: {error.digest}</p> : null}
            <button className="mt-6 min-h-11 rounded-2xl bg-[#6E4BD8] px-5 text-sm font-semibold text-white" onClick={reset} type="button">
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
