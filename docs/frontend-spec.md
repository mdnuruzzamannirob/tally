# Frontend Specification

## Job Application Tracker

**Version:** 1.0
**Status:** Final for MVP
**Related Documents:**

- Product Requirements Document v1.1
- UI/UX Specification v1.1
  **Primary Stack:** Next.js, TypeScript, Redux Toolkit, RTK Query, Tailwind CSS, PWA

---

## 1. Purpose and Scope

This document defines the frontend architecture and implementation requirements for Job Application Tracker.

It covers:

- Frontend technology stack
- Application architecture
- Routing
- Authentication handling
- API integration using RTK Query
- State management
- Forms and validation
- UI component structure
- Theme implementation
- PWA behavior
- Offline behavior
- Accessibility
- Performance
- Testing
- Environment configuration

The frontend will be a responsive, installable Progressive Web App and will communicate with a separate Express TypeScript backend.

---

## 2. Technology Stack

| Concern               | Choice                                                            |
| --------------------- | ----------------------------------------------------------------- |
| Framework             | Next.js 16+ App Router                                            |
| Language              | TypeScript                                                        |
| Rendering strategy    | App Router with client-side interactivity for authenticated areas |
| Styling               | Tailwind CSS                                                      |
| UI primitives         | Customized shadcn/ui exposed only through `components/app-ui`     |
| State management      | Redux Toolkit                                                     |
| Server state          | RTK Query                                                         |
| Forms                 | React Hook Form                                                   |
| Validation            | Zod                                                               |
| Charts                | Recharts                                                          |
| Drag and drop         | dnd-kit, only if the Should Have board enhancement is delivered   |
| Date handling         | date-fns                                                          |
| Fonts                 | next/font                                                         |
| PWA                   | Manual web manifest and service worker                            |
| Unit testing          | Vitest                                                            |
| Component testing     | Testing Library                                                   |
| E2E testing           | Playwright                                                        |
| API mocking for tests | MSW                                                               |

---

## 3. Architectural Approach

The frontend should follow a clean, feature-based architecture.

### Core Principles

1. Use TypeScript strict mode.
2. Keep API logic centralized.
3. Keep UI components reusable and presentational where possible.
4. Keep feature-specific logic inside feature folders.
5. Use Redux Toolkit slices for client-side state.
6. Use RTK Query for all backend data fetching.
7. Use React Hook Form and Zod for form validation.
8. Use URL search params for shareable list filters where practical.
9. Avoid direct fetch calls inside components.
10. Keep authentication tokens out of localStorage.
11. Pages and features must import primitives only from `components/app-ui`,
    never directly from shadcn/ui.
12. Pin and consume the released OpenAPI 3.1 artifact; never import backend
    source types.

### Naming conventions

- React component files use PascalCase, for example `ApplicationTable.tsx`.
- Hooks and utilities use camelCase, for example `useOnlineStatus.ts`.
- Route segments and feature directories use kebab-case where they contain
  multiple words, for example `export-import` and `forgot-password`.
- Backend-facing endpoint modules use domain names such as
  `applications.api.ts`; feature files retain the same singular/plural domain
  terminology as their API resource.

---

## 4. Rendering Strategy

## 4.1 Server Components

Use React Server Components for:

- Static public pages
- Layout shells
- Metadata
- Static headers/footers
- Non-interactive fallback UI

## 4.2 Client Components

Use Client Components for:

- Authentication flows
- Forms
- Data tables
- Dashboard widgets
- Kanban board, when the Should Have enhancement is enabled
- Modals
- Toasts
- Settings interactions
- Theme switching
- RTK Query usage

---

## 5. Folder Structure

Recommended structure:

