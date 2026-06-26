import { cn } from "@/lib/utils/cn";

type SkeletonLoaderProps = {
  className?: string;
};

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-2xl bg-muted", className)} />;
}
