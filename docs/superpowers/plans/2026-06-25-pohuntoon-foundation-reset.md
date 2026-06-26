# Pohuntoon Foundation Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the product to Pohuntoon, add production-ready PWA foundations, and replace the current desktop-led app chrome with a mobile-first shell while keeping existing routes, auth, RBAC, and data contracts stable.

**Architecture:** Add a centralized brand/config layer, a small PWA capability layer, and new responsive shell components that sit on top of the existing `/app/*` and `/admin/*` route tree. Keep business modules intact and adapt layouts, metadata, and reusable UI tokens so future feature prompts inherit Pohuntoon branding and mobile-first behavior by default.

**Tech Stack:** Next.js 15 App Router, TypeScript, React 19, Tailwind CSS v4, Prisma, Supabase Auth, Framer Motion, modern service worker/manifest support.

---

## File Structure

### Create

- `lib/config/brand.ts`
- `app/manifest.ts`
- `app/offline/page.tsx`
- `components/layout/mobile-shell.tsx`
- `components/layout/desktop-shell.tsx`
- `components/layout/bottom-nav.tsx`
- `components/layout/mobile-page-header.tsx`
- `components/layout/install-app-banner.tsx`
- `components/layout/offline-state.tsx`
- `components/shared/skeleton-loader.tsx`
- `components/shared/app-badge.tsx`
- `lib/pwa/capabilities.ts`
- `lib/pwa/install.ts`
- `public/icons/pohuntoon-192.png`
- `public/icons/pohuntoon-512.png`
- `public/icons/pohuntoon-maskable-512.png`
- `public/icons/apple-touch-icon.png`
- `public/offline.html`
- `public/sw.js`
- `tests/lib/config/brand.test.ts`
- `tests/lib/pwa/capabilities.test.ts`

### Modify

- `package.json`
- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/(partner)/layout.tsx`
- `app/(admin)/layout.tsx`
- `app/(auth)/layout.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/accept-invite/page.tsx`
- `app/(public)/account-not-found/page.tsx`
- `app/(public)/account-suspended/page.tsx`
- `app/(public)/invite-pending/page.tsx`
- `app/(public)/unauthorized/page.tsx`
- `components/layout/app-shell.tsx`
- `components/layout/sidebar.tsx`
- `components/layout/topbar.tsx`
- `components/shared/empty-state.tsx`
- `components/shared/page-header.tsx`
- `components/shared/progress-card.tsx`
- `components/resources/resource-card.tsx`
- `lib/config/navigation.ts`
- `README.md`
- `tests/lib/config/navigation.test.ts`

---

### Task 1: Add Brand Source Of Truth

**Files:**
- Create: `lib/config/brand.ts`
- Test: `tests/lib/config/brand.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";

import { brand } from "@/lib/config/brand";

