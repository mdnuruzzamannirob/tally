# Tally project metrics inventory

**Audit scope:** repository files under `tally_web/` and `tally_api/`, including app source, tests, Prisma schema, package manifests, OpenAPI contract, and GitHub Actions workflows.

**Purpose:** record which metrics an AI can accurately derive from this checkout, which measurements require running tools, and which require production telemetry. Counts below are repository snapshots, not claims about production behavior.

## 1. Repository-derived metrics

These can be recomputed from the files without access to a deployed service.

### Application structure

| Metric                         | Count / result | Counting scope                                                                                     |
| ------------------------------ | -------------: | -------------------------------------------------------------------------------------------------- |
| Frontend pages                 |             14 | `tally_web/src/app/**/page.tsx`; Next.js route-group names such as `(public)` are not URL segments |
| Frontend URL routes            |             14 | Derived from those page files; dynamic detail route is `/applications/[id]`                        |
| OpenAPI operations             |             53 | HTTP method + path pairs in `tally_api/contracts/openapi.json`                                     |
| Component TSX files            |             78 | All `.tsx` files under `tally_web/src/components/`                                                 |
| Shared component-library files |             72 | 25 in `ui/`, 46 in `app-ui/`, 1 in `shared/`                                                       |
| Layout/provider TSX files      |              6 | 4 in `components/layout/`, 2 in `components/providers/`                                            |
| Feature TSX files              |             20 | `.tsx` files under `tally_web/src/features/`                                                       |
| Frontend feature directories   |              8 | applications, auth, dashboard, export-import, interviews, notes, settings, tags                    |
| Prisma model files             |             15 | `tally_api/prisma/schema/models/*.prisma`                                                          |
| Prisma enum files              |              2 | `tally_api/prisma/schema/enums/*.prisma`                                                           |
| Migration directories          |              6 | Immediate directories under `tally_api/prisma/migrations/`                                         |

Frontend page paths:

`/`, `/auth/social/callback`, `/applications`, `/applications/[id]`, `/dashboard`, `/interviews`, `/settings`, `/forgot-password`, `/login`, `/register`, `/reset-password`, `/verify-email`, `/offline`, `/ui-preview`.

### API operations by module

The count is based on operation entries in the checked-in OpenAPI contract. OAuth provider operations and the email webhook are included.

| Module                          | Operations |
| ------------------------------- | ---------: |
| Auth, OAuth, connected accounts |         18 |
| Applications                    |         13 |
| Interviews                      |          5 |
| Tags                            |          4 |
| Notifications                   |          3 |
| Users                           |          2 |
| Notes                           |          2 |
| Export                          |          2 |
| Dashboard                       |          1 |
| Health                          |          1 |
| Import                          |          1 |
| Email webhook                   |          1 |
| **Total**                       |     **53** |

### Backend source-layer inventory

Counted as TypeScript files by filename suffix under `tally_api/src/`.

| Layer         | Files |
| ------------- | ----: |
| Route modules |    15 |
| Controllers   |    12 |
| Services      |    19 |
| Repositories  |    15 |
| Validators    |     8 |

### Source footprint

Across `tally_web/src/` and `tally_api/src/`:

- 197 `.ts` files
- 125 `.tsx` files
- 1 `.css` file
- 10 `.md` files
- 48,733 lines across `.ts`, `.tsx`, `.js`, and `.jsx` files, using `wc -l`

The line count is a raw physical-line count, not logical statements or maintained-code-only LOC. It can include generated or otherwise machine-oriented source if such files are present under those source trees.

### Packages, scripts, workflows

| Project                       | Runtime dependencies | Dev dependencies |
| ----------------------------- | -------------------: | ---------------: |
| Web                           |                   20 |               16 |
| API                           |                   17 |               24 |
| **Combined manifest entries** |               **37** |           **40** |

These are direct dependency entries from each package manifest; the combined totals do not deduplicate same-named packages across workspaces.

- GitHub Actions workflow files: **4** (CI and supply-chain guard in each project)
- Dockerfiles: **2** (one per project)
- Playwright config files: **1** (frontend)
- Vitest config files: **2** (one per project)

CI workflow contents also allow code-derived enumeration of configured checks. The web CI includes install, lint, typecheck, tests, and production build. The API CI includes Postgres-backed setup, contract generation/validation, identity/repository audits, lint, typecheck, format, tests, build, Docker image build, and release smoke test.

