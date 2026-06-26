# Authentication

Pohuntoon uses Supabase Auth as the authentication provider and local Prisma records for application roles, organization membership, and profile metadata.

## Auth Flow

- Browser and server auth state is managed through Supabase SSR clients.
- Protected pages under `/app` and `/admin` require an authenticated Supabase user.
- Application user lookup maps Supabase identity to the local `User` record.
- Users without local records, invited users, and suspended users are routed to friendly account states.

## Supabase Clients

Reusable clients are provided for the App Router:

- Browser: `lib/supabase/client.ts`
- Server Components and Route Handlers: `lib/supabase/server.ts`
- Middleware: `lib/supabase/middleware.ts`
- Server Actions: `lib/supabase/actions.ts`
- Admin/storage operations: `lib/supabase/admin.ts`

## Secret Handling

- Browser clients use only `NEXT_PUBLIC_SUPABASE_URL` and a publishable/anon key.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and used only by admin/storage helpers.
- `.env.local` must not be committed.

## RBAC

Roles are defined in Prisma and permission helpers:

- `SUPER_ADMIN`
- `ORG_ADMIN`
- `PARTNER_MANAGER`
- `PARTNER`
- `VIEWER`

Every privileged operation must validate permissions server-side. UI hiding is never sufficient.

## Future Work

Future authentication enhancements may include MFA policy documentation, audit views for auth events, and more granular organization membership rules. These should extend the existing guards and permission helpers rather than bypassing them.