describe("brand", () => {
  it("exposes the Pohuntoon identity", () => {
    expect(brand.name).toBe("Pohuntoon");
    expect(brand.tagline).toBe("People. Ideas. Progress.");
    expect(brand.themeColor).toBe("#1E4E9A");
  });

  it("provides install and offline copy", () => {
    expect(brand.install.title).toContain("Pohuntoon");
    expect(brand.offline.title).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node_modules\.bin\vitest.CMD --run tests/lib/config/brand.test.ts`
Expected: FAIL with module not found for `@/lib/config/brand`

- [ ] **Step 3: Write minimal implementation**

```ts
export const brand = {
  name: "Pohuntoon",
  tagline: "People. Ideas. Progress.",
  description: "A mobile-first collaborative growth platform for people, learning, and progress.",
  themeColor: "#1E4E9A",
  backgroundColor: "#F8F9FC",
  install: {
    title: "Install Pohuntoon",
    description: "Keep Pohuntoon on your home screen for a faster app-like experience.",
  },
  offline: {
    title: "You are offline",
    description: "Reconnect to continue syncing live work across Pohuntoon.",
  },
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node_modules\.bin\vitest.CMD --run tests/lib/config/brand.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/config/brand.ts tests/lib/config/brand.test.ts
git commit -m "feat: add pohuntoon brand config"
```

### Task 2: Replace Global Metadata And Theme Tokens

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `README.md`

- [ ] **Step 1: Update root metadata to use brand config**

```ts
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { brand } from "@/lib/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: brand.name,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: brand.name,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: brand.themeColor,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
```

- [ ] **Step 2: Replace color tokens and safe-area globals**

```css
:root {
  --primary: #1e4e9a;
  --secondary: #29b7e5;
  --purple: #6e4bd8;
  --orange: #f5a623;
  --green: #2cbf6d;
  --background: #f8f9fc;
  --surface: #ffffff;
  --border: #e7eaf0;
  --muted: #eef2f7;
  --success: #2cbf6d;
  --warning: #f5a623;
  --error: #e06b75;
  --text-primary: #172b4d;
  --text-secondary: #6b7280;
  --radius: 1rem;
}

body {
  background: var(--background);
  color: var(--text-primary);
  padding-bottom: env(safe-area-inset-bottom);
}

.shell-grid {
  display: grid;
  min-height: 100dvh;
}
```

- [ ] **Step 3: Update README branding references**

```md
# Pohuntoon

Pohuntoon is a mobile-first collaborative growth platform built as an installable Progressive Web App.
```

- [ ] **Step 4: Verify no stale user-facing Orbis metadata remains in touched files**

Run: `rg -n "Orbis" app/layout.tsx app/globals.css README.md`
Expected: no matches

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css README.md
git commit -m "feat: apply pohuntoon metadata and brand tokens"
```

### Task 3: Add PWA Manifest, Service Worker, And Offline Fallback

**Files:**
- Create: `app/manifest.ts`
- Create: `app/offline/page.tsx`
- Create: `public/sw.js`
- Create: `public/offline.html`
- Create: `public/icons/pohuntoon-192.png`
- Create: `public/icons/pohuntoon-512.png`
- Create: `public/icons/pohuntoon-maskable-512.png`
- Create: `public/icons/apple-touch-icon.png`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add manifest with install metadata and shortcuts**

```ts
import type { MetadataRoute } from "next";

import { brand } from "@/lib/config/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.name,
    description: brand.description,
    start_url: "/app/dashboard",
    display: "standalone",
    background_color: brand.backgroundColor,
    theme_color: brand.themeColor,
    orientation: "portrait",
    icons: [
      { src: "/icons/pohuntoon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/pohuntoon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/pohuntoon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Home", url: "/app/dashboard" },
      { name: "Learn", url: "/app/learning" },
      { name: "Resources", url: "/app/resources" },
    ],
  };
}
```

- [ ] **Step 2: Add offline fallback page and static fallback document**

```tsx
import { brand } from "@/lib/config/brand";

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <section className="max-w-md rounded-3xl bg-surface p-8 shadow-sm">
        <p className="text-sm font-semibold text-primary">{brand.name}</p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">{brand.offline.title}</h1>
        <p className="mt-2 text-sm text-text-secondary">{brand.offline.description}</p>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Add minimal service worker**

```js
const CACHE_NAME = "pohuntoon-v1";
const ASSETS = ["/offline", "/offline.html", "/icons/pohuntoon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match("/offline");
      return cached || caches.match("/offline.html");
    }),
  );
});
```

- [ ] **Step 4: Register the service worker from the root layout with a client helper introduced in Task 4**

Run: `rg -n "navigator.serviceWorker.register" app lib components`
Expected: one registration point only

- [ ] **Step 5: Commit**

```bash
git add app/manifest.ts app/offline/page.tsx public/sw.js public/offline.html public/icons app/layout.tsx
git commit -m "feat: add pohuntoon pwa foundation"
```

### Task 4: Add PWA Capability Helpers And Install Flow

**Files:**
- Create: `lib/pwa/capabilities.ts`
- Create: `lib/pwa/install.ts`
- Create: `tests/lib/pwa/capabilities.test.ts`
- Create: `components/layout/install-app-banner.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write failing capability tests**

```ts
import { describe, expect, it } from "vitest";

import { getClientCapabilities } from "@/lib/pwa/capabilities";

describe("getClientCapabilities", () => {
  it("returns false values on the server", () => {
    expect(getClientCapabilities()).toMatchObject({
      share: false,
      clipboard: false,
      wakeLock: false,
      badge: false,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node_modules\.bin\vitest.CMD --run tests/lib/pwa/capabilities.test.ts`
Expected: FAIL with module not found

- [ ] **Step 3: Add feature detection helpers**

```ts
export function getClientCapabilities() {
  if (typeof window === "undefined") {
    return {
      share: false,
      clipboard: false,
      camera: false,
      wakeLock: false,
      badge: false,
      backgroundSync: false,
    };
  }

  return {
    share: typeof navigator.share === "function",
    clipboard: !!navigator.clipboard,
    camera: !!navigator.mediaDevices?.getUserMedia,
    wakeLock: "wakeLock" in navigator,
    badge: "setAppBadge" in navigator,
    backgroundSync: "serviceWorker" in navigator,
  };
}
```

- [ ] **Step 4: Add install prompt wrapper and banner**

```ts
export type DeferredInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
```

```tsx
"use client";

import { useEffect, useState } from "react";

import { brand } from "@/lib/config/brand";
import { listenForInstallPrompt } from "@/lib/pwa/install";

export function InstallAppBanner() {
  const [promptEvent, setPromptEvent] = useState<DeferredInstallPrompt | null>(null);

  useEffect(() => listenForInstallPrompt(setPromptEvent), []);

  if (!promptEvent) return null;

  return (
    <div className="fixed inset-x-4 bottom-24 z-40 rounded-3xl bg-surface p-4 shadow-lg md:bottom-6">
      <p className="text-sm font-semibold text-foreground">{brand.install.title}</p>
      <p className="mt-1 text-sm text-text-secondary">{brand.install.description}</p>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add lib/pwa/capabilities.ts lib/pwa/install.ts tests/lib/pwa/capabilities.test.ts components/layout/install-app-banner.tsx app/layout.tsx
git commit -m "feat: add pwa capability and install helpers"
```

### Task 5: Split App Shell Into Mobile And Desktop Variants

**Files:**
- Create: `components/layout/mobile-shell.tsx`
- Create: `components/layout/desktop-shell.tsx`
- Create: `components/layout/mobile-page-header.tsx`
- Modify: `components/layout/app-shell.tsx`
- Modify: `components/layout/sidebar.tsx`
- Modify: `components/layout/topbar.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Refactor `AppShell` to delegate by breakpoint**

```tsx
type AppShellProps = {
  areaLabel: string;
  items: NavigationItem[];
  user: AuthenticatedAppUser;
  children: ReactNode;
};

export function AppShell(props: AppShellProps) {
  return (
    <>
      <div className="md:hidden">
        <MobileShell {...props} />
      </div>
      <div className="hidden md:block">
        <DesktopShell {...props} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Implement mobile shell with sticky header and safe-area padding**

```tsx
export function MobileShell({ areaLabel, items, user, children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-background pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <MobilePageHeader areaLabel={areaLabel} user={user} />
      <main className="px-4 py-4">{children}</main>
      <BottomNav items={items} />
    </div>
  );
}
```

- [ ] **Step 3: Keep desktop shell close to current behavior but rename shell CSS**

```tsx
export function DesktopShell({ areaLabel, items, user, children }: AppShellProps) {
  return (
    <div className="shell-grid bg-background md:grid-cols-[17rem_minmax(0,1fr)]">
      <Sidebar areaLabel={areaLabel} items={items} />
      <div className="min-w-0">
        <Topbar areaLabel={areaLabel} user={user} />
        <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col gap-8 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update sidebar and topbar branding to Pohuntoon**

Run: `rg -n "Orbis|orbis-shell-grid" components/layout app/globals.css`
Expected: no matches after refactor in active shell files

- [ ] **Step 5: Commit**

```bash
git add components/layout/mobile-shell.tsx components/layout/desktop-shell.tsx components/layout/mobile-page-header.tsx components/layout/app-shell.tsx components/layout/sidebar.tsx components/layout/topbar.tsx app/globals.css
git commit -m "feat: add mobile-first pohuntoon shells"
```

### Task 6: Add Partner Bottom Navigation

**Files:**
- Create: `components/layout/bottom-nav.tsx`
- Modify: `lib/config/navigation.ts`
- Test: `tests/lib/config/navigation.test.ts`

- [ ] **Step 1: Extend navigation tests for mobile partner labels**

```ts
it("keeps the partner mobile sequence stable", () => {
  const items = getNavigationForArea("partner", "PARTNER");
  expect(items.map((item) => item.label)).toEqual([
    "Home",
    "Learn",
    "Resources",
    "Leads",
    "Notifications",
    "Profile",
  ]);
});
```

- [ ] **Step 2: Run targeted test to verify it fails**

Run: `node_modules\.bin\vitest.CMD --run tests/lib/config/navigation.test.ts`
Expected: FAIL because labels are still desktop-oriented

- [ ] **Step 3: Update navigation config and render bottom nav**

```ts
export const navigationItems: NavigationItem[] = [
  { href: "/app/dashboard", label: "Home", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/learning", label: "Learn", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/resources", label: "Resources", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/leads", label: "Leads", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/notifications", label: "Notifications", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/profile", label: "Profile", area: "partner", allowedRoles: partnerRoles },
];
```

```tsx
export function BottomNav({ items }: { items: NavigationItem[] }) {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 rounded-[24px] border border-border bg-white/90 p-2 shadow-lg backdrop-blur">
      <ul className="grid grid-cols-6 gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link className="flex min-h-11 items-center justify-center rounded-2xl text-xs font-medium" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node_modules\.bin\vitest.CMD --run tests/lib/config/navigation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/layout/bottom-nav.tsx lib/config/navigation.ts tests/lib/config/navigation.test.ts
git commit -m "feat: add partner bottom navigation"
```

### Task 7: Rebrand Auth And Public Status Surfaces

**Files:**
- Modify: `app/(auth)/layout.tsx`
- Modify: `app/(auth)/login/page.tsx`
- Modify: `app/(auth)/forgot-password/page.tsx`
- Modify: `app/(auth)/accept-invite/page.tsx`
- Modify: `app/(public)/account-not-found/page.tsx`
- Modify: `app/(public)/account-suspended/page.tsx`
- Modify: `app/(public)/invite-pending/page.tsx`
- Modify: `app/(public)/unauthorized/page.tsx`

- [ ] **Step 1: Replace inline brand labels with `brand.name` and `brand.tagline`**

```tsx
<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
  {brand.name}
</p>
<p className="text-sm text-text-secondary">{brand.tagline}</p>
```

- [ ] **Step 2: Update auth/public copy to match Pohuntoon tone**

```tsx
<CardDescription>
  Sign in to continue your workspace across learning, resources, and partner progress.
</CardDescription>
```

- [ ] **Step 3: Verify there are no user-facing Orbis references in auth/public pages**

Run: `rg -n "Orbis" app\(auth) app\(public)`
Expected: no matches

- [ ] **Step 4: Spot-check formatting and type safety**

Run: `node_modules\.bin\tsc.CMD --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/(auth) app/(public)
git commit -m "feat: rebrand pohuntoon auth and status pages"
```

### Task 8: Update Shared Components To The New Brand Surface

**Files:**
- Create: `components/shared/app-badge.tsx`
- Create: `components/shared/skeleton-loader.tsx`
- Modify: `components/shared/empty-state.tsx`
- Modify: `components/shared/page-header.tsx`
- Modify: `components/shared/progress-card.tsx`
- Modify: `components/resources/resource-card.tsx`

- [ ] **Step 1: Add brand-aware badge and skeleton primitives**

```tsx
export function AppBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}
```

```tsx
export function SkeletonLoader({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-muted", className)} aria-hidden="true" />;
}
```

- [ ] **Step 2: Adjust shared components to use larger radius, calmer copy, and mobile-friendly spacing**

Run: `rg -n "rounded-(lg|xl)|text-muted-foreground" components/shared components/resources`
Expected: use token-aligned classes consistently after edits

- [ ] **Step 3: Ensure card-based mobile layout works for resources and placeholders**

Run: `node_modules\.bin\next.CMD build`
Expected: PASS

- [ ] **Step 4: Keep accessibility intact**

Run: `node_modules\.bin\eslint.CMD .`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/shared components/resources/resource-card.tsx
git commit -m "feat: refresh shared pohuntoon components"
```

### Task 9: Add Root App Entry And Shell-Level Install/Offline UX

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/(partner)/layout.tsx`
- Modify: `app/(admin)/layout.tsx`
- Modify: `components/layout/app-shell.tsx`
- Modify: `components/layout/install-app-banner.tsx`
- Create: `components/layout/offline-state.tsx`

- [ ] **Step 1: Keep auth redirect behavior but expose install/offline UX from layouts**

```tsx
<>
  <InstallAppBanner />
  <AppShell areaLabel="Partner workspace" items={...} user={user}>
    {children}
  </AppShell>
</>
```

- [ ] **Step 2: Add a reusable offline-state component for future module usage**

```tsx
export function OfflineState() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5">
      <p className="text-sm font-semibold text-foreground">Offline</p>
      <p className="mt-1 text-sm text-text-secondary">Some live content may be unavailable until you reconnect.</p>
    </div>
  );
}
```

- [ ] **Step 3: Verify app root still resolves correctly**

Run: `node_modules\.bin\next.CMD build`
Expected: PASS with `/`, `/app/*`, `/admin/*`, and `/offline`

- [ ] **Step 4: Check that install banner does not render on the server**

Run: `node_modules\.bin\vitest.CMD --run tests/lib/pwa/capabilities.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/(partner)/layout.tsx app/(admin)/layout.tsx components/layout/app-shell.tsx components/layout/install-app-banner.tsx components/layout/offline-state.tsx
git commit -m "feat: expose install and offline shell states"
```

### Task 10: Final Verification And Cleanup

**Files:**
- Modify: any touched files from Tasks 1-9 as needed

- [ ] **Step 1: Scan for stale active product branding**

Run: `rg -n "Orbis" app components lib README.md`
Expected: only intentional internal leftovers or historical docs remain

- [ ] **Step 2: Run unit tests**

Run: `node_modules\.bin\vitest.CMD --run`
Expected: PASS

- [ ] **Step 3: Run type-check and lint**

Run: `node_modules\.bin\tsc.CMD --noEmit`
Expected: PASS

Run: `node_modules\.bin\eslint.CMD .`
Expected: PASS

- [ ] **Step 4: Run production build**

Run: `node_modules\.bin\next.CMD build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app components lib public README.md tests package.json
git commit -m "feat: ship pohuntoon pwa foundation reset"
```

## Self-Review

- **Spec coverage:** This plan covers branding, metadata, tokens, manifest, service worker, offline fallback, install/update-capable helpers, mobile shell split, bottom navigation, and shared component refresh. Notification center/settings work is intentionally not included because the approved spec deferred that subsystem.
- **Placeholder scan:** No `TODO`, `TBD`, or “handle later” steps are used in executable tasks. The plan references exact files and commands.
- **Type consistency:** `brand`, `InstallAppBanner`, `BottomNav`, `MobileShell`, `DesktopShell`, `OfflineState`, and capability helper names are used consistently across tasks.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-25-pohuntoon-foundation-reset.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
