# Pohuntoon Foundation Reset Design

## Goal

Reset the existing Orbis codebase into Pohuntoon without destabilizing working auth, RBAC, Prisma, or route contracts. This batch covers three foundations only:

1. global user-facing rename from Orbis to Pohuntoon
2. production-ready PWA support
3. mobile-first shell and design system reset

Notification center, browser push flows, and notification settings are explicitly deferred to the next scoped implementation prompt, but this design leaves the right architectural hooks in place.

## Product Direction

Pohuntoon is a collaborative growth platform centered on people, learning, progress, and calm professional execution. The product should feel bright, human, premium, and fast. Mobile is the primary experience. Desktop expands the same product surface instead of defining it.

Tagline:

`People. Ideas. Progress.`

This tagline should appear consistently in user-facing brand surfaces such as metadata, auth screens, install messaging, splash/loading treatments, and future-ready content helpers.

## Scope

### In Scope

- replace user-facing Orbis branding with Pohuntoon
- add PWA manifest, icons, offline fallback, service worker, install/update support
- introduce Pohuntoon color tokens and shared branding helpers
- replace the current shell with a mobile-first app shell
- add bottom navigation for partner mobile experience
- keep desktop sidebar/topbar for larger screens
- add reusable app-like components required for the new shell
- prepare capability helpers for share, clipboard, camera, file upload, wake lock, badge API, and safe-area handling
- update landing/root page, auth pages, loading states, empty states, metadata, README, and install-facing copy

### Out of Scope

- changing database table names
- changing route structure unless required by layout composition
- building native iOS or Android apps
- implementing push notification delivery, notification settings persistence, or notification center UX in this batch
- redesigning business modules like leads, learning, or admin workflows beyond shell-level adaptation

## Constraints

- Keep existing `/app/*` and `/admin/*` routes intact.
- Keep current auth and RBAC behavior intact.
- Do not break existing resource center behavior.
- Avoid internal renames that create churn without user-facing value.
- Favor app-shell and design-token changes over route rewrites.

## Recommended Approach

### Option A: Route-Stable Foundation Reset (Recommended)

Keep the route tree and data contracts, replace branding and shell, and add PWA support at the app root.

Pros:

- lowest risk to completed prompt work
- fastest path to a credible installed PWA
- isolates design/system work from auth/data logic
- easier to verify incrementally

Cons:

- some internal file names and CSS class names may still reference Orbis until cleaned up later
- mobile navigation must adapt to existing route structure instead of a fresh IA rewrite

### Option B: Full Information Architecture Reset

Reshape routes and navigation while adding branding and PWA support.

Pros:

- cleaner long-term route semantics
- allows deeper product restructuring now

Cons:

- substantially higher risk
- reopens auth, RBAC, middleware, redirects, and existing page links
- not justified before feature breadth expands

### Option C: Branding-Only First

Update names, colors, and metadata but defer PWA and shell changes.

Pros:

- smallest code diff
- easy to ship quickly

Cons:

- misses the most important platform shift
- leaves mobile experience structurally wrong

Recommendation: Option A.

## Architecture

The implementation should be organized around four foundation layers:

1. brand/config layer
2. app capability/PWA layer
3. shell/navigation layer
4. component token layer

The route tree remains the same, while layouts consume new shared shell primitives that render differently across mobile and desktop breakpoints.

## Design System Direction

### Visual Identity

Use Pohuntoon’s supplied palette as the canonical foundation:

- primary: `#1E4E9A`
- secondary: `#29B7E5`
- purple: `#6E4BD8`
- orange: `#F5A623`
- green: `#2CBF6D`
- background: `#F8F9FC`
- surface: `#FFFFFF`
- text-primary: `#172B4D`
- text-secondary: `#6B7280`
- border: `#E7EAF0`

Derived semantic tokens:

- muted
- success
- warning
- error
- info

The UI should avoid heavy gradients and rely on flat color, soft elevation, rounded cards, and generous spacing.

### Motion

Use Framer Motion for targeted transitions only:

- page transitions
- bottom sheet enter/exit
- install banner reveal
- card hover and press states
- notification or toast slide-in
- skeleton shimmer

Motion must respect reduced-motion preferences.

### Form Factor Rules

Below `768px`:

- bottom navigation replaces sidebar
- cards replace tables
- sticky mobile header stays visible
- page spacing is mobile-first
- actions favor bottom sheets, drawers, and sticky/floating actions

At `768px` and above:

- permanent sidebar for admin and expanded partner layouts
- top bar remains
- multi-column modules are allowed

## Brand Layer Design

Create a single source of truth for brand identity so future prompts do not reintroduce Orbis copy. This layer should provide:

- app name: Pohuntoon
- tagline: People. Ideas. Progress.
- theme color
- short app description
- install prompt copy
- offline state copy
- future-ready email/signature copy helpers

User-facing strings should reference this layer wherever practical instead of being repeated inline.

Internal identifiers, Prisma model names, and stable technical symbols should remain unchanged unless a rename is required for correctness.

## PWA Layer Design

### Required Capabilities

- web manifest
- service worker registration
- offline fallback route/page
- static asset caching
- navigation fallback for offline usage
- installable metadata
- browser theme color
- portrait-first orientation
- full-screen display mode
- shortcuts
- version/update detection
- Apple touch icon support
- splash-friendly startup visuals
- safe-area CSS support

### Capability Hooks

Create a small client capability layer that can progressively expose:

