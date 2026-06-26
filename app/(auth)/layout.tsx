import { brand } from "@/lib/config/brand";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6 sm:py-10">
      <div className="w-full max-w-md space-y-4">
        <div className="px-1 text-center">
          <p className="text-sm font-semibold text-primary">{brand.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{brand.tagline}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