```txt
src/
├── app/
│   ├── (public)/
│   │   ├── login/  register/  forgot-password/  reset-password/  verify-email/
│   ├── (auth)/
│   │   └── auth/social/callback/
│   ├── (protected)/
│   │   ├── dashboard/
│   │   ├── applications/
│   │   │   └── [id]/
│   │   ├── interviews/
│   │   └── settings/
│   │       ├── profile/  password/  connected-accounts/  preferences/  data/
│   ├── offline/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   └── global-error.tsx
├── components/
│   ├── app-ui/                 # only app-facing customized shadcn primitives
│   │   ├── Button.tsx  Input.tsx  Select.tsx  Dialog.tsx  Sheet.tsx
│   │   ├── DropdownMenu.tsx  Tooltip.tsx  Tabs.tsx  Badge.tsx  Card.tsx
│   │   ├── Table.tsx  Skeleton.tsx  EmptyState.tsx  Spinner.tsx  Toast.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── AppShell.tsx  Sidebar.tsx  Header.tsx  MobileNav.tsx  OfflineBanner.tsx
│   ├── forms/
│   │   ├── FormField.tsx  DatePicker.tsx  TagSelect.tsx
│   ├── shared/
│   │   ├── ConfirmDialog.tsx  PageHeader.tsx  Pagination.tsx  ErrorState.tsx
│   └── providers/
├── features/
│   ├── auth/  dashboard/  applications/  tags/  notes/  interviews/  settings/
│   └── export-import/
│       └── { components/, hooks/, api/, types/, utils/ }  # as applicable per feature
├── store/
│   ├── api/
│   │   ├── base-api.ts
│   │   ├── auth.api.ts
│   │   ├── users.api.ts
│   │   ├── applications.api.ts
│   │   ├── tags.api.ts
│   │   ├── notes.api.ts
│   │   ├── interviews.api.ts
│   │   ├── dashboard.api.ts
│   │   └── export-import.api.ts
│   ├── index.ts
│   ├── hooks.ts
│   ├── slices/
│   │   ├── auth.slice.ts
│   │   ├── ui.slice.ts
│   │   └── preferences.slice.ts
├── hooks/
│   ├── useAuth.ts  useOnlineStatus.ts  useTheme.ts  useDebounce.ts
│   ├── useMediaQuery.ts  useTimezone.ts
├── lib/
│   ├── api-client.ts  auth.ts  format.ts  validators.ts
│   ├── utils.ts  date.ts  constants.ts
├── styles/
│   ├── globals.css  themes.css  animations.css
├── types/
│   ├── api.types.ts
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── application.types.ts
│   ├── interview.types.ts
│   ├── tag.types.ts
│   ├── note.types.ts
│   └── dashboard.types.ts
└── proxy.ts
public/
├── manifest.json
├── offline.html
├── sw.js
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## 6. Routing Specification

## 6.1 Public Routes

| Route                   | Purpose                               | Access |
| ----------------------- | ------------------------------------- | ------ |
| `/login`                | Email/password login and social login | Public |
| `/register`             | Registration                          | Public |
| `/forgot-password`      | Request password reset                | Public |
| `/reset-password`       | Reset password using token            | Public |
| `/verify-email`         | Verify email using token              | Public |
| `/auth/social/callback` | Restore OAuth session and redirect    | Public |
| `/offline`              | Offline fallback page                 | Public |

Not-found and server-error states use the App Router `not-found.tsx`,
`error.tsx`, and `global-error.tsx` conventions rather than literal `/404` or
`/500` routes.

---

## 6.2 Protected Routes

| Route                | Purpose                 | Access                      |
| -------------------- | ----------------------- | --------------------------- |
| `/dashboard`         | Main summary dashboard  | Authenticated verified user |
| `/applications`      | Applications list/board | Authenticated verified user |
| `/applications/[id]` | Application detail      | Authenticated verified user |
| `/interviews`        | Interview schedule      | Authenticated verified user |
| `/settings`          | Account settings        | Authenticated verified user |

---

## 6.3 Root Route Behavior

`/` should redirect based on auth state:

```txt
If authenticated and verified
  -> redirect to the saved default landing page

If authenticated but unverified
  -> redirect to /verify-email or pending verification screen

If unauthenticated
  -> redirect to /login
```

---

## 6.4 Route Guards

Implement reusable guards:

Because the access token exists only in browser memory, Next.js `proxy.ts`
cannot determine the authenticated state. Protected/PublicOnly guards run in
the client auth shell after bootstrap; the backend remains the security
boundary. Proxy may perform only token-independent routing work.

### Next.js 16 Proxy convention

- The single request-boundary file is `src/proxy.ts`, exporting a named
  `proxy` function. `middleware.ts` and an exported `middleware` function are
  deprecated in Next.js 16.
- Use a narrow `config.matcher` and keep the proxy to redirects, rewrites, or
  request/response header work. Prefer `next.config.ts` redirects for simple
  static redirects.
- Do not call the API to bootstrap a session, fetch user data, or enforce
  authorization in Proxy. The client bootstrap and API authorization remain
  the respective UX and security boundaries.
- Proxy uses Next.js's Node.js runtime and must not declare a `runtime`
  setting.

### PublicOnlyRoute

Used for:

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

Behavior:

```txt
If user is authenticated and verified
  -> redirect to the saved default landing page