- Web Share API
- Clipboard API
- Camera/file input support
- Wake Lock API for long learning sessions
- Badge API
- Background sync where supported

These should be wrapped behind feature detection so unsupported browsers fail gracefully.

### Offline Behavior

The app should not promise full offline functionality. Instead:

- core shell assets should cache
- static public assets should cache
- an offline fallback page should render for navigation failures
- user messaging should clearly indicate that live content may require reconnection

This is honest and production-safe for the current stage.

## Shell Layer Design

### Partner Experience

Introduce a mobile-primary shell for `/app/*`:

- sticky top header
- bottom navigation with:
  - Home
  - Learn
  - Resources
  - Leads
  - Notifications
  - Profile
- scroll-safe main content area
- floating nav styling with blur/translucent background
- safe-area-aware padding

Desktop partner view should expand into the existing sidebar/topbar pattern using the same navigation model.

### Admin Experience

Admin keeps a denser desktop-oriented shell at large sizes, but mobile still needs a simplified usable layout:

- sticky mobile header
- no permanent sidebar on small screens
- admin navigation available through sheet/drawer on mobile
- sidebar restored on desktop

### Page Modules

Dashboards should remain modular card collections rather than CRM tables. Existing placeholders should be restyled around:

- welcome
- recent work
- continue learning
- resources
- lead status
- notifications
- quick actions

## Component Design

Create or update these reusable components:

- `MobileShell`
- `DesktopShell`
- `BottomNav`
- `Sidebar`
- `TopBar`
- `InstallAppBanner`
- `MobilePageHeader`
- `FloatingActionButton`
- `BottomSheet`
- `OfflineState`
- `AppBadge`
- `SkeletonLoader`

Update existing components to adopt the new token system and mobile patterns:

- `EmptyState`
- `ProgressCard`
- `ResourceCard`
- `PageHeader`
- `Topbar`
- `AppShell`

Component requirements:

- accessible labels and focus states
- keyboard support where relevant
- mobile responsiveness
- dark-theme-ready token usage even if dark mode is not activated yet

## Navigation Model

### Partner Mobile Bottom Nav

- `/app/dashboard`
- `/app/learning`
- `/app/resources`
- `/app/leads`
- `/app/notifications`
- `/app/profile`

Labels should be user-friendly. Existing underlying routes remain unchanged.

### Desktop/Admin Navigation

Keep the current information architecture and RBAC gating. Only the visual shell and responsive behavior change in this batch.

## Metadata and Content Surfaces

Update these user-facing surfaces:

- app metadata in root layout
- auth page copy
- account status pages
- sidebar logo text
- top-level page headings where still branded
- loading and empty states
- README branding references
- future-ready helper copy used by install/offline states

Do not mass-rename historical planning docs or internal archived references unless needed for active product output.

## Accessibility

The shell reset must preserve or improve:

- semantic landmarks
- visible focus indicators
- sufficient contrast
- keyboard navigation
- screen reader labels for bottom nav and install controls
- reduced motion behavior
- minimum 44px tap targets on mobile

## Performance

This batch should preserve good build performance and move toward Lighthouse-friendly output by:

- keeping shell components lightweight
- lazy loading non-critical client-only PWA helpers where sensible
- using static icons/assets efficiently
- avoiding unnecessary client rendering of server-first layouts

## File and Responsibility Plan

Expected file groups:

### Brand and Config

- brand config helper in `lib/config`
- metadata updates in `app/layout.tsx`
- token updates in `app/globals.css`

### PWA

- manifest route or static manifest file
- service worker registration helper
- offline page/route
- install/update client helpers
- public icons and touch icons

### Shell

- new mobile and desktop shell components in `components/layout`
- bottom navigation and mobile header components
- optional client-side sheet/banner helpers in `components/shared` or `components/layout`

### Adapted Routes

- root page
- auth pages
- app/admin layouts
- selected placeholder pages for shell integration and brand consistency

## Error Handling

- If service worker registration fails, the app should continue normally.
- If install prompt support is unavailable, the banner should hide itself.
- If capability APIs are unavailable, related actions should degrade silently or show non-blocking fallback copy.
- If offline navigation occurs, render the offline page instead of a broken browser error.

## Testing Strategy

This batch should verify:

- branding helpers return the correct app identity
- navigation config still maps correctly for partner/admin roles
- metadata and manifest generation are valid
- core layouts build successfully
- bottom navigation renders expected links
- install/offline helpers do not crash unsupported environments

At minimum:

- extend unit coverage for config/navigation helpers
- add tests for any new client capability guards that have logic worth isolating
- run lint, type-check, tests, and production build

## Risks

### Risk: superficial rename only

Mitigation: centralize brand copy and token usage instead of editing strings ad hoc.

### Risk: PWA complexity leaks into unrelated code

Mitigation: isolate manifest, service worker, and capability helpers from business modules.

### Risk: mobile shell breaks desktop admin usability

Mitigation: use shared layout primitives with breakpoint-specific behavior rather than forcing one shell everywhere.

### Risk: overbuilding notifications early

Mitigation: defer notification product UX to the next prompt while leaving architectural hooks only.

## Success Criteria

This batch is successful when:

- users see Pohuntoon everywhere instead of Orbis
- the app is installable as a PWA
- offline fallback exists and core assets cache safely
- mobile experience uses a native-style shell with bottom navigation
- desktop still works cleanly with expanded layouts
- auth, RBAC, and resource routes continue to function
- future prompts can build on Pohuntoon branding and mobile-first assumptions by default
