# Orbis Resource Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a secure, organization-scoped Resource Center with private Supabase Storage uploads/downloads, admin management workflows, and partner browsing/detail pages.

**Architecture:** Extend the Prisma resource model for lifecycle and download tracking, add server-only resource query/action layers with organization-scoped access checks, wire private Supabase Storage through server handlers, and build partner/admin pages on top of reusable resource components and Zod-validated forms.

**Tech Stack:** Next.js App Router, TypeScript, Prisma, PostgreSQL, Supabase Storage, Zod, Tailwind CSS

---

### Task 1: Extend schema and resource contracts

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`
- Create: `lib/resources/schemas.ts`
- Create: `lib/resources/file-types.ts`
- Test: `tests/lib/resources/schemas.test.ts`

- [ ] **Step 1: Add failing tests for resource form validation**
- [ ] **Step 2: Extend the Prisma schema for resource lifecycle and download tracking**
- [ ] **Step 3: Update seed data for the extended resource model**
- [ ] **Step 4: Add Zod schemas and file-type helpers**
- [ ] **Step 5: Run tests and Prisma validation**

### Task 2: Build secure resource server layer

**Files:**
- Create: `lib/supabase/admin.ts`
- Create: `lib/resources/queries.ts`
- Create: `lib/resources/storage.ts`
- Create: `app/api/admin/resources/route.ts`
- Create: `app/api/admin/resources/[resourceId]/route.ts`
- Create: `app/api/resources/[resourceId]/download/route.ts`

- [ ] **Step 1: Add private-storage admin client**
- [ ] **Step 2: Add organization-scoped resource queries and signed download logic**
- [ ] **Step 3: Add secure create/update/delete/download route handlers**
- [ ] **Step 4: Ensure all handlers enforce permission and organization scope**

### Task 3: Build reusable resource UI components

**Files:**
- Create: `components/resources/resource-card.tsx`
- Create: `components/resources/resource-filters.tsx`
- Create: `components/resources/resource-upload-form.tsx`
- Create: `components/resources/file-type-icon.tsx`
- Create: `components/resources/download-button.tsx`
- Create: `components/shared/status-toast.tsx`
- Modify: `components/shared/data-table.tsx` if needed

- [ ] **Step 1: Build resource card/detail primitives**
- [ ] **Step 2: Build filter and upload form components**
- [ ] **Step 3: Add toast and loading/error UI states**

### Task 4: Build partner Resource Center pages

**Files:**
- Modify: `app/(partner)/app/resources/page.tsx`
- Create: `app/(partner)/app/resources/[resourceId]/page.tsx`
- Create: `app/(partner)/app/resources/loading.tsx`

- [ ] **Step 1: Build resource library page with search, filters, and grid/list toggle**
- [ ] **Step 2: Build resource detail page with secure download**
- [ ] **Step 3: Add related resources when same-category results are available**

### Task 5: Build admin Resource Center pages

**Files:**
- Modify: `app/(admin)/admin/resources/page.tsx`
- Create: `app/(admin)/admin/resources/new/page.tsx`
- Create: `app/(admin)/admin/resources/[resourceId]/edit/page.tsx`
- Create: `app/(admin)/admin/resources/loading.tsx`

- [ ] **Step 1: Build admin resources index with desktop table and mobile cards**
- [ ] **Step 2: Build create page with upload progress and validation**
- [ ] **Step 3: Build edit page with replace/archive/delete flows**

### Task 6: Verification and docs

**Files:**
- Modify: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Document Supabase Storage environment requirements**
- [ ] **Step 2: Run `vitest --run`**
- [ ] **Step 3: Run `eslint .`**
- [ ] **Step 4: Run `tsc --noEmit`**
- [ ] **Step 5: Run `prisma validate` and `prisma generate`**
- [ ] **Step 6: Run `next build`**