```

---

### ProtectedRoute

Used for all protected pages.

Behavior:

```txt
If auth loading
  -> show loading state

If unauthenticated
  -> redirect to /login?redirect=/intended-path

If authenticated but unverified
  -> redirect to verification screen

If authenticated and verified
  -> render page
```

---

## 7. Authentication Specification

## 7.1 Authentication Model

The frontend will use:

- Short-lived access token stored only in memory
- HTTP-only refresh cookie managed by the browser
- Secure session restoration on app load

The access token must not be stored in localStorage or sessionStorage.

---

## 7.2 Auth States

```ts
type AuthStatus =
  | "loading"
  | "unauthenticated"
  | "authenticated_unverified"
  | "authenticated_verified";
```

---

## 7.3 Auth Bootstrap Flow

On application load:

```txt
App loads
  -> If no in-memory access token exists, call /auth/refresh
  -> If refresh succeeds (or a token already exists), call /auth/me with Bearer token
  -> If success:
      store user in Redux
      store access token in memory
      set authenticated state
  -> If failure:
      set unauthenticated state
```

---

## 7.4 Login Flow

```txt
User submits email/password
  -> Call login mutation
  -> Backend returns access token and user
  -> Store access token in memory
  -> Store user in Redux
  -> Redirect to intended protected route when present
  -> Otherwise redirect to the user's default landing page
```

---

## 7.5 Social Login Flow

Social login will be initiated via backend endpoints.

Example buttons:

```txt
Continue with Google
Continue with GitHub
```

Behavior:

```txt
User clicks provider button
  -> Browser navigates to backend OAuth endpoint
  -> Backend handles provider OAuth
  -> Backend redirects back to frontend
  -> Social callback calls refresh, then me
  -> Frontend redirects to intended route or default landing page
```

Recommended backend OAuth initiation endpoints:

```txt
GET {API_URL}/auth/google
GET {API_URL}/auth/github
```

Provider linking from Settings is not a login start. The frontend first calls
the authenticated provider-link mutation, receives an `authorizationUrl`, and
then navigates to it. The callback completes the user-bound link transaction
and returns to Settings.

---

## 7.6 Email Verification Flow

Verification email link format:

```txt
{WEB_APP_URL}/verify-email?token=abc123
```

Frontend behavior:

```txt
Extract token from URL
  -> Read token once and replace browser history with /verify-email
  -> Call verifyEmail mutation
  -> Show success state if valid
  -> Show expired/invalid state if invalid
  -> On success, direct the user to sign in; verification does not create a session
  -> On failure, provide resend verification email action
```

---

## 7.7 Forgot Password Flow

```txt
User submits email
  -> Call forgotPassword mutation
  -> Always show neutral success message
```

---

## 7.8 Reset Password Flow

Reset email link format:

```txt
{WEB_APP_URL}/reset-password?token=abc123
```

Frontend behavior:

```txt
Extract token from URL
  -> Read token once and replace browser history with /reset-password
  -> User enters new password and confirmation
  -> Call resetPassword mutation
  -> Redirect to login on success
```

Verification/reset pages set a `no-referrer` policy and never send the action
token to analytics, logs, or third-party resources.

---

## 7.9 Change Password Flow

Available in Settings.

```txt
User enters current password if password exists
  -> User enters new password and confirmation
  -> Call changePassword mutation
  -> Show success toast
```

---

## 7.10 Set Password Flow for OAuth-only Users

Available in Settings.

```txt
OAuth-only user enters new password and confirmation
  -> Call setPassword mutation
  -> Show success toast
```

---

## 7.11 Logout Flow

```txt
User clicks logout
  -> Call logout mutation
  -> Clear access token from memory
  -> Clear auth Redux state
  -> Redirect to login
