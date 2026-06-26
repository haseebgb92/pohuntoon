# Architecture

Pohuntoon is a mobile-first Next.js platform using feature-first architecture.

## Runtime Layers

```text
App Router pages and route handlers
-> services and domain modules in lib/
-> Prisma and provider adapters
-> PostgreSQL, Supabase Auth, Supabase Storage, AI providers
```

## Frontend

- Next.js App Router with React Server Components by default.
- Client Components are used only for interactivity, forms, optimistic UI, and browser APIs.
- Shared UI lives in `components/` and domain logic stays in `lib/`.
- Authenticated partner routes live under `/app`; admin routes live under `/admin`.

## Backend

- Route Handlers expose REST-style API endpoints.
- Services own business rules, RBAC checks, notifications, and data access orchestration.
- Prisma owns database schema and typed database access.
- Supabase provides authentication and storage boundaries.

## AI Foundation

Application code must call the AI service only:

```text
Application
-> AI Service
-> Provider Adapter
-> Ollama-compatible provider
```

The AI provider contract is defined in `lib/ai/types.ts`. The current default adapter is `OllamaProviderAdapter`, with future adapters planned for OpenAI, Gemini, and Anthropic without changing application code.

## Security Boundaries

- Browser code may only use `NEXT_PUBLIC_*` values.
- Server secrets stay in `.env.local` and server-only modules.
- RBAC is enforced server-side before data access or mutation.
- Tenant-owned records must be scoped by `organizationId`.

## Release Posture

This foundation is prepared for local development and Vercel-style deployment. Prisma migrations, Supabase database writes, and external provider deployment are intentionally separate operational steps.
