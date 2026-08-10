# Frontend Implementation Plan

## Tally

This plan converts the frontend, UI/UX, PRD, operations, and Definition of Done
specifications into small delivery phases. It is coordinated with the API
refactor plan: a feature may use MSW while its API module is being refactored,
but it must switch to the released, versioned HTTP schema/types before release.

## Current architecture status

- `web/` is an independent Next.js repository with no workspace dependency on
  `api/`.
- API releases versioned `contracts/openapi.json` artifacts; web pins and
  validates the released OpenAPI contract rather than importing backend source
  types.
- `components/app-ui` is the only app-facing primitive layer. shadcn/ui may be
  customized inside that folder, but pages and features must never import
  shadcn/ui directly.
- RTK Query base and endpoint modules live in `store/api`; Redux slices hold
  only auth and durable UI state.

## Delivery Rules

- Use Next.js 16+ App Router, TypeScript strict mode, Tailwind CSS, Redux Toolkit, and RTK Query.
- Keep backend communication in RTK Query API modules under `store/api`; do not
  call `fetch` or Axios in UI components.
- Store access tokens in Redux memory only. Never use localStorage or sessionStorage for access tokens.
- Use React Hook Form and Zod for every interactive form.
- Use semantic HTML, keyboard access, visible focus styles, and WCAG 2.1 AA as implementation requirements.
- Follow the UI/UX visual system: indigo `#6366f1`, compact radii, thin borders, and no heavy shadows.
- Normalize the approved API envelope: successful responses require `message`,
  direct object/array payloads live in `data` (never an `items` wrapper), and
  error codes/details live in `error` with a request ID in `meta`.
- Do not complete a feature phase until its API refactor phase has released a
  matching contract version and its RTK Query endpoints have been verified.

---

## Phase 0 — Next.js Package Bootstrap

### Scope

- Initialize `web/` as a standalone Next.js App Router + TypeScript project.
- Add the single `src/proxy.ts` convention with a named `proxy` export; do not
  use the deprecated `middleware.ts` convention. Keep it limited to narrow,
  token-independent request-boundary work.
- Add its development, build, lint, typecheck, unit-test, and E2E scripts.
- Add the documented frontend environment template.

### Exit criteria

- `pnpm dev` starts the app from `web/`.
- Production build and typecheck succeed.

## Phase 1 — Frontend Tooling and Test Foundation

### Scope

- Configure ESLint, Prettier, Vitest, Testing Library, MSW, and Playwright.
- Add test setup, browser/server mock handlers, and a smoke test.

### Exit criteria

- Lint, format check, unit test, and E2E test commands run.
- A component test renders successfully in a DOM test environment.

## Phase 2 — Folder Structure and Shared Types

### Scope

- Create the documented route groups, `components/app-ui`, layout/forms/shared
  components, feature folders, `store/api`, slices, hooks, lib, styles, and
  types structure.
- Add API-envelope, auth, user, application, tag, note, interview, dashboard,
  and export/import TypeScript types.
- Pin and validate client types against the released OpenAPI 3.1 artifact; do
  not create a workspace package.

### Exit criteria

- Frontend types compile without duplicating incompatible backend contract shapes.

## Phase 3 — Design Tokens and Global Styling

### Scope

- Configure Tailwind and global CSS variables for light/dark semantic colors.
- Implement the 4px spacing scale, typography, border radii, status colors, focus ring, and reduced-motion behavior.
- Load Inter through `next/font`.

### Exit criteria

- Light and dark token previews match the UI/UX specification.
- Components can use semantic tokens without hard-coding page-specific colors.

## Phase 4 — Base App Shell and Metadata

### Scope

- Implement root layout, page metadata, global error boundary, not-found page, and static loading fallback.
- Add skip-to-content support and the root content landmark.

### Exit criteria

- Every route has a consistent document shell and accessible main-content target.

## Phase 5 — Reusable UI Primitives: Inputs and Actions

### Scope

- Build Button, Input, Textarea, Select, Checkbox, Switch, Badge, Tag, Tooltip, and Spinner primitives.
- Ensure label, error, disabled, loading, and focus states are accessible.

### Exit criteria

- Form primitives are keyboard usable and have component tests.

## Phase 6 — Reusable UI Primitives: Feedback and Overlays

### Scope

- Build Dialog/Modal, confirmation dialog, Toast, ErrorBanner, EmptyState, Skeleton, Pagination, Tabs, DropdownMenu, and OfflineBanner.
- Add focus trap, Escape close, focus return, and live-region behavior.