```

---

## 8. API Integration Specification

All backend communication must use RTK Query.

Do not use direct `fetch` or `axios` calls inside UI components.

The API base layer normalizes the approved envelope:

```ts
type ApiSuccess<T> = { success: true; message: string; data: T; meta?: ApiMeta };
type ApiFailure = {
  success: false;
  message: string;
  error: { code: string; details?: Record<string, string[]> };
  meta: { requestId: string };
};
```

`data` is generic and direct: endpoint types use `Resource` for one resource
and `Resource[]` for a collection. Collection endpoints must not invent a
`{ items: Resource[] }` wrapper; pagination/count information is read from
top-level `meta`.

The pinned OpenAPI artifact is served by the API at `/api/v1/openapi.json`; its
interactive Swagger UI is at `/api/v1/docs`. It is used for compatibility and
client-type validation, while RTK Query remains the only browser API client.

---

## 8.1 Base API

```ts
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Application",
    "Applications",
    "Tag",
    "Tags",
    "Note",
    "Notes",
    "Interview",
    "Interviews",
    "StatusHistory",
    "Dashboard",
  ],
  endpoints: () => ({}),
});
```

---

## 8.2 Base Query Requirements

Base query must:

- Use `NEXT_PUBLIC_API_URL`
- Include credentials:

```ts
credentials: "include";
```

- Attach access token header when available:

```txt
Authorization: Bearer <access_token>
```

- Handle 401 responses by attempting refresh
- Use a mutex or lock to prevent multiple simultaneous refresh calls
- Retry the original request after successful refresh
- Redirect to login if refresh fails

---

## 8.3 Recommended Reauthentication Behavior

```txt
Request fails with 401
  -> If refresh already running, wait for it
  -> If not running, call /auth/refresh
  -> If refresh succeeds:
      store new access token
      retry original request
  -> If refresh fails:
      clear auth state
      redirect to login
