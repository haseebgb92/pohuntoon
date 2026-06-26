export type InstallPromptOutcome = "accepted" | "dismissed";

export type DeferredInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: InstallPromptOutcome }>;
};

export function isStandaloneMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia?.("(display-mode: standalone)").matches === true ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export async function registerServiceWorker(
  scriptUrl = "/sw.js",
): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in window.navigator)) {
    return null;
  }

  try {
    return await window.navigator.serviceWorker.register(scriptUrl);
  } catch {
    return null;
  }
}

export function listenForInstallPrompt(
  onPrompt: (prompt: DeferredInstallPrompt | null) => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleBeforeInstallPrompt = (event: Event) => {
    const promptEvent = event as DeferredInstallPrompt;
    promptEvent.preventDefault();
    onPrompt(promptEvent);
  };

  const handleAppInstalled = () => {
    onPrompt(null);
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

  return () => {
    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.removeEventListener("appinstalled", handleAppInstalled);
  };
}

export async function promptForInstall(
  promptEvent: DeferredInstallPrompt,
): Promise<InstallPromptOutcome> {
  await promptEvent.prompt();

  const { outcome } = await promptEvent.userChoice;

  return outcome;
}