### Exit criteria

- Dialogs and toasts meet keyboard and screen-reader requirements.

## Phase 7 — Redux Store and Providers

### Scope

- Configure Redux Toolkit store, typed hooks, API reducer placeholder, auth slice, UI slice, and StoreProvider.
- Ensure auth state is never persisted.

### Exit criteria

- Client components can read/write typed UI state.
- Access-token state disappears on a full browser reload.

## Phase 8 — RTK Query Base API

### Scope

- Create the RTK Query base API with documented cache tag types.
- Configure `NEXT_PUBLIC_API_URL`, JSON envelope normalization, and credential inclusion.
- Add MSW defaults for the initial API surface.

### Exit criteria

- Components do not need direct HTTP calls.
- Query/mutation error states have one normalized shape.

## Phase 9 — Reauthentication Base Query

### Scope

- Add in-memory Bearer token attachment.
- Implement one-at-a-time refresh handling for 401 responses, original-request retry, auth clearing, and login redirect on refresh failure.

### Exit criteria

- Concurrent 401 responses produce only one refresh request.
- No access token is written to browser storage.

## Phase 10 — Theme System

### Scope

- Add light, dark, and system theme selection.
- Apply the `dark` class to the document and use an early-render local theme cache.
- Prepare server-preference reconciliation and failed-update rollback behavior.

### Exit criteria

- Theme changes do not cause a visible flash or layout shift.
- All primitives render correctly in both themes.

## Phase 11 — Route Groups and Route Guards

### Scope

- Create public/protected route groups and root redirect behavior.
- Implement client-side `PublicOnlyRoute` and `ProtectedRoute` guards plus intended-path preservation.
- Add auth loading/unverified states.

### Exit criteria

- Protected pages never render their content before auth state resolves.
- Unauthenticated users reach `/login?redirect=...`.

## Phase 12 — Authentication API and Bootstrap

### Scope

- Add auth RTK Query endpoints: refresh, get-me, login, logout, register, verification, recovery, password, and connected-account operations.
- Implement app-load session bootstrap.

### Exit criteria

- Refresh followed by `/auth/me` sets the documented auth state.
- Failed bootstrap results in a clean unauthenticated state.

## Phase 13 — Public Auth Forms

### Scope

- Implement login, registration, forgot-password, reset-password, and verification pages/forms.
- Mirror backend validation rules and map server field errors to form fields.

### Exit criteria

- Forms provide inline errors, prevent duplicate submit, and redirect according to auth state.

## Phase 14 — OAuth and Account-Recovery UX

### Scope

- Add Google/GitHub start controls, social callback session restoration, verification-pending experience, and neutral recovery confirmations.
- Handle safe OAuth error states.

### Exit criteria

- Social callback restores the session through refresh and redirects safely.
- Public auth screens meet the documented loading/error/success states.

## Phase 15 — Authenticated Navigation Shell

### Scope

- Build desktop sidebar, tablet navigation, mobile top bar/bottom navigation, user menu, theme toggle, global search, and global add-application trigger.
- Implement responsive breakpoints and safe-area support.

### Exit criteria

- Navigation supports Dashboard, Applications, Interviews, and Settings on desktop and mobile.
- Global search routes to the canonical applications search URL.

## Phase 16 — Application API Service and URL-State Utilities

### Scope

- Add application endpoints and documented cache invalidation rules.
- Build typed URL parameter parsing/serialization and 300ms search debouncing.

### Exit criteria

- Application list state survives refresh/back/forward and produces valid API query arguments.

## Phase 17 — Application List

### Scope

- Build search, filters, active-filter chips, sorting, pagination, desktop table, mobile cards, skeletons, empty states, and no-results states.

### Exit criteria

- List works responsively with every documented filter and sort parameter.
- Default page size is 20 and pagination controls are accessible.

## Phase 18 — Application Form and Create Flow

### Scope

- Build add-application modal/form with required and optional fields, tag selection, initial note, salary/currency rules, and follow-up date/time.
- Integrate create mutation, toast, and list/dashboard invalidation.

### Exit criteria

- Form validation mirrors the backend contract.
- A successful create updates the visible UI without manual refresh.

## Phase 19 — Application Detail and Edit Flow

### Scope

- Build application detail header, metadata grid, overview, edit form, archive/unarchive, delete confirmation, and external job link handling.

### Exit criteria

- Detail works on mobile and desktop.
- Generic edit cannot change status; destructive actions require confirmation.