```

---

## 8.4 Auth Endpoints

| Hook/Mutation                   | Method | Endpoint                                  | Purpose                          |
| ------------------------------- | ------ | ----------------------------------------- | -------------------------------- |
| `useRegisterMutation`           | POST   | `/auth/register`                          | Register                         |
| `useLoginMutation`              | POST   | `/auth/login`                             | Login                            |
| `useLogoutMutation`             | POST   | `/auth/logout`                            | Logout                           |
| `useRefreshMutation`            | POST   | `/auth/refresh`                           | Refresh access token             |
| `useGetMeQuery`                 | GET    | `/auth/me`                                | Get current user                 |
| `useVerifyEmailMutation`        | POST   | `/auth/verify-email`                      | Verify email                     |
| `useResendVerificationMutation` | POST   | `/auth/resend-verification`               | Resend verification email        |
| `useForgotPasswordMutation`     | POST   | `/auth/forgot-password`                   | Request reset email              |
| `useResetPasswordMutation`      | POST   | `/auth/reset-password`                    | Reset password                   |
| `useChangePasswordMutation`     | PATCH  | `/auth/change-password`                   | Change password                  |
| `useSetPasswordMutation`        | POST   | `/auth/set-password`                      | Set password for OAuth-only user |
| `useGetConnectedAccountsQuery`  | GET    | `/auth/connected-accounts`                | List providers                   |
| `useLinkProviderMutation`       | POST   | `/auth/connected-accounts/:provider/link` | Start provider link              |
| `useUnlinkProviderMutation`     | DELETE | `/auth/connected-accounts/:provider`      | Unlink provider                  |

---

## 8.5 Application Endpoints

| Hook/Mutation                        | Method | Endpoint                      | Purpose           |
| ------------------------------------ | ------ | ----------------------------- | ----------------- |
| `useGetApplicationsQuery`            | GET    | `/applications`               | List applications |
| `useGetApplicationQuery`             | GET    | `/applications/:id`           | Get application   |
| `useCreateApplicationMutation`       | POST   | `/applications`               | Create            |
| `useUpdateApplicationMutation`       | PATCH  | `/applications/:id`           | Update            |
| `useDeleteApplicationMutation`       | DELETE | `/applications/:id`           | Delete            |
| `useArchiveApplicationMutation`      | POST   | `/applications/:id/archive`   | Archive           |
| `useUnarchiveApplicationMutation`    | POST   | `/applications/:id/unarchive` | Unarchive         |
| `useChangeApplicationStatusMutation` | POST   | `/applications/:id/status`    | Change status     |
| `useGetStatusHistoryQuery`           | GET    | `/applications/:id/history`   | Status history    |

---

## 8.6 Tag Endpoints

| Hook/Mutation                     | Method | Endpoint                        | Purpose    |
| --------------------------------- | ------ | ------------------------------- | ---------- |
| `useGetTagsQuery`                 | GET    | `/tags`                         | List tags  |
| `useCreateTagMutation`            | POST   | `/tags`                         | Create tag |
| `useUpdateTagMutation`            | PATCH  | `/tags/:id`                     | Update tag |
| `useDeleteTagMutation`            | DELETE | `/tags/:id`                     | Delete tag |
| `useAddApplicationTagsMutation`   | POST   | `/applications/:id/tags`        | Add tags   |
| `useRemoveApplicationTagMutation` | DELETE | `/applications/:id/tags/:tagId` | Remove tag |

---

## 8.7 Note Endpoints

| Hook/Mutation                 | Method | Endpoint                  | Purpose     |
| ----------------------------- | ------ | ------------------------- | ----------- |
| `useGetApplicationNotesQuery` | GET    | `/applications/:id/notes` | List notes  |
| `useCreateNoteMutation`       | POST   | `/applications/:id/notes` | Create note |
| `useUpdateNoteMutation`       | PATCH  | `/notes/:id`              | Update note |
| `useDeleteNoteMutation`       | DELETE | `/notes/:id`              | Delete note |

---

## 8.8 Interview Endpoints

| Hook/Mutation                      | Method | Endpoint                       | Purpose                     |
| ---------------------------------- | ------ | ------------------------------ | --------------------------- |
| `useGetInterviewsQuery`            | GET    | `/interviews`                  | List interviews             |
| `useGetApplicationInterviewsQuery` | GET    | `/applications/:id/interviews` | List application interviews |
| `useCreateInterviewMutation`       | POST   | `/applications/:id/interviews` | Create interview            |
| `useUpdateInterviewMutation`       | PATCH  | `/interviews/:id`              | Update interview            |
| `useDeleteInterviewMutation`       | DELETE | `/interviews/:id`              | Delete interview            |

---

## 8.9 Dashboard and Settings Endpoints

| Hook/Mutation                  | Method | Endpoint                | Purpose             |
| ------------------------------ | ------ | ----------------------- | ------------------- |
| `useGetDashboardSummaryQuery`  | GET    | `/dashboard/summary`    | Dashboard stats     |
| `useUpdateProfileMutation`     | PATCH  | `/users/me/profile`     | Update name/profile |
| `useUpdatePreferencesMutation` | PATCH  | `/users/me/preferences` | Update preferences  |
| `useExportJsonQuery`           | GET    | `/export/json`          | Export JSON         |
| `useExportCsvQuery`            | GET    | `/export/csv`           | Export CSV          |
| `useImportJsonMutation`        | POST   | `/import/json`          | Import JSON         |

Export endpoints are file-download exceptions: configure RTK Query
`responseHandler` for Blob/text responses, preserve the server filename when
provided, and revoke temporary object URLs after download. Do not try to parse
CSV or the raw backup document as the normal `{ success, data }` envelope.

---

## 8.10 Cache Invalidation Rules

### Applications

Invalidate `Applications`, `Dashboard` after:

- create application
- update application
- delete application
- archive/unarchive
- status change

Creating an application with `initialNote` also invalidates `Notes` for the
new application.

Invalidate `Application` after:

- update application
- status change

Invalidate `StatusHistory` after:

- status change

---

### Notes

Invalidate `Notes` after:

- create note
- update note
- delete note

---

### Tags

Invalidate `Tags` after:

- create tag
- update tag
- delete tag

Invalidate `Application` and `Applications` after:

- add tag to application
- remove tag from application

---

### Interviews

Invalidate `Interviews` and `Dashboard` after:

- create interview
- update interview
- delete interview

### User and Settings

Invalidate `User` after profile or preference updates and after linking or
unlinking an OAuth provider.

---

## 9. State Management Specification

## 9.1 Redux Store

Store slices:

```txt
api
auth
ui
```

Example:

```ts
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
```

---

## 9.2 Auth Slice

Responsibilities:

- Current user
- Auth status
- Access token in memory only
- Login/logout state updates

Example shape:

```ts
interface AuthState {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null;
}
```

The auth slice must not be persisted.

---

## 9.3 UI Slice

Responsibilities:

- Sidebar open/close
- Active modal state, if global
- Theme preference, if not handled by separate theme provider
- Offline banner visibility, if needed

---

## 9.4 Typed Hooks

```ts
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

