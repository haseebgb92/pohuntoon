# DESIGN.md

## Product Overview

Orbis is a premium partner success platform with two primary authenticated surfaces:

- partner-facing workflows
- admin-facing management workflows

The interface should feel calm, professional, and efficient. Design serves the task. The product is not a marketing surface.

## Design Principles

1. Prioritize clarity over decoration.
2. Use consistent shell vocabulary across partner and admin areas.
3. Keep surfaces light, quiet, and structurally dense enough for work.
4. Reserve accent color for active states, primary actions, and status signals.
5. Make empty states and placeholders feel intentional, not unfinished.

## Visual Style

### Color Strategy

Restrained.

### Color Palette

Use OKLCH-backed tokens conceptually, implemented through CSS variables/Tailwind theme values.

- `--background`: `oklch(1 0 0)`
- `--surface`: `oklch(0.98 0.004 255)`
- `--surface-strong`: `oklch(0.95 0.006 255)`
- `--foreground`: `oklch(0.24 0.03 255)`
- `--muted-foreground`: `oklch(0.48 0.015 255)`
- `--primary`: `oklch(0.57 0.15 252)`
- `--primary-foreground`: `oklch(0.99 0 0)`
- `--border`: `oklch(0.91 0.006 255)`
- `--ring`: `oklch(0.57 0.15 252)`
- `--success`: `oklch(0.62 0.12 154)`
- `--warning`: `oklch(0.72 0.14 78)`
- `--destructive`: `oklch(0.60 0.20 27)`

### Typography

- Use one clean sans family, defaulting to Geist or system sans.
- Product scale should be fixed and restrained.
- Headings should be compact, not editorial.
- Labels and helper text should remain readable with strong contrast.

### Radius

- Cards and panels: modest radius, around `0.75rem`
- Inputs and buttons: slightly tighter than cards

### Shadows

- Very light elevation only on cards, dropdowns, and shell separators

## Layout System

### Auth

- Minimal centered auth layout
- Strong spacing
- White canvas with soft-surface cards

### App Shell

- Left sidebar with secondary neutral surface
- Topbar with subtle bottom border
- Main content area with generous horizontal rhythm

### Content Blocks

- Use cards for discrete metrics, progress, and table containers only
- Avoid section-level nested card stacks

## Components

### AppShell

Shared authenticated frame with sidebar, topbar, and content container.

### Sidebar

Data-driven navigation with current-state indication and support for partner/admin variants.

### Topbar

Compact task header area with user summary and contextual utility space.

### PageHeader

Reusable title/description/action block for page tops.

### StatCard

Simple metric card with label, value, delta/support text, and optional icon.

### EmptyState

Clear title, body, optional action, and optional icon. Should feel polished even in placeholder mode.

### DataTable

Starter table shell for headers, rows, and empty state presentation. No advanced behaviors yet.

### Badge

Role/status badge using semantic color variants.

### ProgressCard

Card for progress-oriented content such as course completion or onboarding status.

## Motion

- Keep motion minimal and state-driven
- Hover/focus transitions only
- Respect reduced motion

## Anti-Patterns

- No gradient text
- No side-accent borders on cards
- No decorative glassmorphism
- No oversized dashboard numerics as hero styling
- No inconsistent button or input vocabulary
