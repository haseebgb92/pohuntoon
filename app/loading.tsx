export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-4 min-[960px]:px-6 min-[960px]:py-8">
      <div className="h-32 animate-pulse rounded-[2rem] bg-white shadow-[0_18px_45px_rgba(23,43,77,0.08)]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div className="h-36 animate-pulse rounded-[2rem] bg-white" key={index} />)}
      </div>
      <div className="h-72 animate-pulse rounded-[2rem] bg-white" />
    </main>
  );
}
