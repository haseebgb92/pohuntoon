# Orbis Resource Center Design

## Goal

Build a secure Resource Center for Orbis where each organization can store, organize, browse, and download its own private resources, with admin management workflows and partner-facing discovery pages.

## Scope

This phase includes:

- organization-scoped resource library for partners
- organization-scoped resource management for admins
- private Supabase Storage integration
- secure upload and signed download flow
- resource metadata validation with Zod
- optional download tracking through a dedicated Prisma model
- resource detail pages
- filters, search, and responsive list/grid presentation

This phase does not include:

- notifications based on resource uploads
- activity feed UX beyond simple download tracking
- non-resource modules such as leads, community, commissions, or AI

## Tenant Boundary

`Organization` is the tenant boundary.

Rules:

- partners only see resources belonging to their `organizationId`
- admins only manage resources belonging to their `organizationId`
- no cross-organization visibility or download access
- `SUPER_ADMIN` may bypass organization filters where explicitly intended, but standard admin flows should still behave in an organization-scoped way

## Storage Design

Use private Supabase Storage.

Security model:

- the storage bucket remains private
- database stores resource metadata and storage path
- upload and download operations happen only after server-side permission and organization checks
- browser never receives storage secrets
- download access uses short-lived signed URLs generated on the server

Recommended resource representation:

- uploaded-file resources store a storage path
- external-link resources store a validated external URL and no storage path

## Schema Changes

Current `Resource` model is too thin for this feature. It should be extended to support both file-backed and external-link resources plus lifecycle management.

Recommended additions:

- `status` to support active vs archived resource lifecycle
- `storagePath` for private bucket object path
- `externalUrl` for link-based resources
- `isExternal` boolean or an equivalent resource-source discriminator
- optional original file name if needed for display/download clarity

Add `ResourceDownload` for simple analytics:

- `id`
- `resourceId`
- `userId`
- `organizationId`
- `downloadedAt`

Reasoning:

- explicit download records are easier to query than overloading `ActivityLog`
- keeps resource analytics isolated and future-proof

Any schema changes must also update:

- Prisma client generation path
- seed data if needed

## Routes

### Partner

- `/app/resources`
- `/app/resources/[resourceId]`

### Admin

- `/admin/resources`
- `/admin/resources/new`
- `/admin/resources/[resourceId]/edit`

## Permissions

Partner-facing access requires:

- `view_resources`

Admin management requires:

- `manage_resources`

Partner access should not rely on client navigation visibility alone. Resource reads and downloads must be verified on the server.

## Query and Action Boundaries

Create server-side resource query and action utilities that:

- read current authenticated Orbis user
- enforce organization scoping
- enforce permission checks
- return only safe view data to the UI

Suggested responsibilities:

- list partner-visible resources
- get one resource by id for partner view
- list admin-manageable resources
- create resource
- update resource
- archive/delete resource
- issue signed download URL
- record download event

These should live in server-only modules, not client components.

## Partner Experience

### Resource Library Page

Route:

- `/app/resources`

Features:

- search bar
- category filters
- file type filters
- grid/list toggle
- responsive resource cards

Display:

- title
- description
- category
- version
- updated date
- file type icon
- download button
- view details button

### Resource Detail Page

Route:

- `/app/resources/[resourceId]`

Display:

- resource title
- description
- file type
- category
- version
- uploaded by
- created date
- updated date
- download button
- related resources if simple to support through same-category org-scoped query

## Admin Experience

### Resource Index

Route:

- `/admin/resources`

Features:

- search/filter resources
- desktop table view
- mobile card view
- actions to edit, archive, or delete
- create-new entry point

### New Resource

Route:

- `/admin/resources/new`

Features:

- upload form
- metadata form
- support for:
  - file upload
  - external link
- validation errors
- progress UI
- success/error toasts

### Edit Resource

Route:

- `/admin/resources/[resourceId]/edit`

Features:

- edit title
- edit description
- edit category
- edit version
- replace file
- archive resource
- delete resource if implemented

## File Support

Support:

- PDF
- DOC/DOCX
- XLS/XLSX
- PPT/PPTX
- images
- ZIP
- external links

The UI should infer a display icon from either stored file type or the resource source kind.

## Components

Create or refine:

- `ResourceCard`
- `ResourceFilters`
- `ResourceUploadForm`
- `FileTypeIcon`
- `DownloadButton`
- `EmptyState`
- `PageHeader`
- `DataTable`

Guidelines:

- keep reusable components typed and composable
- admin and partner surfaces should share resource presentation primitives where practical
- mobile experience should favor stacked cards, while admin desktop should use a management table

## Validation

Use Zod for:

- resource create form
- resource edit form
- upload metadata

Validation should cover:

- required title/category
- file-backed vs external-link mode
- allowed file/link shape
- version format kept simple but explicit

## UX States

Required:

- skeleton loading states
- empty states
- error states
- upload progress
- success/error toasts

Tone:

- calm
- direct
- professional
- not overly verbose

## Download Flow

When a user downloads a resource:

1. server verifies session
2. server verifies permission
3. server verifies resource belongs to user organization unless `SUPER_ADMIN`
4. server generates signed URL for private storage object or returns validated external URL behavior
5. server records a `ResourceDownload` entry if file-backed download proceeds

The direct storage path should not be exposed to unauthorized users.

## Seed and Readiness

If schema changes are introduced, seed data should be updated enough to keep the existing sample resource valid under the new model.

## Success Criteria

This phase is complete when:

- partners can browse only organization-owned resources at `/app/resources`
- partners can view details and securely download allowed resources
- admins can create, edit, archive, and manage their own organization resources
- uploads use private Supabase Storage
- server-side access control enforces organization and role boundaries
- resource metadata is validated with Zod
- download tracking exists if schema changes permit it
