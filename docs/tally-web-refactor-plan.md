# Tally Web Full Refactor Plan

## Implementation Status

Last updated: 2026-08-25

| Phase | Status | Completed work |
| --- | --- | --- |
| Phase 0 — Baseline and Refactor Safety | COMPLETED | Added `docs/refactor-baseline.md`, route acceptance matrix, worktree safety record, and baseline validation notes. |
| Phase 1 — Folder Structure and Integration Boundary | COMPLETED — structural scope | Added feature entry points and compatibility exports; moved dashboard/interviews composition into feature folders; separated application board, status badge, config, and toolbar ownership; kept routes thin. |
| Phase 2 — Global CSS | PENDING | Not started. |
| Phase 3 — `app-ui` Design System | PENDING | Not started. |
| Phase 4–12 | PENDING | Not started. |

Phase 1-এর deeper visual decomposition of the applications table/form and application-detail tabs is intentionally kept for Phases 6–7. No raw shadcn component or backend/API contract was changed.

Validation completed for Phase 0–1: TypeScript, ESLint, Next production build, and `git diff --check` passed. Vitest could not load its config because of the current sandbox permission issue.

## Summary

`prototype.html` এবং `docs/ui-ux-spec.md` হবে visual source of truth। Refactor-এর লক্ষ্য শুধু styling পরিবর্তন নয়; পুরো `tally_web` frontend-কে feature-based structure, reusable `app-ui` layer, responsive shell, stable API integration এবং testable screen architecture-এ নেওয়া।

নিম্নলিখিত সিদ্ধান্তগুলো ধরা হয়েছে:

- Existing auth, CRUD, filters, board, notes, interviews, settings, import/export এবং PWA behavior থাকবে।
- Existing route URL, API contract, RTK Query hooks এবং data types compatible থাকবে।
- `components/ui`-এর raw shadcn components অপরিবর্তিত থাকবে।
- `components/app-ui` custom abstraction layer হিসেবে থাকবে।
- App UI component API backward-compatible ভাবে evolve করবে।
- Prototype-এর install/offline এবং useful keyboard interactions রাখা হবে; demo screen switcher ও demo-only controls রাখা হবে না।
- Light/dark theme দুটোই থাকবে।
- CSS strategy হবে semantic design tokens + Tailwind utilities।
- Responsive visual QA, accessibility এবং interaction testing বাধ্যতামূলক হবে।

## Target Architecture

```txt
src/
├─ app/
│  ├─ (public)/
│  ├─ (protected)/
│  ├─ (auth)/
│  ├─ offline/
│  ├─ globals.css
│  └─ layout.tsx
├─ components/
│  ├─ ui/                 # raw shadcn; unchanged
│  ├─ app-ui/             # app-owned primitives and patterns
│  ├─ layout/             # AppShell, topbar, sidebar, mobile nav
│  └─ providers/
├─ features/
│  ├─ auth/
│  ├─ dashboard/
│  ├─ applications/
│  ├─ interviews/
│  └─ settings/
├─ hooks/
├─ lib/
├─ store/
├─ styles/
├─ types/
└─ tests/
```

Feature-specific UI, hooks, schemas, formatters এবং state logic feature folder-এর মধ্যে থাকবে। Route files শুধু feature entry component render করবে।

## Phase 0 — Baseline এবং Refactor Safety [COMPLETED]

- Existing uncommitted changes preserve করে current behavior inventory তৈরি।
- সব route, API hook, mutation, loading/error/empty state এবং modal flow map করা।
- Prototype screen-to-route acceptance matrix তৈরি।
- Current `typecheck`, `lint`, unit এবং E2E baseline capture করা।
- Package-manager signature সমস্যা resolve না হওয়া পর্যন্ত lockfile পরিবর্তন না করা।
- প্রতিটি phase শেষে build, typecheck, lint এবং relevant tests চালানো।

Exit criteria: বর্তমান behavior-এর documented baseline এবং phase-wise acceptance checklist প্রস্তুত।

## Phase 1 — Folder Structure এবং Integration Boundary [COMPLETED — STRUCTURAL SCOPE]

- `DashboardUI`, `ApplicationWorkspace`, `ApplicationDetailUI`, settings এবং interview UI feature folders-এ ভাগ করা।
- Route-level files thin করা।
- Applications-এর table, mobile card, board, filters, toolbar, form, detail header এবং detail tabs আলাদা component করা।
- Dashboard-এর stats, follow-up, chart, recent applications এবং upcoming interviews আলাদা component করা।
- Notes, tags, interviews এবং settings-এর feature-specific UI নিজ নিজ feature folder-এ নেওয়া।
- `components/ui` import কেবল `components/app-ui`-এর মধ্যে সীমাবদ্ধ রাখা।
- Existing direct imports-এর জন্য compatibility re-export রাখা, যাতে migration ধাপে ধাপে হয়।

Exit criteria: কোনো route monolithic UI file-এর উপর নির্ভর করবে না; backend/API behavior অপরিবর্তিত থাকবে।

## Phase 2 — Design Tokens এবং Global CSS Redesign

Prototype অনুযায়ী:

- Inter font এবং typography scale যুক্ত করা।
- Light/dark semantic tokens নির্ধারণ:
  - background, surface, muted surface
  - text hierarchy
  - border এবং strong border
  - primary, hover, active, subtle এবং ring
  - success, warning, danger, info
  - application status colors
  - interview status colors
- Radius rule স্থির করা:
  - input/button: 6px
  - card/modal: 8px
  - badge/tag: 4px
- Prototype-এর border-first visual language অনুযায়ী unnecessary shadow কমানো।
- Modal/popover-এর জন্য নির্দিষ্ট shadow রাখা।
- Focus-visible, reduced-motion, disabled এবং keyboard states globalভাবে standardize করা।
- `src/app/globals.css`-কে token/base/theme entry হিসেবে রাখা এবং প্রয়োজনে `src/styles/`-এ theme/base/animation ভাগ করা।
- Current duplicate token naming cleanup করে shadcn এবং app-ui উভয়ের জন্য stable semantic mapping তৈরি করা।

Exit criteria: prototype-এর light/dark color, typography, spacing, radius এবং focus behavior globalভাবে নির্ভরযোগ্য হবে।

## Phase 3 — `app-ui` Design System Redesign

Raw shadcn layer অপরিবর্তিত রেখে custom layer redesign করা হবে:

- Actions: `AppButton`, loading, disabled, icon এবং danger variants
- Forms: `AppInput`, `AppTextarea`, `AppField`, `AppSelect`, checkbox, switch, date/time এবং file upload
- Layout: `AppCard`, `AppPageHeader`, stat card, responsive section wrapper
- Data display: badge, status badge, table, mobile list/card, pagination, avatar
- Navigation: tabs, segmented control, breadcrumb, dropdown
- Feedback: alert, empty state, skeleton, offline banner, toast
- Overlays: modal, confirm dialog, popover, sheet, tooltip
- Application-specific status এবং interview-status mapping-এর জন্য typed variants

বর্তমান `App*` names ও props যতটা সম্ভব রাখা হবে। নতুন visual variants/slots যোগ করা যাবে, কিন্তু feature migration-এর সময় breaking API তৈরি করা হবে না।

Exit criteria: `ui-preview` page নতুন design system-এর living contract হিসেবে update হবে এবং সব reusable component light/dark/responsive state দেখাবে।

## Phase 4 — App Shell এবং Public Screens

Prototype অনুযায়ী authenticated shell:

- Desktop-এ 240px sidebar।
- Tablet-এ collapsible 260px drawer।
- Mobile-এ bottom navigation।
- Sticky topbar, search trigger, notifications, theme control এবং account actions।
- Correct content padding, max-width এবং responsive breakpoints।
- Skip link, focus management এবং accessible navigation।
- Offline banner এবং PWA install affordance।
- `/`, `/404`, `/offline`, global error এবং loading state redesign।

Public/auth screens:

- Login
- Register
- Verify email pending/success/failure
- Forgot password
- Reset password

Prototype-এর auth card, logo mark, form spacing, social login, password visibility এবং feedback states অনুসরণ করা হবে।

Exit criteria: সব public/protected route prototype-এর shell ও responsive behavior অনুসরণ করবে।

## Phase 5 — Dashboard Refactor

Dashboard-কে reusable sections-এ ভাগ করা হবে:

- Page header এবং primary actions
- Four-stat summary grid
- Follow-ups card
- Status distribution donut এবং legend
- Upcoming interviews card
- Recent applications table/mobile list
- Install prompt card
- Loading skeleton, API error এবং empty states

Behavior:

- Stat card থেকে relevant applications filter view-এ যাওয়া।
- “View all” links সঠিক query state সহ কাজ করা।
- Chart responsive এবং dark-theme compatible হওয়া।
- ECharts client-only/dynamic boundary-তে রাখা।

Exit criteria: dashboard desktop, tablet, mobile এবং light/dark state-এ prototype-compliant হবে।

## Phase 6 — Applications List এবং Workspace

Applications screen-এর complete refactor:

- Page header এবং add application action
- Search bar এবং debounced URL state
- Filter popover/sheet
- Sort menu
- Active filter chips
- List/board segmented control
- Desktop table
- Mobile application cards
- Accessible pagination
- Empty, no-result, loading এবং error states
- Archived applications handling

Board:

- Status columns
- Drag-and-drop progressive enhancement
- Keyboard/accessibility-compatible status menu
- Optimistic status update এবং rollback
- Responsive horizontal scrolling

Form:

- Add/edit application modal
- React Hook Form + Zod validation
- Company, role, URL, location, workplace, employment, source, date, salary, tags এবং note
- Backend field error mapping
- Offline mutation guard

Exit criteria: list, mobile card এবং board view একই API/query state ব্যবহার করবে এবং filter/sort/page URL-compatible থাকবে।

## Phase 7 — Application Detail, Notes এবং Activity

Application detail screen:

- Back navigation
- Company/role header
- Status badge ও status selector
- Tags এবং tag assignment
- Edit, archive/unarchive এবং delete actions
- Application metadata grid
- Follow-up section
- Overview tab
- Notes tab
- Interviews tab
- Activity/status history tab