### State/data-fetching patterns

- Redux Toolkit store with `auth` and `ui` slices.
- RTK Query `createApi` base plus **9 resource-specific `injectEndpoints` modules**.
- RTK Query query/mutation hooks and tag-based cache invalidation are present.
- A code search found no `onQueryStarted`, `updateQueryData`, or explicit optimistic-update implementation in the web source.
- A code search found no SWR or React Query usage.

### Accessibility markers in source

- 104 JSX `aria-*` assignments across 37 TSX files in `tally_web/src/`.
- This is a source-occurrence count, not an accessibility score or proof that every page is accessible.
- The repo contains role/name-based UI assertions in tests. After the improvements recorded below, the axe/Playwright scan passes on all seven scanned public/UI routes; this is automated coverage, not a complete manual accessibility audit.

### Other static implementation findings

- The backend source has separate route, controller, service, repository, and validator files (counts above), plus identity/repository boundary audit scripts referenced by API CI.
- API request IDs, structured request/error logging, a database health check, and rate limiting are implemented. The notification worker is configurable and schedules work on a 60-second interval when enabled.
- The web store uses RTK Query tag invalidation; no explicit optimistic-update handlers were found in the API slice source.
- No frontend analytics, Web Vitals collector, Prometheus client, OpenTelemetry SDK, or Sentry/PostHog integration was found in the searched package manifests and `src/` trees. This is scoped to those checked-in files, not external hosting configuration.
- No `next/image`, `next/dynamic`, or React `lazy()` call was found in frontend source. `next.config.ts` does configure image output formats (`webp`, `avif`), which by itself does not show that pages use the Next image component.
- A source diagnostics scan reported two Tailwind simplification suggestions in `tally_web/src/app/offline/page.tsx`: `min-h-[100dvh]` can be `min-h-dvh`, and `max-w-[420px]` can be `max-w-105`. These are style suggestions, not evidence of runtime defects.

## 2. Test and tool execution measurements

These require running the tools. They are a local execution snapshot, not static repository facts.

| Measurement                      | Result from available run                           | Limitation                                                                                  |
| -------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Vitest test files                | 54 (`tally_web/tests/unit/` and `tally_api/tests/`) | E2E Playwright specs are separate and excluded from Vitest                                  |
| Playwright spec files            | 4                                                   | Includes the axe audit spec for seven public/UI routes                                      |
| Vitest test declarations         | 157 `it()` / `test()` declaration sites             | Parameterized tests expand to multiple test cases                                           |
| Frontend Vitest cases            | 62 passed                                           | All 15 discovered frontend unit files passed                                                |
| Backend Vitest cases             | 128 passed                                          | All 39 test files passed with serial file execution and the local test PostgreSQL available |
| Combined Vitest cases discovered | 190 passed                                          | 62 frontend + 128 backend, run in their respective project workspaces                       |
| Coverage percentage              | Web 14.38% lines; API 83.91% lines                  | See per-dimension results and coverage denominator notes in the execution guide             |

The first parallel API coverage attempt had database test interference and was discarded. The final API run used serial file execution; all 128 tests passed.

### Lint, typecheck, and build results

Commands were run directly from each project using the installed local binaries.

| Project | Check                                     | Result          | Notes                                                                                                                                 |
| ------- | ----------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Web     | ESLint (`eslint .`)                       | **Passed**      | No output/errors                                                                                                                      |
| Web     | TypeScript (`tsc --noEmit`)               | **Passed**      | Ran after `next typegen --webpack` generated route types                                                                              |
| Web     | Production build (`next build --webpack`) | **Passed once** | Build succeeded in the elevated environment and generated all 15 Next.js routes; sandboxed attempts emitted a generic webpack failure |
| API     | ESLint (`eslint src tests`)               | **Passed**      | No output/errors                                                                                                                      |
| API     | TypeScript (`tsc --noEmit`)               | **Passed**      | No output/errors                                                                                                                      |
| API     | Build (`tsc -p tsconfig.build.json`)      | **Passed**      | No output/errors                                                                                                                      |

These are local check results, not GitHub Actions run-history metrics. The web production build passed outside the restricted sandbox; its generic sandbox failure was not reproduced in the elevated run.

## 3. Metrics that require an instrumented deployment

