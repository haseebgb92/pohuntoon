# AGENTS.md

# Pohuntoon AI Engineering Guide

> **Project:** Pohuntoon
> **Tagline:** People. Ideas. Progress.

This file is the **single source of truth** for all AI coding agents (Codex, Cursor, Claude Code, ChatGPT, etc.).

Every implementation must follow this document.

---

# Before Every Task

Always:

1. Read this file first.
2. Understand the existing code before modifying it.
3. Extend existing architecture instead of rewriting.
4. Never duplicate functionality.
5. Keep code modular and reusable.
6. Finish one feature completely before starting another.
7. Do not introduce new libraries unless required.
8. Update the **Project Status** section when a major feature is completed.

---

# Product Vision

Pohuntoon is a **Collaborative Growth Platform**.

It combines:

* Learning
* Resources
* Lead Management
* Notifications
* Community (future)
* AI Assistant (future)

into one platform.

Pohuntoon is **not**:

* LMS
* CRM
* Community software

It is all of them combined.

---

# Core Philosophy

Everything should support:

**People. Ideas. Progress.**

Every feature must improve one or more of these.

If it doesn't, question whether it belongs.

---

# Tech Stack

Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion

Backend

* Next.js Route Handlers
* Prisma
* PostgreSQL

Authentication

* Supabase Auth

Validation

* Zod
* React Hook Form

Storage

* Supabase Storage (default)
* Cloudflare R2 (future supported)

---

# Architecture Rules

Use Feature First architecture.

Never create giant files.

Keep responsibilities separate.

Business Logic

```
lib/
services/
```

Database

```
prisma/
```

Reusable UI

```
components/
```

Pages

```
app/
```

---

# Folder Rules

Never place business logic inside UI components.

Never query Prisma directly inside components.

Always use:

* services
* server actions
* route handlers

---

# Coding Standards

Always

* Strict TypeScript
* No `any`
* No duplicated code
* Small reusable components
* Proper typing
* Meaningful names

Never

* Huge files
* Huge components
* Inline business logic
* Inline SQL
* Magic numbers

---

# UI Philosophy

The UI should feel:

* Friendly
* Premium
* Modern
* Fast
* Human

Avoid

* Bootstrap look
* Facebook look
* Old CRM look
* WordPress admin look

---

# Design System

Brand

Primary Blue

```
#1E4E9A
```

Secondary

```
#29B7E5
```

Purple

```
#6E4BD8
```

Orange

```
#F5A623
```

Green

```
#2CBF6D
```

Background

```
#F8F9FC
```

Surface

```
#FFFFFF
```

Text

```
#172B4D
```

Border

```
#E7EAF0
```

Cards

* Rounded (16–24px)
* Soft shadow
* Plenty of spacing

---

# Mobile First

Desktop expands mobile.

Never build desktop first.

Rules

* Cards instead of tables
* Sticky actions
* Bottom navigation
* Large touch targets
* Responsive layouts

---

# PWA Rules

Pohuntoon is PWA only.

Do NOT build:

* Android app
* iOS app
* React Native
* Expo

Support

* Install prompt
* Offline mode
* Push notifications
* Camera uploads
* Safe area
* App icons
* Splash screen

The installed experience should feel native.

---

# Authentication

Use Supabase Auth.

Every page requiring login must be protected.

Never trust client-side permissions.

---

# RBAC

Roles

* SUPER_ADMIN
* ORG_ADMIN
* PARTNER_MANAGER
* PARTNER
* VIEWER

Always validate permissions on the server.

---

# Database Rules

Use Prisma.

UUID IDs.

Soft delete where appropriate.

Every tenant-owned record must belong to an Organization.

---

# API Rules

RESTful naming.

Validate all input with Zod.

Return typed responses.

Never expose internal errors.

---

# Components

Always prefer reusable components.

Examples

* Button
* Card
* Modal
* Drawer
* Badge
* Progress
* EmptyState
* Skeleton
* DataTable
* Timeline

If a component will be reused twice, make it reusable immediately.

---

# UX Rules

Every page must have

Loading State

Empty State

Error State

Success State

No dead ends.

Every empty page should guide the user.

---

# Performance

Prefer

* Server Components
* Lazy loading
* Dynamic imports
* Pagination
* Image optimization

Avoid unnecessary re-renders.

---

# Accessibility

Support

* Keyboard navigation
* Focus states
* Proper labels
* Semantic HTML
* Good color contrast

---

# Notifications

Support

* In-app
* Browser Push

Future

* Email
* WhatsApp
* Teams
* Slack

Design notification architecture for future expansion.

---

# Internal AI Team

Every feature should be reviewed from these perspectives.

## Product Owner

Ensures feature aligns with product vision.

---

## UI Architect

Designs clean, modern interfaces.

---

## Backend Architect

Designs APIs and services.

---

## Database Engineer

Maintains schema integrity.

---

## Security Engineer

Validates permissions and data protection.

---

## Performance Engineer

Keeps the application fast.

---

## QA Engineer

Checks

* Responsiveness
* Edge cases
* Accessibility
* Bugs

---

## PWA Engineer

Maintains

* Offline
* Installability
* Push notifications
* Native feel

---

# Definition of Done

A feature is complete only when:

* Works
* Responsive
* Mobile-first
* PWA compatible
* Accessible
* Type-safe
* No lint errors
* No TypeScript errors
* Uses reusable components
* Follows AGENTS.md

---

# Current Project Status

Completed

* Project architecture
* Prisma schema
* Authentication
* RBAC
* Dashboard foundation
* Learning module
* Resource Center
* PWA foundation
* Lead Management
* Notifications
* Community
* Admin Control Center
* Organization Management & White-Labeling
* Production Readiness

In Progress

* AI Assistant

Planned

* Events
* Analytics
* Certifications
* Commissions

---

# Prompt Convention

Every future prompt assumes this workflow.

```
Read AGENTS.md.

Review the existing implementation.

Let the internal AI team collaborate.

Follow all architecture, UI, coding, PWA, security and performance rules.

Implement only the requested feature.

Do not rewrite unrelated code.

Maintain consistency.

When complete, update the Current Project Status if required.
```

End of AGENTS.md
