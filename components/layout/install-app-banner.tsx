"use client";

import { useEffect, useState } from "react";

import { brand } from "@/lib/config/brand";
import {
  type DeferredInstallPrompt,
  isStandaloneMode,
  listenForInstallPrompt,
  promptForInstall,
  registerServiceWorker,
} from "@/lib/pwa/install";

export function InstallAppBanner() {
  const [promptEvent, setPromptEvent] = useState<DeferredInstallPrompt | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    void registerServiceWorker();

    if (isStandaloneMode()) {
      return;
    }

    return listenForInstallPrompt((nextPromptEvent) => {
      setPromptEvent(nextPromptEvent);

      if (nextPromptEvent) {
        setDismissed(false);
      }
    });
  }, []);

  const handleInstall = async () => {
    if (!promptEvent) {
      return;
    }

    const outcome = await promptForInstall(promptEvent);

    setPromptEvent(null);
    setDismissed(outcome === "dismissed");
  };

  if (!promptEvent || dismissed) {
    return null;
  }

  return (
    <section
      aria-label={brand.install.title}
      className="fixed inset-x-4 bottom-24 z-40 rounded-3xl border border-border bg-surface p-4 shadow-lg md:bottom-6 md:left-auto md:right-6 md:max-w-sm"
    >
      <p className="text-sm font-semibold text-foreground">{brand.install.title}</p>
      <p className="mt-1 text-sm text-text-secondary">{brand.install.description}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          className="min-h-11 flex-1 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => {
            void handleInstall();
          }}
        >
          Install
        </button>
        <button
          type="button"
          className="min-h-11 rounded-2xl border border-border px-4 py-2 text-sm font-medium text-text-secondary"
          onClick={() => {
            setDismissed(true);
          }}
        >
          Not now
        </button>
      </div>
    </section>
  );
}