These cannot be derived reliably from the source code alone. The repository can show whether some building blocks exist, but a real value needs production traffic, telemetry, or an external measurement run.

| Metric                                                        | Why repository inspection is insufficient                             | Current repository evidence                                                                                                     |
| ------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Active users, retention, feature adoption, conversion funnels | Needs user/session event collection over time                         | No analytics SDK/event pipeline was found in package manifests or app source                                                    |
| Real-user LCP, INP, CLS, FCP                                  | Needs browser measurements from real or controlled sessions           | No Web Vitals collector was found                                                                                               |
| Production/field Lighthouse and Web Vitals                    | Local Lighthouse does not represent a public deployment or real users | Local production `/login` was measured in desktop and mobile emulation; see the execution guide                                 |
| Uptime history and availability percentage                    | Needs repeated external health checks and retained results            | Health route exists; no uptime history is stored in this repo                                                                   |
| API p50/p95/p99 latency and error rates                       | Needs a retained request sample/log stream and aggregation            | API uses `pino-http` request logging, request IDs, and structured error logs; no metrics backend/dashboard was found            |
| Database query latency, pool saturation, slow-query rate      | Requires runtime database monitoring/profiling                        | Health service checks whether database access succeeds; no query-latency dashboard was found                                    |
| Notification/email delivery rates over time                   | Needs durable aggregation of delivery events/logs                     | Delivery/worker event logging and persisted email/notification data structures exist; no aggregate delivery dashboard was found |
| Real user task completion or satisfaction                     | Requires user research or product event collection                    | Not derivable from code                                                                                                         |
| Current CI duration/pass rate trend                           | Needs workflow history from GitHub Actions                            | Workflow definitions exist; historical runs are outside this checkout                                                           |

The API uses `pino`/`pino-http`, request IDs, and a database health endpoint, so request/error logs and health responses can support some later analysis. This repository does not itself establish that logs are retained, centrally aggregated, or monitored.

## 4. Additional tool-generated metrics an AI can help collect

With the necessary tools and environment, an AI agent can run and record:

- Vitest coverage: lines, statements, branches, functions; measured for web and API, with report outputs saved under each project's ignored `coverage/` directory.
- Lint, typecheck, build, contract-validation, architecture-audit, and smoke-test pass/fail results.
- Lighthouse category scores and page-level diagnostics for local production `/login`, with multiple desktop/mobile runs.
- Bundle/build output size and route build behavior from the successful web production build.
- Axe/Playwright accessibility findings on seven public/UI routes; issues are recorded in the execution guide.
- Production dependency audit findings are recorded as JSON and summarized in the execution guide.
- API latency/error percentiles from retained structured request logs.

## 5. Tool-measured baseline

These are actual local measurements from 20 November 2026, not targets. Full method, run conditions, and repeat commands are in [`METRICS_EXECUTION_GUIDE.md`](./METRICS_EXECUTION_GUIDE.md).

### Tests and coverage

| Project |          Tests |     Statements/lines |           Branches |        Functions |
| ------- | -------------: | -------------------: | -----------------: | ---------------: |
| Web     |   35/35 passed |   8.42% (994/11,803) |   72.40% (181/250) |  25.95% (75/289) |
| API     | 128/128 passed | 88.63% (4,748/5,357) | 77.32% (873/1,129) | 94.11% (352/374) |

API coverage was collected with serial file execution and excludes generated Prisma client files. Web and API coverage reports are under their respective ignored `coverage/` directories.

### Accessibility

The axe/Playwright scan covered `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/offline`, and `/ui-preview`. All seven routes produced findings: 9 route/rule pairs affecting 20 elements, all marked serious by axe. `color-contrast` appeared on all routes; `aria-prohibited-attr` appeared on register and reset-password. This is an automated scan, not a complete manual accessibility audit.

### Lighthouse and bundle

Lighthouse 12.8.2 scanned the local production `/login` route in three desktop and three mobile runs. Median scores and key lab measurements:

| Emulation |      Performance | Accessibility | Best Practices | SEO |      FCP |      LCP | CLS |    TBT |
| --------- | ---------------: | ------------: | -------------: | --: | -------: | -------: | --: | -----: |
| Desktop   | 97 (range 75–97) |            96 |             96 |  60 |   290 ms | 1,252 ms |   0 |  26 ms |
| Mobile    | 74 (range 71–74) |            96 |             96 |  60 | 1,057 ms | 4,862 ms |   0 | 365 ms |