---

## 10. Forms and Validation

## 10.1 Form Library

Use:

- React Hook Form
- Zod
- `@hookform/resolvers/zod`

---

## 10.2 Forms Required

### Auth Forms

- Login
- Register
- Forgot password
- Reset password
- Change password
- Set password

---

### Application Forms

- Create application
- Edit application
- Status change note, optional

---

### Related Entity Forms

- Add/edit note
- Add/edit interview
- Add/create tag

---

### Settings Forms

- Profile update
- Preferences update
- Tag create/edit/delete management
- Import confirmation

---

## 10.3 Validation Rules

Validation should mirror backend rules.

Use Zod schemas from shared types where possible.

### Example Application Schema

```ts
const applicationSchema = z
  .object({
    company: z.string().trim().min(1).max(100),
    role: z.string().trim().min(1).max(100),
    jobUrl: z.string().url().optional().or(z.literal("")),
    location: z.string().max(120).optional(),
    remoteType: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),
    employmentType: z.enum(["FULL_TIME", "CONTRACT", "INTERNSHIP"]).optional(),
    source: z.string().max(100).optional(),
    status: z
      .enum([
        "WISHLIST",
        "APPLIED",
        "SCREENING",
        "INTERVIEW",
        "OFFER",
        "REJECTED",
        "WITHDRAWN",
      ])
      .default("WISHLIST"),
    appliedAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    salaryMin: z.number().min(0).optional(),
    salaryMax: z.number().min(0).optional(),
    currency: z
      .string()
      .regex(/^[A-Z]{3}$/)
      .optional(),
    nextFollowUpAt: z.coerce.date().optional(),
    initialNote: z.string().trim().min(1).max(5000).optional(),
  })
  .refine(
    (value) =>
      value.salaryMin === undefined ||
      value.salaryMax === undefined ||
      value.salaryMax >= value.salaryMin,
    {
      path: ["salaryMax"],
      message: "Maximum salary must be at least the minimum.",
    },
  )
  .refine(
    (value) =>
      (value.salaryMin === undefined && value.salaryMax === undefined) ||
      value.currency !== undefined,
    {
      path: ["currency"],
      message: "Currency is required when a salary is provided.",
    },
  );
```

Auth schemas must enforce the same 8-character minimum and 72 UTF-8-byte
maximum as the backend. The preference form must submit a valid IANA `timeZone`.
URL schemas must additionally restrict the parsed protocol to `http:` or
`https:`; a generic URL-format check alone is insufficient.
The edit-application payload omits `status`; all existing-record status changes
use the dedicated status mutation so history cannot be bypassed. It may include
the complete `tagIds` selection, which the backend replaces atomically with the
field update.

---

## 10.4 Form UX Requirements

- Show inline errors below fields
- Validate on blur and submit
- Disable submit button while loading
- Show success toast after successful mutation
- Map backend field errors to form fields
- Prevent duplicate submission
- Use accessible labels and descriptions

---

## 11. UI Component Architecture

## 11.1 UI Primitives

All primitives live in `components/app-ui`. They are the application-owned,
customized wrappers around shadcn/ui; no page, layout, or feature may import
shadcn/ui directly.

Create reusable components:

- Button
- Input
- Textarea
- Select
- MultiSelect
- TagInput
- DatePicker
- Checkbox
- Switch
- Badge
- Card
- StatCard
- Modal
- Dialog
- Toast
- Tooltip
- Skeleton
- EmptyState
- ErrorBanner
- OfflineBanner
- Pagination
- Tabs
- Table
- List
- Avatar
- DropdownMenu

---

## 11.2 Feature Components

Feature-specific components should live inside feature folders.

Examples:

```txt
features/applications/
  components/
    ApplicationTable.tsx
    ApplicationCard.tsx
    ApplicationFilters.tsx
    ApplicationForm.tsx
    ApplicationDetailHeader.tsx
    ApplicationStatusBadge.tsx
    ApplicationStatusMenu.tsx
    ApplicationBoard.tsx  # optional Should Have enhancement
```

