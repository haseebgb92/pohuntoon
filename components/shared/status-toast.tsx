"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn";

type StatusToastProps = {
  tone: "success" | "error";
  message: string;
};

export function StatusToast({ tone, message }: StatusToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 4000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed right-4 top-4 z-50 max-w-sm rounded-xl border px-4 py-3 text-sm shadow-lg",
        tone === "success"
          ? "border-success/20 bg-white text-foreground"
          : "border-destructive/20 bg-white text-foreground",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p>{message}</p>
        <button
          className="text-muted-foreground"
          onClick={() => setVisible(false)}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
}
