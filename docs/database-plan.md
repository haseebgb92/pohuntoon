# Database Plan

Pohuntoon uses PostgreSQL through Prisma. Prisma is the source of truth for schema design, migrations, and generated client types.

## Connections

- `DATABASE_URL` uses Supabase shared transaction-mode pooler for application runtime.
- `DIRECT_URL` uses Supabase shared session-mode pooler for migration workflows.
- Both values are server-only and must never be exposed through `NEXT_PUBLIC_*` variables.

## Prisma Ownership

The Prisma datasource is configured with:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

No manual table creation should happen in Supabase. Schema changes should be modeled in `prisma/schema.prisma`, reviewed, then applied through Prisma migrations only when migration work is explicitly approved.

## Current Setup Scope

- Prisma was not initialized again because the project already has Prisma.
- Existing models were preserved.
- No migrations were run.
- No database push was run.
- Supabase database state was not modified.

## Operational Workflow

1. Update `prisma/schema.prisma` for intentional schema changes.
2. Run `pnpm prisma:validate` before generating migrations.
3. Generate migrations only when approved with `pnpm db:migrate` in development.
4. Apply production migrations through the deployment workflow.
5. Run `pnpm db:seed` only against an approved development database.

## Future Planning

Upcoming modules such as billing, public API keys, webhooks, and AI usage analytics should add models through Prisma migrations. Keep tenant-owned data scoped to `organizationId` and prefer soft delete where appropriate.