## Phase 20 — Status Management and Activity

### Scope

- Build status badges, status-selection control, optional change-note dialog, and status-history timeline.
- Highlight overdue and today follow-ups.

### Exit criteria

- Status mutation refreshes detail, list, dashboard, and history correctly.
- The accessible status control is the MVP implementation; drag-and-drop board remains optional.

## Phase 21 — Tag Management

### Scope

- Add tag API endpoints and reusable tag selector/input.
- Build settings tag create/edit/delete UI and application assignment/removal actions.

### Exit criteria

- Tag changes invalidate documented list/detail data.
- Tag deletion confirmation explains that application records are retained.

## Phase 22 — Notes

### Scope

- Add notes API endpoints and the application-detail notes composer/list/edit/delete flow.

### Exit criteria

- Notes sort newest-first and mutations refresh the notes area.

## Phase 23 — Interviews

### Scope

- Add interview API endpoints, application-detail interview controls, and global interviews page with Upcoming/Past sections.
- Implement global add flow with required application selection.

### Exit criteria

- Upcoming/past sort order, meeting links, empty states, and archive behavior follow the specification.

## Phase 24 — Dashboard Service and Widgets

### Scope

- Add dashboard RTK Query endpoint.
- Build stat cards, follow-up lists, upcoming interviews, recent applications, empty/onboarding state, retry banner, and lazy-loaded status chart.

### Exit criteria

- Widget links use canonical filtered/list/detail routes.
- Dashboard has loading, empty, and error states and remains responsive.

## Phase 25 — Settings: Profile, Security, and Preferences

### Scope

- Build profile, change/set password, connected-account link/unlink, theme, landing page, time zone, and notification preference UI.
- Add confirmation for provider unlinking and last-login-method error handling.

### Exit criteria

- Server-stored preferences supersede the local early-render cache after bootstrap.
- Security forms provide safe, clear feedback.

## Phase 26 — Export and Import UX

### Scope

- Implement JSON/CSV downloads through RTK Query raw response handling.
- Add JSON import selector, size/type feedback, destructive confirmation, mutation feedback, and cache refresh.

### Exit criteria

- Download uses the server filename when supplied and revokes object URLs.
- Import clearly states that portable application data will be replaced.

## Phase 27 — PWA Foundation

### Scope

- Add `public/manifest.json`, Tally icon assets, `offline.html`, `sw.js`, and
  the offline route.
- Precache only static app-shell assets; exclude authenticated API responses.

### Exit criteria

- The deployed application is installable and provides the offline fallback page.

## Phase 28 — Offline, Install, and Update UX

### Scope

- Add online-status hook, global offline banner, offline mutation warning/disable behavior, custom install prompt, and service-worker update toast.

### Exit criteria

- Offline state is visible globally and mutations do not silently fail.
- An available service-worker update can be applied through Reload.

## Phase 29 — Frontend Quality Completion

### Scope

- Complete unit tests for helpers, schemas, guards, and reauthentication.
- Complete component/integration tests with MSW for auth, applications, tags, notes, interviews, dashboard, and settings.
- Add the critical Playwright release-candidate flows.

### Exit criteria

- Frontend checklist in `definition-of-done.md` is satisfied.
- Critical E2E flows pass against a running frontend and API.

## Phase 30 — Performance, Accessibility, and Deployment Review

### Scope

- Run Lighthouse, responsive/manual keyboard checks, screen-reader checks, and production PWA validation.
- Verify Vercel environment configuration, error boundaries, and deployed API connectivity.

### Exit criteria

- Lighthouse Performance, Accessibility, Best Practices, and SEO target 90+.
- Production build, PWA installation, theme, protected routes, and offline behavior pass smoke tests.

---

## Dependency Order

```txt
0–4 bootstrap, structure, and visual foundations
  -> 5–6 reusable UI primitives
    -> 7–10 state, API, reauth, and theme
      -> 11–14 routing and public authentication
        -> 15 authenticated shell
          -> 16–23 applications and related resources
            -> 24–26 dashboard and settings/portability
              -> 27–28 PWA
                -> 29–30 release quality
```

## Notes on Backend Dependency

- Frontend phases 0–11 can be delivered without a completed backend.
- Phases 12 onward should use MSW until the corresponding API phase is ready.
- Integration against real backend endpoints should happen progressively, not only at the end.

## Reference Documents

- `prd.md`
- `frontend-spec.md`
- `ui-ux-spec.md`
- `definition-of-done.md`
