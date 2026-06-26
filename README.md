# Pohuntoon

Pohuntoon is a mobile-first collaborative growth platform built as an installable Progressive Web App. It combines learning, resources, lead management, notifications, community, admin operations, and organization settings into one multi-tenant platform.

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Supabase Auth integration boundaries
- Supabase Storage for resource and lead files

## Environment

Create a local `.env` file from `.env.example` and provide a working PostgreSQL connection.

Required variables:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pohuntoon"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
```

Storage variables:

```bash
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_RESOURCE_BUCKET="pohuntoon-resources"
```

Optional future monitoring variables:

```bash
SENTRY_DSN=""
OTEL_EXPORTER_OTLP_ENDPOINT=""
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_CLARITY_ID=""
```

## App Commands

```bash
pnpm dev
pnpm lint
pnpm test --run
pnpm build
pnpm start
```

## Prisma Workflow

```bash
pnpm prisma:generate
pnpm prisma:validate
pnpm db:migrate
pnpm db:push
pnpm db:seed
```

`DATABASE_URL` must be present before `prisma:validate`, migrations, seed, or runtime database access.

## Implemented Modules

- Authentication and RBAC
- Partner dashboard
- Learning module
- Resource Center
- Lead Management and Partner CRM
- Notifications and Activity Center
- Community Module
- Admin Control Center
- Organization Management and White-Labeling
- PWA foundation and offline shell

## Production Readiness

See `docs/production-readiness.md` for the production-readiness improvements, monitoring hooks, security headers, offline behavior, and remaining production checklist.

## Deployment Notes

- Use Vercel or a Node-compatible host for Next.js.
- Provision PostgreSQL and run Prisma migrations before first production boot.
- Configure Supabase Auth redirect URLs for deployed domains.
- Create private Supabase Storage buckets for resource and lead uploads.
- Set all required environment variables in the deployment environment.
- Run `pnpm lint` and `pnpm build` in CI before deployment.

## CI/CD Preparation

Recommended checks:

```bash
pnpm prisma:generate
pnpm lint
pnpm test --run
pnpm build
```

Add `pnpm prisma:validate` when `DATABASE_URL` is available in CI.
