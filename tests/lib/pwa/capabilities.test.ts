import { afterEach, describe, expect, it, vi } from "vitest";

import { getClientCapabilities } from "@/lib/pwa/capabilities";

describe("getClientCapabilities", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false values when window is unavailable", () => {
    vi.stubGlobal("window", undefined);

    expect(getClientCapabilities()).toEqual({
      share: false,
      clipboard: false,
      camera: false,
      wakeLock: false,
      badge: false,
      backgroundSync: false,
    });
  });

  it("detects supported browser capabilities", () => {
    vi.stubGlobal("window", {
      SyncManager: class SyncManager {},
      navigator: {
        share: vi.fn(),
        clipboard: {},
        mediaDevices: {
          getUserMedia: vi.fn(),
        },
        wakeLock: {},
        setAppBadge: vi.fn(),
        serviceWorker: {},
      },
    });

    expect(getClientCapabilities()).toEqual({
      share: true,
      clipboard: true,
      camera: true,
      wakeLock: true,
      badge: true,
      backgroundSync: true,
    });
  });
});
