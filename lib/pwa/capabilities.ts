export type ClientCapabilities = Readonly<{
  share: boolean;
  clipboard: boolean;
  camera: boolean;
  wakeLock: boolean;
  badge: boolean;
  backgroundSync: boolean;
}>;

const UNSUPPORTED_CAPABILITIES: ClientCapabilities = {
  share: false,
  clipboard: false,
  camera: false,
  wakeLock: false,
  badge: false,
  backgroundSync: false,
};

export function getClientCapabilities(): ClientCapabilities {
  if (typeof window === "undefined") {
    return { ...UNSUPPORTED_CAPABILITIES };
  }

  const clientNavigator = window.navigator;

  return {
    share: typeof clientNavigator.share === "function",
    clipboard: typeof clientNavigator.clipboard !== "undefined",
    camera: typeof clientNavigator.mediaDevices?.getUserMedia === "function",
    wakeLock: "wakeLock" in clientNavigator,
    badge: "setAppBadge" in clientNavigator,
    backgroundSync: "serviceWorker" in clientNavigator && "SyncManager" in window,
  };
}
