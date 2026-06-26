---
name: nextjs-feature-module-delivery
description: Deliver a production-ready Next.js feature module by extending existing architecture, wiring server-scoped data, reusable UI, routes, and verification.
source: auto-skill
extracted_at: '2026-06-26T06:40:40.086Z'
---

# Next.js Feature Module Delivery

Use this approach when a prompt asks for a complete module in an existing Next.js app and the project already has partial foundations such as Prisma models, services, route handlers, or placeholder pages.

## Procedure

1. Read the project guidance first
   - Treat `AGENTS.md` or equivalent project guide as the implementation contract.
   - Note architecture, RBAC, mobile/PWA, design-system, validation, and status-update rules before editing.
   - If the user provides UI mockups or brand assets, inspect them early and translate the visible style into concrete component rules before coding.

2. Inventory the existing foundation before designing
   - Inspect Prisma schema, route groups, API routes, services, query helpers, auth guards, permissions, notifications, PWA files, and existing components.
   - Prefer existing service/query layers over adding business logic in pages or components.
   - Identify placeholder pages that should be replaced rather than creating parallel routes.
   - For admin/settings work, inspect both partner and admin route groups because settings/profile/account pages often exist as placeholders in one group while admin settings already has partial services/components.

3. Extend the backend first
   - Reuse existing Prisma models/enums where present; add models only for missing durable state such as preferences, subscriptions, social content, moderation queues, integrations, white-label branding, or audit records.
   - Keep all tenant-owned queries scoped by `organizationId`, with super-admin exceptions only where the existing auth model supports it.
   - Put mutation rules in services, not UI components.
   - Use Zod schemas for all external payloads.
   - Ensure status-changing mutations create timeline/activity entries and notification events when the product requires auditability.
   - For community/social modules, model the smallest complete durable graph first: spaces, posts, comments, reactions, saved state, and reports, with indexes on organization and parent entity IDs.
   - For SaaS/white-label settings modules, separate user preferences, organization profile fields, organization branding, and integration status rather than overloading one JSON blob.

4. Build reusable UI components around domain concepts
   - Create shared domain components such as cards, filters, boards, wizards, timelines, documents, notes, activity feeds, badges, toasts, settings, composer forms, reaction bars, saved/report buttons, admin actions, profile headers, avatar uploaders, branding previews, integration cards, and permission matrices.
   - Keep pages thin: pages fetch server data and compose reusable components.
   - Make mobile the default layout; use desktop-only tables/boards behind responsive breakpoints.
   - For PWA upload flows, include mobile-friendly file inputs with `multiple`, relevant `accept` types, and camera capture where appropriate.
   - For mockup-driven mobile UI, prefer large rounded white cards, soft shadows, roomy spacing, bottom-nav-safe layouts, purple primary CTAs, and blue/orange/green accents over generic dashboard styling.
   - For social/community feeds, avoid cloning legacy forums or generic social networks; use focused spaces, compact role badges, modern feed cards, bottom-sheet composers, and simple one-level conversation threads.
   - For settings modules, provide both desktop sidebar navigation and mobile settings cards; keep sticky save actions mobile-friendly.

5. Wire partner/admin routes separately
   - Partner pages should use partner permissions and own-record access.
   - Admin pages should use admin permissions and organization/global access rules.
   - Keep route handlers permissioned server-side; never rely on UI hiding alone.
   - If an admin-facing feature is also useful in navigation, add the route to the existing navigation config rather than hard-coding links only inside pages.
   - For settings/account/profile routes, keep personal settings under the app area and organization/roles/audit/integrations under admin routes, even when they share reusable components.

6. Integrate dashboards, activity, and notifications last
   - Add dashboard widgets using query helpers so they respect the same RBAC and organization scoping.
   - Use the existing notification abstraction even if some channels are stubs, so future channels can plug in without rewriting callers.
   - For notification centers, separate durable state (notifications, preferences, subscriptions), feed querying, card/list/filter UI, and per-notification actions.
   - For browser push, add the full local architecture even if actual push delivery is deferred: subscription models/API, preference toggles, service worker `push` and `notificationclick` handlers, and badge/count surfaces.
   - When adding a new notification category/type, update every exhaustive mapping immediately (notification filters, tone/icon maps, category maps, action labels) before building.
   - For audit logs, prefer reusing/expanding the existing activity log before introducing a duplicate audit table unless the product explicitly needs separate retention or compliance behavior.

7. Verify with build-driven iteration
   - Run lint/build/type checks after implementation.
   - If the user asks to continue prior launch-readiness work, first inspect the current repository state, docs, env example, seed script, error boundaries, API upload routes, and existing tests to find the next concrete blocker rather than redoing the whole audit.
   - If the preferred package manager is unavailable on the machine, use the equivalent existing package scripts through the available package manager and report the substitution.
   - If Prisma model changes or generated types look stale, run Prisma client generation before re-running the build.
   - Fix schema/seed drift found by the build; seed files often reveal outdated field names or required relations.
   - If Prisma validation fails only because environment variables such as `DATABASE_URL` are missing, retry with a safe placeholder local value and report the environment requirement separately from code failures.
   - When tests fail because completed routes/navigation expanded, update the stale assertions to reflect the current source of truth instead of removing coverage.

8. Update project status only after completion
   - If the project guide has a status section and the feature is complete, move the feature to Completed and adjust In Progress/Planned honestly.
   - Avoid leaving the same feature in both Completed and Planned after status edits.

## Pitfalls To Watch

- Prisma relation fields can exist in generated types only after `prisma generate`; stale generated clients can make valid includes appear missing.
- Returning broad Prisma update-input types from mapping helpers can pollute create payloads with update operation types; use explicit narrow input types for reusable data mappers.
- Notification recipient helpers should return the notification service's expected shape, often `{ userId, organizationId }`, not raw user records.
- Mobile requirements usually mean cards first, with tables and drag/kanban views desktop-only.
- Service-worker changes are outside React's type checks; inspect `public/sw.js` directly and keep handlers small and defensive.
- Project status edits can accidentally duplicate items across Completed/In Progress/Planned; re-read the status section after editing.
- Adding a new enum value such as a notification type can break exhaustive `Record<Enum, ...>` maps in unrelated UI; update mappings before the build.
- Directory creation may partially succeed on Windows while returning a non-zero code if some directories already exist; verify with glob/list before assuming failure.