The first desktop run had a 25.2-second LCP; its two repeats were 1.25 and 1.23 seconds. The median and range are reported because the first run was an outlier. These are local lab results, not real-user telemetry. The successful Next production build emitted 15 route entries (13 static app pages, one dynamic application detail page, and `/_not-found`). Its `.next/static/chunks` directory was 3.1 MB, containing 45 JavaScript files: 2,940,231 raw bytes and 933,246 bytes after per-file gzip.

### Dependency audit

Registry audit results from `pnpm audit`:

| Workspace | Scope            | Advisory records | Findings | Low | Moderate | High | Critical |
| --------- | ---------------- | ---------------: | -------: | --: | -------: | ---: | -------: |
| Web       | Production       |               89 |       90 |   8 |       49 |   27 |        6 |
| Web       | All dependencies |              115 |      117 |   9 |       67 |   33 |        8 |
| API       | Production       |               41 |       41 |   2 |       24 |   14 |        1 |
| API       | All dependencies |               61 |       62 |   3 |       36 |   20 |        3 |

The full-tree critical advisories affect `next`, `proxy-addr`, and `tinypool` in web, and `proxy-addr` and `tinypool` in API. Audit exit status was 1 because advisories were found; these counts do not assess exploitability. JSON output is saved in [`artifacts/dependency-audit/`](../artifacts/dependency-audit/), and Lighthouse JSON/HTML is in [`artifacts/lighthouse/`](./artifacts/lighthouse/).

For every comparison, record the commit, command/tool version, environment, route/viewport (for browser metrics), and raw output. Without matching conditions, before/after figures may not be comparable.

## 6. Evidence paths

- Frontend pages: `tally_web/src/app/`
- Shared components: `tally_web/src/components/`
- Feature modules: `tally_web/src/features/`
- Redux/RTK Query: `tally_web/src/store/`
- API route modules: `tally_api/src/modules/`
- OpenAPI operation contract: `tally_api/contracts/openapi.json`
- Prisma schema/migrations: `tally_api/prisma/schema/` and `tally_api/prisma/migrations/`
- Tests/config: `tally_web/tests/`, `tally_api/tests/`, and each project's `vitest.config.ts`
- CI workflows: `tally_web/.github/workflows/` and `tally_api/.github/workflows/`

## 7. Improvement snapshot (20 November 2026)

This is a new measured snapshot after the changes made during the improvement pass. Section 5 remains the original baseline. Coverage percentages should be compared cautiously: the current Vitest coverage configs explicitly scope coverage to application `src/` files, so their denominator differs from the original snapshot. Raw current counts are given below.

### Changes made

- Updated web dependencies (including Next.js 16.4.6, Vitest 4.1.12, Vite 7.3.8) and API dependencies (including Nodemailer 10.6.1 and compression 1.8.2) to patched versions reported by the package audit; added pnpm overrides for vulnerable transitive versions.
- Added V8 coverage configuration for web and API. API coverage/test execution is serial across files to protect shared database tests from races.
- Added meaningful frontend unit coverage for auth controls/forms/layout/routing, application status badge, config/store behavior, and button variants/loading.
- Corrected light/dark primary and foreground colors and app-field helper text contrast. Corrected the registration consent checkbox accessible name.
- Added `aria-current="page"` to the active item in shared pagination, covered shared alert/empty-state/page-header/pagination/status-badge behavior, and added RTL cleanup to the shared Vitest setup so rendered UI does not leak between tests.
- Removed the login page's `useSearchParams()` CSR bailout and adjusted public-only route behavior so the login page can render its server HTML while session initialization is in progress.
- Added a local API stub for isolated browser tests and Lighthouse runs, avoiding calls to the configured remote API during these measurements.

### Test and coverage results

| Project    | Test files | Cases | Result     |                Lines |           Statements |           Branches |        Functions |
| ---------- | ---------: | ----: | ---------- | -------------------: | -------------------: | -----------------: | ---------------: |
| Web Vitest |         15 |    62 | 62 passed  |   14.38% (301/2,093) |   13.99% (315/2,251) | 12.95% (262/2,023) | 11.49% (106/922) |
| API Vitest |         39 |   128 | 128 passed | 83.91% (1,383/1,648) | 81.09% (1,437/1,772) | 64.49% (714/1,107) | 90.14% (448/497) |
| Playwright |    4 specs |    14 | 14 passed  |                    — |                    — |                  — |                — |

