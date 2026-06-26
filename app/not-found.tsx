import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
        <p className="text-sm font-semibold text-[#6E4BD8]">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">The page may have moved, or you may not have access to it.</p>
        <Link className="mt-6 inline-flex min-h-11 items-center rounded-2xl bg-[#6E4BD8] px-5 text-sm font-semibold text-white" href="/app/dashboard">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
