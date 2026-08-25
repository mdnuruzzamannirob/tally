# Refactor Baseline

## Phase 0 status

- Existing staged changes preserved:
  - `src/app/(protected)/applications/page.tsx`
  - `src/features/applications/ApplicationWorkspace.tsx`
- Raw shadcn primitives under `src/components/ui` are unchanged.
- Existing API services, route paths, auth guards, store slices, and shared types remain the integration boundary.
- Approved implementation plan: `docs/tally-web-refactor-plan.md`.

## Route acceptance matrix

| Surface | Route | Current owner | Compatibility requirement |
| --- | --- | --- | --- |
| Root redirect | `/` | `RootRedirect` | Preserve auth-aware landing behavior |
| Login | `/login` | `features/auth` | Preserve credentials, social login, and redirect behavior |
| Register | `/register` | `features/auth` | Preserve validation and verification redirect |
| Verification | `/verify-email` | `features/auth` | Preserve pending/success/failure states |
| Recovery | `/forgot-password`, `/reset-password` | `features/auth` | Preserve token and error behavior |
| Dashboard | `/dashboard` | `features/dashboard` | Preserve summary query and widget links |
| Applications | `/applications` | `features/applications` | Preserve URL filters, list/board, pagination, and create flow |
| Application detail | `/applications/:id` | `features/applications` | Preserve CRUD, notes, tags, interviews, and history |
| Interviews | `/interviews` | `features/interviews` | Preserve upcoming/past queries and mutations |
| Settings | `/settings` | `features/settings` | Preserve profile, security, preferences, tags, and data flows |
| Offline | `/offline` | `app/offline` | Preserve PWA fallback behavior |
| Not found | `404` | `app/not-found` | Preserve safe dashboard return path |

## Baseline command result

The local `pnpm@9.15.0` package-manager shim refused to run because its registry signature could not be verified in the current environment. No lockfile change was made. Typecheck, lint, unit, and build checks must be rerun after the package-manager trust issue is resolved.

## Phase 1 exit criteria

- Route files only compose feature entry components.
- Dashboard, applications, interviews, and settings ownership is under `features/`.
- Compatibility exports preserve existing imports during incremental migration.
- No backend/API contract changes are introduced.
