# Orbis Auth + RBAC Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mock Orbis auth layer with real Supabase session handling, Prisma-backed user lookup, server-side RBAC, protected route middleware, and authenticated `/app/*` + `/admin/*` layouts.

**Architecture:** Build a server-first auth pipeline. Middleware performs broad session gating, while server utilities load the Prisma user, organization, role, and status from Supabase email and enforce status/RBAC in layouts and guards. Client code receives only safe UI-ready user fragments and uses Supabase only for login/logout interactions.

**Tech Stack:** Next.js App Router, TypeScript, Prisma, PostgreSQL, Supabase Auth, Tailwind CSS, Vitest

---

### Task 1: Add RBAC and auth-context tests

**Files:**
- Modify: `tests/lib/auth/guards.test.ts`
- Modify: `tests/lib/config/navigation.test.ts`
- Create: `tests/lib/auth/permissions.test.ts`

- [ ] **Step 1: Add failing tests for permission mapping and route navigation visibility**
- [ ] **Step 2: Run `vitest` and confirm failures**

### Task 2: Replace mock auth primitives with real server-side auth context

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/auth/get-current-user.ts`
- Modify: `lib/auth/permissions.ts`
- Modify: `lib/auth/guards.ts`
- Modify: `lib/auth/roles.ts`
- Delete/replace usage of: `lib/auth/session.ts`

- [ ] **Step 1: Implement Supabase client/server helpers**
- [ ] **Step 2: Implement current-user lookup from Supabase email to Prisma user + organization**
- [ ] **Step 3: Implement permission map, role helpers, status helpers, and organization access guards**
- [ ] **Step 4: Re-run tests and make them pass**

### Task 3: Move partner routes under `/app/*` and update navigation

**Files:**
- Create: `app/(partner)/app/...`
- Remove/replace: current `app/(partner)/*` routes
- Modify: `app/page.tsx`
- Modify: `lib/config/navigation.ts`

- [ ] **Step 1: Move partner pages to `/app/dashboard`, `/app/learning`, `/app/resources`, `/app/leads`, `/app/notifications`, `/app/profile`**
- [ ] **Step 2: Update route redirects and role-based navigation config**
- [ ] **Step 3: Confirm route structure matches prompt 3**

### Task 4: Add middleware and status pages

**Files:**
- Create: `middleware.ts`
- Create: `app/(public)/unauthorized/page.tsx`
- Create: `app/(public)/account-not-found/page.tsx`
- Create: `app/(public)/account-suspended/page.tsx`
- Create: `app/(public)/invite-pending/page.tsx`

- [ ] **Step 1: Implement broad Supabase session middleware for `/app/*` and `/admin/*`**
- [ ] **Step 2: Redirect unauthenticated requests to `/login`**
- [ ] **Step 3: Redirect authenticated users away from `/login` to `/app/dashboard`**
- [ ] **Step 4: Add clean blocked-state pages**

### Task 5: Connect login/logout and secure layouts

**Files:**
- Modify: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/login/actions.ts`
- Create: `app/actions/logout.ts`
- Modify: `app/(partner)/layout.tsx`
- Modify: `app/(admin)/layout.tsx`
- Modify: `components/layout/topbar.tsx`
- Modify: `components/layout/app-shell.tsx`
- Create or modify small auth UI components as needed

- [ ] **Step 1: Add login server action using Supabase email/password**
- [ ] **Step 2: Add logout action**
- [ ] **Step 3: Update partner/admin layouts to use real user context and enforce status/RBAC**
- [ ] **Step 4: Add user menu with name, email, role badge, org name, profile, settings, logout**

### Task 6: Final verification

**Files:**
- Verify: auth helpers, middleware, layouts, login flow wiring

- [ ] **Step 1: Run `vitest --run`**
- [ ] **Step 2: Run `eslint .`**
- [ ] **Step 3: Run `tsc --noEmit`**
- [ ] **Step 4: Run `next build`**
