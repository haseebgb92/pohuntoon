import { describe, expect, it } from "vitest";

import { brand } from "@/lib/config/brand";

describe("brand", () => {
  it("exposes the Pohuntoon identity", () => {
    expect(brand.name).toBe("Pohuntoon");
    expect(brand.tagline).toBe("People. Ideas. Progress.");
    expect(brand.description).toBe(
      "A mobile-first collaborative growth platform for people, learning, and progress.",
    );
    expect(brand.themeColor).toBe("#1E4E9A");
    expect(brand.backgroundColor).toBe("#F8F9FC");
  });

  it("provides install and offline copy", () => {
    expect(brand.install.title).toBe("Install Pohuntoon");
    expect(brand.install.description).toBe(
      "Keep Pohuntoon on your home screen for a faster app-like experience.",
    );
    expect(brand.offline.title).toBe("You are offline");
    expect(brand.offline.description).toBe(
      "Reconnect to continue syncing live work across Pohuntoon.",
    );
  });
});
