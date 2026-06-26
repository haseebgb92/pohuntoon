# Orbis MVP Foundation Design

## Goal

Create the initial MVP foundation for Orbis as a premium partner success platform using Next.js 15, TypeScript, App Router, Tailwind CSS, shadcn/ui, Prisma, PostgreSQL, and Supabase Auth, while limiting scope to structure, layouts, reusable UI, and interface-ready auth/RBAC placeholders.

## Scope

This phase includes:

- Fresh project scaffold
- Route-grouped App Router structure
- Auth pages:
  - `login`
  - `forgot-password`
  - `accept-invite`
- Main partner app shell
- Admin app shell
- Shared reusable UI components
- Basic RBAC primitives
- Placeholder auth/session integration layer
- Prisma schema foundation

This phase does not include:

- Real Supabase login flows
- Live database queries
- Partner/course/resource/lead feature implementation
- Full settings, notifications, or profile workflows
- Complex table interactions

## Architecture

The app will use route groups to separate auth, partner, and admin experiences from day one:

- `app/(auth)` for public auth pages
- `app/(partner)` for partner-facing authenticated routes
- `app/(admin)` for admin-facing authenticated routes

Shared UI and system code will be kept outside route folders:

- `components/layout` for shell primitives
- `components/ui` for reusable UI building blocks
- `components/shared` for higher-level reusable app widgets
- `lib/auth` for role types, permission helpers, and session access
- `lib/config` for navigation and app constants
- `lib/utils` for general utilities
- `prisma` for schema and future data access foundation

This keeps boundaries clear:

- route folders define pages and layout composition
- shared components define presentation
- auth utilities define access rules
- config files define role-aware navigation

## Roles and RBAC

The foundation will support these roles:

- `SUPER_ADMIN`
- `ORG_ADMIN`
- `PARTNER_MANAGER`
- `PARTNER`
- `VIEWER`

RBAC in this phase will be layout- and helper-driven rather than middleware-heavy. The system will provide:

- a role enum/type
- a mock current-session provider
- role-check helpers such as `hasRole`, `canAccessAdmin`, and route guard wrappers
- navigation filtering based on role

Route expectations:

- partner routes allow partner-facing roles
- admin routes allow `SUPER_ADMIN`, `ORG_ADMIN`, and `PARTNER_MANAGER`
- unauthorized access resolves to a clean placeholder state or redirect target stub, depending on route type

The auth layer will be intentionally shaped around future Supabase integration so the placeholder implementation can be replaced with real session lookup later without rewriting layouts.

## Routing Design

### Auth Routes

Under `app/(auth)`:

- `/login`
- `/forgot-password`
- `/accept-invite`

These pages share a minimal auth layout with centered content, premium restrained styling, and room for future Supabase form handlers.

### Partner Routes

Under `app/(partner)`:

- `/dashboard`
- `/learning`
- `/resources`
- `/leads`
- `/notifications`
- `/profile`

For this phase, only dashboard needs page content; the other routes can use placeholders or empty states if created, but at minimum the navigation paths should exist in config and the shell must support them.

### Admin Routes

Under `app/(admin)`:

- `/admin`
- `/admin/partners`
- `/admin/courses`
- `/admin/resources`
- `/admin/leads`
- `/admin/settings`

For this phase, admin dashboard gets placeholder content. Additional routes may be scaffolded as placeholders if needed to support shell integrity.

## Layout System

### `AppShell`

Primary composition wrapper for authenticated views. Responsibilities:

- render sidebar
- render topbar
- provide consistent spacing
- handle desktop/mobile shell behavior
- accept route-specific navigation and page content

### `Sidebar`

Shared navigation component driven by config, not hardcoded route markup. Responsibilities:

- render brand/product identity
- render nav sections
- show active route styling
- support partner or admin variants through data

### `Topbar`

Shared header strip for authenticated routes. Responsibilities:

- page context
- lightweight search/action placeholder space if needed later
- current user summary
- role badge or org label placeholder

### Layout Separation

- `(partner)` layout uses `AppShell` with partner nav
- `(admin)` layout uses `AppShell` with admin nav
- `(auth)` layout is intentionally simpler and separate

## Reusable Components

Required components to build now:

- `AppShell`
- `Sidebar`
- `Topbar`
- `PageHeader`
- `StatCard`
- `EmptyState`
- `DataTable`
- `Badge`
- `ProgressCard`

Guidelines:

- keep props typed and minimal
- separate base UI from page-specific assembly
- avoid one-off page markup where a reusable component is expected
- make components visually coherent with the calm premium system

## Visual System

Orbis should feel premium, calm, fast, modern, and professional.

The foundation will use:

- white application background
- soft gray panels and surfaces
- dark navy text for primary content
- restrained blue as the accent color
- rounded cards with modest radius
- strong whitespace and clean alignment
- low-noise interfaces with no decorative clutter

Implementation intent:

- centralize semantic colors via Tailwind theme tokens/CSS variables where practical
- use shadcn/ui primitives as the baseline for buttons, inputs, cards, and tables
- keep shadows light and sparse
- keep typography compact and readable rather than marketing-heavy

## Data and Integration Foundation

### Prisma

Set up Prisma as a scaffold only. The schema should be intentionally minimal and future-facing, covering:

- `User`
- `Organization`
- `Membership` or equivalent role link
- `Invite`

This is enough to establish RBAC and org relationships without prematurely modeling every business entity.

### Supabase Auth

Use interface-ready placeholders instead of real auth wiring in this pass:

- create a future-facing auth client/access layer
- expose a mock current user/session
- keep page forms ready for later submit handlers

This avoids leaving half-working auth code in the codebase while preserving production-shaped boundaries.

## Testing Strategy

This phase should keep tests scoped to high-value logic only:

- RBAC helper unit tests
- navigation filtering tests if extracted as pure functions
- optionally a smoke test for shell rendering if the scaffold includes a test runner early

Do not overbuild the test harness if it is not already part of the fresh scaffold. Prioritize testing the logic that can regress silently: role access and nav visibility.

## File Structure

Planned structure:

```text
app/
  (auth)/
    login/
    forgot-password/
    accept-invite/
    layout.tsx
  (partner)/
    dashboard/
    layout.tsx
  (admin)/
    admin/
    layout.tsx
components/
  layout/
  shared/
  ui/
lib/
  auth/
  config/
  utils/
prisma/
docs/
```

Exact file names may vary slightly to fit Next.js 15 conventions, but responsibilities should remain as defined above.

## Error Handling and Empty States

Since this is a foundation pass:

- unauthorized routes should fail clearly and predictably
- placeholder pages should use `EmptyState` instead of ad hoc filler text
- auth pages should present form placeholders cleanly without fake backend success logic

## Success Criteria

The foundation is complete when:

- the project boots as a fresh Next.js 15 app
- route groups cleanly separate auth, partner, and admin areas
- both authenticated shells render with distinct navigation sets
- reusable layout and dashboard components exist and are used
- RBAC helpers and role definitions exist in a dedicated auth module
- Prisma schema scaffold exists
- Supabase/auth integration boundaries exist as placeholders rather than being omitted
- the UI reads as premium, calm, and uncluttered rather than generic starter boilerplate

## Tradeoff Decision

Chosen approach: route-grouped scaffold with interface-ready auth and Prisma placeholders.

Reasoning:

- It preserves clean boundaries for future expansion.
- It avoids rework from starting with a single mixed shell.
- It keeps this pass focused on structural quality instead of pretending auth/data are done when they are not.
