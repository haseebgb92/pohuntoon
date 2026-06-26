---
name: secure-foundation-setup
description: Set up Next.js/Supabase/Prisma/AI foundations while protecting secrets and avoiding database mutations.
source: auto-skill
extracted_at: '2026-06-26T09:23:26.465Z'
---

# Secure Foundation Setup

Use this approach when a prompt asks to configure Supabase, Prisma, environment variables, or an AI provider foundation in an existing Next.js app and includes live credentials.

## Procedure

1. Inspect before editing
   - Read `AGENTS.md` or the project guide first.
   - Inspect `.gitignore`, `package.json`, `prisma/schema.prisma`, existing Supabase clients, docs, and any current AI/service folders.
   - Check whether the repository is a usable git repository before promising commits or relying on `git diff`.

2. Protect secrets immediately
   - Never print secret values in command output, final reports, docs, or logs.
   - Write live credentials only to ignored local env files such as `.env.local`.
   - Ensure `.gitignore` explicitly includes `.env`, `.env.local`, and `.env.*.local`, even if a broader `.env*` rule already exists.
   - If a supplied credentials file has placeholders such as `[YOUR-PASSWORD]`, ask for only the missing value and avoid echoing it back.

3. Configure environment without leaking credentials
   - Use `write_file` for new `.env.local` files only when the contents are known and the file is ignored.
   - If the user says they manually changed `.env.local`, do not overwrite it blindly; re-read only when necessary and avoid exposing the content in responses.
   - Prefer narrow edits for single variables, but if tool safety blocks shell-based secret edits, ask for explicit approval or let the user update the value manually.

4. Install only missing packages
   - Compare required packages against `package.json` first.
   - Install only absent packages; do not reinstall existing core packages.
   - Respect the repository lockfile and the user's package-manager instruction. In a `pnpm-lock.yaml` project, use pnpm only; do not fall back to `npm install`, `npx`, or yarn after the user has specified pnpm-only.
   - If pnpm is unavailable, use approved Corepack setup (`corepack enable`, `corepack prepare pnpm@latest --activate`) when allowed. If Corepack fails with Windows permission errors such as EPERM under `C:\Program Files\nodejs`, mark package installation and validation as pending instead of switching package managers.

5. Configure Prisma safely
   - Add `directUrl = env("DIRECT_URL")` to the datasource when requested for Supabase pooled connections.
   - Do not create models, run migrations, run `db push`, or otherwise mutate Supabase unless explicitly requested.
   - Validation is safe when env vars exist; if validation needs `DATABASE_URL`, load it from local env or use a non-secret placeholder only when appropriate.
   - Be cautious with `prisma.config.ts`: adding it may interact badly with Next.js builds in some environments; verify build after adding and revert if it causes toolchain crashes.

6. Add Supabase clients as reusable infrastructure
   - Keep browser clients limited to public Supabase URL and publishable/anon key.
   - Keep service role usage server-only in an admin/server helper.
   - Provide separate helpers for browser, server components, middleware, and server actions when requested.
   - Do not mock Supabase or create fake service behavior for foundation setup.

7. Add AI abstraction before application use
   - Keep application code calling an `AiService`, not a provider directly.
   - Define provider-agnostic types for provider IDs, models, capabilities, roles, chat requests, and responses.
   - Implement provider adapters behind the service; start with the requested Ollama-compatible adapter while leaving room for OpenAI, Gemini, and Anthropic.
   - Classify discovered models from returned metadata and model IDs, but mark unknown capabilities conservatively rather than guessing.

8. Discover models without leaking secrets
   - Use the supplied model listing endpoint exactly, such as `GET /tags` with `Authorization: Bearer OLLAMA_API_KEY`.
   - Do not hardcode model names; only use IDs returned by the provider.
   - Write a redacted report file containing endpoint path/status, model IDs, metadata, inferred capabilities, and chosen defaults.
   - If commands that read `.env.local` or call the provider are blocked by safety tooling, ask for explicit approval and avoid workaround attempts.

9. Document the foundation
   - Create/update architecture, database plan, authentication, storage, and AI provider docs.
   - Include discovered models, chosen defaults, unsupported/unknown capabilities, and future provider strategy.
   - State clearly that migrations were not run and the Supabase database was not modified.

10. Verify and report
   - Run lint, tests/type checks, Prisma validation, and production build when possible, but do not run migrations.
   - If package installation or model discovery is blocked, list it as a warning rather than inventing success.
   - If git is usable and the user requested it, commit only non-secret files and explicitly exclude `.env.local`.

## Pitfalls To Watch

- A broad `.env*` ignore rule is helpful but the user may require explicit `.env.local` entries; add them for clarity.
- Shell commands that parse `.env.local` can be blocked for safety because they involve secrets; ask before retrying with alternate commands.
- Provider base URLs may need an `/api` suffix; normalize by stripping a trailing slash before appending `/tags` or `/chat`.
- Supabase REST API URLs are not the same as `NEXT_PUBLIC_SUPABASE_URL`; use the project base URL, not `/rest/v1/`, for Supabase clients.
- Do not claim model capabilities such as embeddings, vision, context length, or streaming unless returned by the provider or safely inferred from explicit metadata/endpoint compatibility.
