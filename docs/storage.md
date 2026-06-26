# Storage

Pohuntoon uses Supabase Storage for resource files and lead documents.

## Buckets

`SUPABASE_RESOURCE_BUCKET` identifies the private bucket used for uploaded resources and lead-related documents. The value is configured in environment variables and must remain server-side.

## Upload Rules

- Uploads are validated before storage writes.
- Allowed MIME types and file size limits are centralized in `lib/utils/uploads.ts`.
- Resource file storage helpers live in `lib/resources/storage.ts`.
- Lead document storage helpers live in `lib/leads/storage.ts`.
- File paths are generated server-side and scoped by organization or lead context.

## Access Rules

- Files should be private by default.
- Downloads should use short-lived signed URLs.
- Access checks must happen before signed URLs are created.
- Server code must validate organization access and RBAC before upload, delete, or download operations.

## Current Scope

This setup does not create buckets or modify Supabase Storage settings. Storage provisioning remains a manual Supabase setup step before production launch.

## Future Providers

Cloudflare R2 can be added later behind the same domain storage abstraction. Application code should not directly depend on provider-specific APIs outside storage helper modules.