---

## 11.3 Design Token Implementation

The UI must follow UI/UX Specification v1.1.

Primary color:

```css
#6366f1
```

Radius:

```css
Buttons/inputs: 6px
Cards/modals: 8px
Badges/tags: 4px
```

Shadow:

```css
default: none Use borders for separation;
```

Tailwind configuration should define these tokens.

---

## 12. Theme Specification

## 12.1 Supported Themes

- Light
- Dark
- System

---

## 12.2 Theme Persistence

The authenticated user's backend preference is authoritative. Mirror it to
localStorage only as an early-render cache:

```txt
tally.theme
```

Possible values:

```txt
light
dark
system
```

---

## 12.3 Theme Behavior

- Apply `dark` class to `<html>` when dark theme is active.
- Respect system preference when theme is `system`.
- Avoid layout shift during theme initialization.
- Use CSS variables for semantic tokens.
- After auth bootstrap, replace any stale local value with the server value.
- When the user changes theme, update the server and local cache together; if
  the server mutation fails, restore the prior theme and show an error.

---

## 13. PWA Specification

## 13.1 Manifest Requirements

Manifest should include:

```json
{
  "name": "Job Application Tracker",
  "short_name": "Tally",
  "description": "Track your job applications, interviews, and follow-ups",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f8fafc",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

---

## 13.2 Service Worker Requirements

The service worker must:

- Precache static app shell
- Cache static assets
- Provide offline fallback page
- Avoid caching authenticated API responses
- Support update detection
- Clean old caches

---

## 13.3 Offline Fallback

Route:

```txt
/offline
```

Message:

```text
You’re offline. Some features may be unavailable.
```

---

## 13.4 Install Prompt

Implement a custom install prompt when `beforeinstallprompt` is available.

Show prompt in:

- Dashboard
- Settings

Do not show intrusive prompt immediately on first visit.

---

## 13.5 Update Available Toast

When a new service worker is waiting:

```text
A new version is available.
```

Action:

```text
Reload
```

---

## 14. Offline Behavior

## 14.1 Network Detection

Implement:

```ts
useOnlineStatus();
```

Returns:

```ts
boolean;
```

---

## 14.2 Offline Banner

Show global banner when offline:

```text
You’re offline. Previously opened data may remain visible; changes are disabled.
```

---

## 14.3 Mutation Behavior While Offline

For MVP:

- Disable or warn on mutations while offline.
- Show warning toast if user attempts create/update/delete while offline.
- Do not silently lose user input.

Example warning:

```text
You’re offline. Please reconnect to save changes.
```

---

## 14.4 Data Availability

For MVP:

- Static app shell should work offline.
- Authenticated data should not be persisted by service worker.
- In-memory RTK Query cache may provide data during the current session.
- Full offline data persistence is not required for MVP.

---

## 15. URL State and Filtering

## 15.1 Application List URL Params

Use URL search params for:

```txt
search
status
tag
remoteType
employmentType
source
followUp
appliedFrom
appliedTo
includeArchived
sort
order
page
pageSize
```

Example:

```txt
/applications?status=APPLIED&followUp=overdue&page=1
```

---

## 15.2 Benefits

- Shareable filtered views
- Back button works correctly
- Filter state survives refresh

---

## 15.3 Debouncing

Search input should debounce:

```txt
300ms
```

---

## 16. Performance Requirements

## 16.1 Code Splitting

Use route-level code splitting naturally through Next.js.

Additionally, dynamically import heavy libraries:

- Recharts
- dnd-kit
- Rich date pickers, if large

Example:

```ts
const StatusChart = dynamic(() => import("./StatusChart"), {
  ssr: false,
});
```

---

## 16.2 Data Fetching

- Use RTK Query caching.
- Avoid duplicate requests.
- Use pagination for application lists.
- Use skeleton loaders for perceived performance.

---

## 16.3 Fonts

Use `next/font` for font optimization.

---

## 16.4 Images and Icons

- Use SVG icons.
- Optimize PWA icons.
- Avoid unnecessary large images.

---

## 16.5 Performance Targets

Target:

- Lighthouse Performance: 90+
- Lighthouse Accessibility: 90+
- Lighthouse Best Practices: 90+
- Lighthouse SEO: 90+
- No major console errors
- Smooth interaction on mid-range mobile devices

---

## 17. Accessibility Requirements

Frontend must follow WCAG 2.1 AA target.

Required:

- Semantic HTML
- Skip-to-content link
- Keyboard navigation
- Visible focus states
- Focus trap in modals
- Escape closes modals
- Form labels
- Inline error association
- Accessible toast announcements
- Accessible drag-and-drop alternative
- Color contrast compliance
- Reduced motion support

---

## 18. Testing Specification

## 18.1 Unit Tests

Test:

- Auth utilities
- Base query reauthentication logic
- Date formatting helpers
- URL param helpers
- Validation schemas
- Permission/guard helpers

---

## 18.2 Component Tests

Test:

- LoginForm
- RegisterForm
- ApplicationForm
- FilterBar
- StatusBadge
- TagInput
- EmptyState
- Modal
- Toast
- OfflineBanner

---

## 18.3 Integration Tests

Use MSW to mock backend.

Test:

- Login success
- Login failure
- Protected route redirect
- Create application
- Update application
- Delete application
- Status change
- Notes CRUD
- Interviews CRUD

---

## 18.4 E2E Tests

Critical Playwright flows:

1. Register and verify email
2. Login
3. Create application
4. Edit application
5. Change status
6. Add note
7. Add interview
8. Search/filter applications
9. Logout
10. Forgot password request

---

## 19. Environment Configuration

## 19.1 Required Public Variables

```txt
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_APP_URL
```

Example:

```txt
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 19.2 Rules

