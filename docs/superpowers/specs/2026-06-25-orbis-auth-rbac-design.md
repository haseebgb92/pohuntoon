# Orbis Auth + RBAC Integration Design

## Goal

Integrate real Supabase authentication with Prisma-backed user, organization, role, and status checks so Orbis enforces secure route protection and role-based access from the server side.

## Scope

This phase includes:

- Supabase browser and server clients
- Session handling and logout
- Prisma-backed current-user lookup
- Account status enforcement
- Middleware for broad route protection
- Server-side RBAC helpers
- Move partner routes to `/app/*`
- Updated authenticated layouts using real user context
- User menu in the top bar
- UI states for unauthorized and blocked account cases

This phase does not include:

- Feature modules such as partner management, course management, or lead workflows
- Advanced profile/settings forms
- Password reset and invite completion backend logic beyond access gating
- API route implementation beyond shared guard utilities

## Route Design

Partner routes move under `/app/*`:

- `/app/dashboard`
- `/app/learning`
- `/app/resources`
- `/app/leads`
- `/app/notifications`
- `/app/profile`

Admin routes remain under `/admin/*`:

- `/admin`
- `/admin/partners`
- `/admin/courses`
- `/admin/resources`
- `/admin/leads`
- `/admin/settings`

Public auth routes remain:

- `/login`
- `/forgot-password`
- `/accept-invite`

Additional public or semi-public status pages:

- `/unauthorized`
- `/account-not-found`
- `/account-suspended`
- `/invite-pending`

## Auth Flow

1. User logs in through Supabase email/password.
2. Middleware checks for a Supabase-authenticated session on protected route families.
3. Server auth utility loads the Supabase user on the server.
4. Prisma lookup matches Supabase user email to a seeded Prisma `User`.
5. Server utility loads:
   - Prisma user
   - organization
   - role
   - status
6. Access rules apply:
   - no Supabase session: redirect to `/login`
   - no matching Prisma user: deny and show `Account not found. Please contact admin.`
   - `SUSPENDED`: deny and show `Your account has been suspended.`
   - `INVITED`: allow only `/accept-invite`
   - active user: continue to authenticated route

## Supabase Boundary

Create:

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`

Responsibilities:

- browser client for login/logout and client-safe session usage
- server client for middleware and server component/session reads
- shared environment validation kept minimal and explicit

No sensitive server session details should be exposed to client components. Client-side code should only receive safe user/profile fragments already resolved by the server.

## Prisma User Context

Create `lib/auth/get-current-user.ts`.

This module becomes the single place to:

- read the Supabase-authenticated user
- map by email to Prisma `User`
- include organization
- derive role/status context
- return a safe typed auth context for layouts and guards

Suggested shape:

- `user`
- `organization`
- `role`
- `status`
- `supabaseUserId`
- lightweight safe display data for UI

This keeps layouts and guards from duplicating auth lookup logic.

## Permissions Model

Create a permission system around explicit strings:

- `view_dashboard`
- `manage_users`
- `view_learning`
- `manage_courses`
- `view_resources`
- `manage_resources`
- `submit_leads`
- `view_own_leads`
- `manage_leads`
- `view_notifications`
- `manage_settings`

Role mapping:

- `SUPER_ADMIN`: full access
- `ORG_ADMIN`: broad org-admin access
- `PARTNER_MANAGER`: operational admin access without full org control
- `PARTNER`: partner-facing access
- `VIEWER`: restricted read-focused partner access

Create helpers:

- `hasPermission(user, permission)`
- `requirePermission(permission)`
- `requireRole(role)`
- `requireAdmin()`
- `requireOrganizationAccess(organizationId)`

Rules:

- `hasPermission` is a pure evaluator
- `require*` helpers are server-enforced and should throw/redirect on failure
- org access checks should default to organization-scoped restrictions unless `SUPER_ADMIN`

## Middleware

Create `middleware.ts`.

Protected route families:

- `/app/*`
- `/admin/*`

Rules:

- `/app/*` requires authenticated active user
- `/admin/*` requires authenticated active user plus admin role:
  - `SUPER_ADMIN`
  - `ORG_ADMIN`
  - `PARTNER_MANAGER`

Middleware should do broad gating only:

- check for Supabase session presence
- redirect unauthenticated users to `/login`
- redirect authenticated users away from `/login` to `/app/dashboard`

Detailed Prisma-based status and RBAC enforcement remains server-side in layouts and guard utilities, because middleware should not become the only security layer.

## Layout Strategy

Partner layout:

- use real current-user context
- render only after verified active user context is available
- show partner navigation based on role

Admin layout:

- use real current-user context
- require admin role on the server
- render admin navigation only for permitted users

The previous mock session code should be removed or replaced so there is one authoritative auth path.

## Navigation

Partner roles see:

- Dashboard
- Learning
- Resources
- Leads
- Notifications
- Profile

Admin roles see:

- Admin Dashboard
- Partners
- Courses
- Resources
- Leads
- Settings

Navigation should be derived from server-verified role context, not from client guesses.

## UI States

Create clean UI states for:

- loading session
- unauthorized
- account not found
- suspended account
- invite pending

These can be implemented as dedicated pages and/or shared state components.

Tone:

- calm
- direct
- professional
- no verbose auth error dumps

## User Menu

Update top bar avatar/user menu to show:

- user name
- email
- role badge
- organization name
- profile
- settings
- logout

Logout should invalidate the Supabase session and redirect to `/login`.

## Security Rules

- Never trust client-side role checks by themselves.
- Middleware is convenience, not the final authority.
- Server components and server utilities must enforce auth and permissions.
- Queries should be scoped by `organizationId` by default.
- `SUPER_ADMIN` may bypass organization scoping where explicitly intended.
- Do not expose Supabase tokens, status internals, or unnecessary auth payloads to the browser.

## File Changes

Expected key files:

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/auth/get-current-user.ts`
- `lib/auth/permissions.ts`
- `lib/auth/guards.ts`
- `middleware.ts`
- auth pages and status pages under `app/`
- updated app/admin layouts
- topbar/user menu components
- navigation config updates

## Success Criteria

This phase is complete when:

- partner routes live under `/app/*`
- unauthenticated access to `/app/*` and `/admin/*` redirects to `/login`
- authenticated active users load real Prisma-backed role/org/status context
- missing Prisma users are blocked with an account-not-found state
- suspended users are blocked with a suspended-account state
- invited users are restricted to the invite flow
- admin routes enforce admin-role access
- navigation and shell rendering use real verified user context
- reusable RBAC helpers exist and are ready for future feature modules
