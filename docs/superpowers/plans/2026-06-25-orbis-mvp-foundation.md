# Orbis MVP Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a fresh Orbis MVP foundation with route-grouped layouts, reusable shell components, auth/database placeholders, and basic RBAC in a production-shaped Next.js codebase.

**Architecture:** Start from a fresh Next.js App Router project, then layer in shared design tokens, route groups, reusable shell components, and interface-ready auth/RBAC primitives. Keep integrations shallow and explicit so real Supabase Auth and Prisma-backed data can replace placeholders without changing route/layout structure.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui-style component primitives, Prisma, PostgreSQL, Vitest, React Testing Library

---

### Task 1: Scaffold the Base App

**Files:**
- Create: fresh Next.js app files in project root
- Modify: `package.json`
- Modify: `tsconfig.json`

- [ ] **Step 1: Scaffold the project**

Run:

```bash
corepack pnpm dlx create-next-app@latest orbis-app --ts --tailwind --eslint --app --use-pnpm --import-alias "@/*" --yes
```

- [ ] **Step 2: Install required dependencies**

Run:

```bash
corepack pnpm add next@15 @prisma/client @supabase/supabase-js class-variance-authority clsx tailwind-merge lucide-react
corepack pnpm add -D prisma vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Verify the package graph installs**

Run:

```bash
corepack pnpm install
```

Expected: install completes without missing dependency errors.

### Task 2: Define the Design Foundation

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `lib/utils/cn.ts`

- [ ] **Step 1: Add semantic tokens and calm product theme**
- [ ] **Step 2: Apply root font/body shell styles**
- [ ] **Step 3: Add shared `cn` utility**

### Task 3: Build Auth and RBAC Foundations

**Files:**
- Create: `lib/auth/roles.ts`
- Create: `lib/auth/permissions.ts`
- Create: `lib/auth/session.ts`
- Create: `lib/auth/guards.ts`
- Test: `tests/lib/auth/guards.test.ts`

- [ ] **Step 1: Write failing RBAC tests**
- [ ] **Step 2: Implement role types and helper logic**
- [ ] **Step 3: Add mock session contract for future Supabase integration**
- [ ] **Step 4: Re-run tests until green**

### Task 4: Define Navigation and Shared Shell Components

**Files:**
- Create: `lib/config/navigation.ts`
- Create: `components/layout/app-shell.tsx`
- Create: `components/layout/sidebar.tsx`
- Create: `components/layout/topbar.tsx`
- Create: `components/shared/page-header.tsx`
- Create: `components/shared/stat-card.tsx`
- Create: `components/shared/empty-state.tsx`
- Create: `components/shared/data-table.tsx`
- Create: `components/shared/badge.tsx`
- Create: `components/shared/progress-card.tsx`

- [ ] **Step 1: Write failing tests for nav filtering**
- [ ] **Step 2: Implement nav config and visibility helpers**
- [ ] **Step 3: Build typed reusable shell and dashboard components**
- [ ] **Step 4: Re-run tests until green**

### Task 5: Create Route Groups and Pages

**Files:**
- Create: `app/(auth)/layout.tsx`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/forgot-password/page.tsx`
- Create: `app/(auth)/accept-invite/page.tsx`
- Create: `app/(partner)/layout.tsx`
- Create: `app/(partner)/dashboard/page.tsx`
- Create: `app/(admin)/layout.tsx`
- Create: `app/(admin)/admin/page.tsx`

- [ ] **Step 1: Build auth layout and pages**
- [ ] **Step 2: Build partner shell layout and dashboard placeholder**
- [ ] **Step 3: Build admin shell layout and dashboard placeholder**
- [ ] **Step 4: Add placeholder pages for linked navigation targets as needed**

### Task 6: Add Prisma Foundation

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/db/prisma.ts`

- [ ] **Step 1: Define minimal models for organizations, users, memberships, and invites**
- [ ] **Step 2: Add Prisma client singleton helper**

### Task 7: Verification

**Files:**
- Test: `tests/lib/auth/guards.test.ts`
- Test: `tests/lib/config/navigation.test.ts`

- [ ] **Step 1: Run unit tests**

```bash
corepack pnpm test --run
```

- [ ] **Step 2: Run lint**

```bash
corepack pnpm lint
```

- [ ] **Step 3: Run build**

```bash
corepack pnpm build
```

- [ ] **Step 4: Fix any issues, then re-run all verification commands**