- No secrets in frontend environment variables.
- No database credentials in frontend.
- No OAuth client secrets in frontend.
- API URL must be configurable per environment.

---

## 20. Error Handling

## 20.1 API Errors

RTK Query errors should be normalized.

Expected backend error shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "field": ["Error message"]
    }
  },
  "meta": {
    "requestId": "request_id"
  }
}
```

`details` is optional. When `code` is `VALIDATION_ERROR`, map the documented
field-to-messages object to the corresponding form controls.

Frontend should handle:

- 400 validation errors
- 401 unauthorized
- 403 forbidden
- 404 not found
- 409 conflict
- 429 rate limit
- 500 server error

---

## 20.2 User-facing Errors

- Validation errors appear inline.
- Mutation errors appear as toast or banner.
- Auth errors redirect appropriately.
- Unknown errors show generic safe message.

Example:

```text
Something went wrong. Please try again.
```

---

## 21. Loading States

Use:

- Button spinners for mutations
- Skeletons for queries
- Page-level skeletons for dashboard/lists
- Disabled inputs while submitting

Avoid:

- Full-screen spinners for normal page loads
- Layout shift when data arrives

---

## 22. Empty States

Every data list must have an empty state.

Examples:

- Applications empty: “Add your first application”
- Search empty: “No applications match your filters”
- Interviews empty: “No interviews scheduled”
- Follow-ups empty: “You’re all caught up”

---

## 23. Build and Runtime Requirements

## 23.1 Scripts

Recommended scripts:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:e2e": "playwright test"
}
```

---

## 23.2 Node Version

Use Node LTS.

Example:

```txt
Node 20.9+ (use a currently supported LTS release)
```

---

## 23.3 Build Output

Production build must:

- Compile TypeScript without errors
- Pass linting
- Pass tests
- Generate PWA assets
- Be deployable to Vercel

---

## 24. Frontend Acceptance Criteria

The frontend is complete when:

- Next.js app runs with TypeScript strict mode.
- All public and protected routes exist.
- Route guards work correctly.
- Login, register, verification, forgot/reset password flows work.
- Social login redirects work.
- RTK Query connects to backend API.
- Access token is stored only in memory.
- Refresh flow works on 401.
- Application CRUD works.
- Search/filter/sort works.
- List and detail status changes work; if the Should Have board is shipped, its
  accessible status menu works and drag-and-drop is progressively enhanced.
- Notes, tags, and interviews work.
- Dashboard widgets render correctly.
- Settings pages work.
- Theme switching works.
- PWA manifest and service worker work.
- Offline banner and offline fallback work.
- Forms validate correctly.
- Loading, empty, error, success, and offline states are handled.
- Accessibility requirements are met.
- Unit and component tests pass; critical release-candidate E2E flows pass.
- Production build succeeds.