Notes:

- Add note
- Delete note
- Loading/empty/error state
- Accessible textarea এবং feedback

Interviews:

- Detail page-এ interview list
- Meeting link/location/interviewer information
- Status এবং date formatting

Exit criteria: prototype detail screen-এর সব visible section এবং existing CRUD behavior functional হবে।

## Phase 8 — Interviews Screen

- Upcoming এবং past tab
- Count badges
- Interview row/card design
- Application, type, date/time, interviewer, meeting link এবং status display
- Add/edit interview modal
- Delete confirmation
- Empty/loading/error state
- Mobile-friendly stacked layout
- Date/time এবং timezone formatting consistent করা

Exit criteria: upcoming/past data, mutation states এবং responsive layout সম্পূর্ণ হবে।

## Phase 9 — Settings Screen

Settings layout:

- Desktop vertical navigation
- Mobile horizontal tab navigation
- Profile
- Security/password
- Connected accounts
- Tags
- Preferences
- Data export/import

Behavior:

- Profile update
- Change/set password
- OAuth connect/disconnect confirmation
- Tag create/edit/delete
- Theme persistence এবং server preference synchronization
- Default landing page/timezone/notifications
- JSON/CSV export
- Import confirmation এবং failure handling

Exit criteria: settings prototype-এর panel structure, spacing, feedback এবং destructive confirmation behavior অনুসরণ করবে।

## Phase 10 — State, Error এবং Offline Hardening

- Shared query-param parser/serializer তৈরি।
- Applications filter state centralized করা।
- API error normalization এবং field-error mapping standardize করা।
- RTK Query cache invalidation verify করা।
- Offline অবস্থায় mutation disable/warn behavior একীভূত করা।
- Toast/banner/error message copy standardize করা।
- Theme server preference এবং local early-render cache synchronize করা।
- Loading, error, empty এবং unauthorized state প্রতিটি screen-এ audit করা।

Exit criteria: একই ধরনের state-এর জন্য আলাদা ad-hoc implementation থাকবে না।

## Phase 11 — Testing এবং Visual QA

Unit/component tests:

- App UI variants
- Status badge mapping
- Form validation
- URL filter helpers
- Empty/error/loading states
- Modal and toast behavior
- Offline mutation guard

Integration tests with MSW:

- Login/register
- Application create/update/delete
- Status change
- Notes CRUD
- Interviews CRUD
- Tags/settings
- Import/export error handling

E2E tests:

- Login থেকে dashboard
- Create application
- Search/filter/sort
- Board status change
- Application detail edit
- Add note/interview
- Settings update
- Logout
- Offline fallback

Visual QA viewports:

- Desktop: 1440px
- Tablet: 1024px / 768px
- Mobile: 390px

প্রতিটি প্রধান screen light এবং dark theme-এ পরীক্ষা করা হবে। Screenshot baseline ও manual review থাকবে; pixel-perfect diff release gate হবে না।

Exit criteria: responsive visual QA, accessibility checks, interaction tests এবং production build pass করবে।

## Phase 12 — Cleanup এবং Documentation

- Legacy monolithic component files সরানো বা compatibility shim-এ সীমাবদ্ধ করা।
- Unused imports, duplicate styles এবং obsolete tokens remove করা।
- `ui-preview` update করা।
- Folder structure এবং component usage documentation update করা।
- Refactor plan-এর প্রতিটি phase-এর completion status record করা।
- Final route/API compatibility audit করা।

## Public API এবং Interface Policy

- Existing route URLs অপরিবর্তিত থাকবে।
- Existing API endpoint, payload, RTK Query hook এবং backend types অপরিবর্তিত থাকবে।
- Raw shadcn files edit করা হবে না।
- `components/app-ui`-এর existing exports preserve করা হবে।
- নতুন feature components feature folders থেকে export হবে।
- Design tokens semantic CSS variables হিসেবে public styling contract হবে।
- Application status এবং interview status typed mapping হিসেবে কেন্দ্রীভূত হবে।

## Final Acceptance Criteria

- Prototype-এর সব production screen Next.js implementation-এ থাকবে।
- Existing auth ও data behavior ভাঙবে না।
- Desktop/tablet/mobile layout responsive হবে।
- Light/dark theme consistent হবে।
- Raw shadcn এবং custom app-ui layer আলাদা থাকবে।
- Feature folder structure পরিষ্কার হবে।
- Loading, empty, error, offline এবং destructive states সম্পূর্ণ হবে।
- Accessibility এবং keyboard interaction কাজ করবে।
- Unit, integration, E2E এবং build checks pass করবে।
- Approved plan অনুযায়ী refactor phase-by-phase merge করা যাবে।

## Assumptions

- Backend refactor এই scope-এর বাইরে।
- Current uncommitted changes preserve করা হবে।
- Prototype এবং `docs/ui-ux-spec.md` conflicting হলে prototype-এর concrete layout এবং specification-এর behavior rules একসঙ্গে reconcile করা হবে।
- Approved plan file-এর প্রস্তাবিত নাম: `tally_web/docs/tally-web-refactor-plan.md`।