The frontend coverage percentage is still low and is a major remaining improvement area. API line coverage is 83.91%; untested backend entrypoints and some edge branches remain. Coverage outputs are in the ignored `coverage/` directories. The current test result includes a successful serial API run with local PostgreSQL access.

### Accessibility and build checks

- axe/Playwright: **7/7 routes pass with zero reported violations** (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/offline`, `/ui-preview`). The complete Playwright suite passed **14/14** after the checkbox label fix.
- ESLint and TypeScript checks passed for both web and API.
- Next.js production build passed and emitted 14 application pages plus `/_not-found`; `/applications/[id]` is dynamic, and the other 13 pages are static.
- API TypeScript production build passed.

Automated axe coverage does not replace keyboard, screen-reader, zoom, and manual interaction review.

### Lighthouse after snapshot

Three local production runs per viewport, on `/login`, with local API calls isolated from the staging API:

| Viewport | Performance median (range) | Accessibility | Best Practices | SEO | FCP median | LCP median | CLS | TBT median |
| -------- | -------------------------: | ------------: | -------------: | --: | ---------: | ---------: | --: | ---------: |
| Desktop  |              100 (100–100) |           100 |             96 |  60 |     286 ms |     686 ms |   0 |      13 ms |
| Mobile   |                 89 (87–90) |           100 |             96 |  60 |   1,058 ms |   2,866 ms |   0 |     278 ms |

The original Lighthouse runs contacted the remote staging API during session refresh, so they are **not a valid controlled before-comparison** for these isolated runs. The current `/login` source renders an `h1` and form in the server response after the CSR bailout fix. Mobile LCP remains the most visible measured performance opportunity. SEO remains 60; the app layout explicitly sets `robots: { index: false, follow: false }`, so changing the SEO result would require a product decision about whether this private app should be indexed.

In the second final mobile run, Lighthouse attributed 84% (2,408 ms) of LCP to render delay, with 454 ms TTFB; its `unused-javascript` audit estimated 168 KiB of unused transfer bytes and 440 ms possible LCP savings. Those are Lighthouse lab estimates, not guaranteed gains; route-level bundle/trace inspection is needed before changing code.

Raw final Lighthouse runs: [`desktop 1`](./artifacts/lighthouse/login-desktop-final-1.json), [`desktop 2`](./artifacts/lighthouse/login-desktop-final-2.json), [`desktop 3`](./artifacts/lighthouse/login-desktop-final-3.json), [`mobile 1`](./artifacts/lighthouse/login-mobile-final-1.json), [`mobile 2`](./artifacts/lighthouse/login-mobile-final-2.json), [`mobile 3`](./artifacts/lighthouse/login-mobile-final-3.json).

### Dependency audit after snapshot

| Workspace | Production findings | Full-tree findings |
| --------- | ------------------- | ------------------ |
| Web       | 0                   | 2 high, 0 critical |
| API       | 0                   | 0                  |

The remaining web findings are development-tool transitive `extract-zip` findings under Lighthouse/Puppeteer; the saved registry audit reports no patched version for the affected package. They are not production dependency findings. Raw final audit outputs: [`web production`](../artifacts/dependency-audit/web-prod-final.json), [`web full tree`](../artifacts/dependency-audit/web-all-final.json), [`API production`](../artifacts/dependency-audit/api-prod-final.json), [`API full tree`](../artifacts/dependency-audit/api-all-final.json). Registry results are time-sensitive.

### Remaining improvement work

- Increase frontend coverage substantially, especially feature screens, RTK Query endpoint behavior, UI primitives, and route-level flows. Current line coverage is 14.38%.
- Improve mobile `/login` LCP and reduce its 278 ms median TBT; collect route-specific bundle and trace diagnostics before selecting code changes.
- Resolve the two web development-tree audit findings when the upstream dependency chain publishes a patched compatible release.
- Add broader accessibility coverage beyond the seven current routes, then run manual keyboard and screen-reader checks.
- Add controlled browser performance coverage for representative protected pages. Production telemetry metrics still require an instrumented deployment.
