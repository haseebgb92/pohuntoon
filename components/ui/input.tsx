import * as React from "react";

import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}
