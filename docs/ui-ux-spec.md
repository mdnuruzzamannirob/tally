# UI/UX Specification

## Job Application Tracker

**Version:** 1.1
**Status:** Final for MVP
**Replaces:** Version 1.0
**Related Document:** Product Requirements Document v1.1
**Applies To:** Next.js frontend, TypeScript, installable PWA

---

## Change Log

| Version | Change                                                                                                                  |
| ------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1.0     | Initial UI/UX specification                                                                                             |
| 1.1     | Updated primary color to `#6366f1`, removed heavy shadows, reduced border radius, introduced flat bordered visual style |

---

# 1. Purpose and Scope

This document defines the user experience and interface design requirements for Job Application Tracker.

It covers:

- Design principles
- Visual language
- Color system
- Typography
- Layout and navigation
- Screen behavior
- Components
- Form UX
- States and feedback
- Accessibility
- PWA UX
- Motion and keyboard behavior

This specification is intended to guide frontend implementation and design review.

---

# 2. Design Principles

1. **Flat and structured**
   The interface should use borders and surface contrast instead of shadows.

2. **Low radius**
   Components should use compact border radius, avoiding overly rounded shapes.

3. **Clear hierarchy**
   Use spacing, typography, and color intentionally.

4. **Low-friction workflows**
   Core actions should require minimal steps.

5. **Consistency**
   Similar actions should look and behave the same across all screens.

6. **Responsive and installable**
   The app must work well on mobile, tablet, desktop, and as a PWA.

7. **Trustworthy feedback**
   Every action should provide clear feedback.

8. **Accessible by default**
   Accessibility is a requirement, not an enhancement.

---

# 3. Visual Language

## 3.1 Brand Tone

The product should feel:

- Professional
- Clean
- Structured
- Calm
- Reliable

Avoid:

- Playful shapes
- Heavy shadows
- Large rounded corners
- Gradients
- Glassmorphism
- Overly decorative UI

Prefer:

- Flat surfaces
- Thin borders
- Compact radius
- Strong spacing rhythm
- Indigo primary color used intentionally

---

## 3.2 Primary Color

Primary color:

```css
#6366f1
```

This is the main brand and action color.

### Primary Scale

| Token          | Value                      | Usage                                 |
| -------------- | -------------------------- | ------------------------------------- |
| primary        | `#6366f1`                  | Primary buttons, links, active states |
| primary-hover  | `#4f46e5`                  | Hover state                           |
| primary-active | `#4338ca`                  | Active/pressed state                  |
| primary-subtle | `#eef2ff`                  | Selected backgrounds                  |
| primary-border | `#c7d2fe`                  | Selected borders                      |
| primary-text   | `#4338ca`                  | Text on subtle primary background     |
| primary-ring   | `rgba(99, 102, 241, 0.25)` | Focus ring                            |

### Dark Theme Primary Adjustments

| Token          | Value                       | Usage                   |
| -------------- | --------------------------- | ----------------------- |
| primary        | `#6366f1`                   | Primary buttons         |
| primary-hover  | `#818cf8`                   | Hover accent            |
| primary-text   | `#c7d2fe`                   | Links/text in dark mode |
| primary-subtle | `rgba(99, 102, 241, 0.14)`  | Selected backgrounds    |
| primary-border | `rgba(129, 140, 248, 0.35)` | Selected borders        |

---

## 3.3 Typography

Recommended font:

- Inter, with system font fallback

### Type Scale

| Token     | Size | Usage                       |
| --------- | ---- | --------------------------- |
| text-xs   | 12px | Captions, metadata, badges  |
| text-sm   | 14px | Secondary text, table cells |
| text-base | 16px | Body text, form inputs      |
| text-lg   | 18px | Card titles                 |
| text-xl   | 20px | Section headings            |
| text-2xl  | 24px | Page titles                 |
| text-3xl  | 30px | Dashboard numbers           |

### Typography Rules

- Body text should not be smaller than 14px in content areas.
- Page titles should use semibold or bold weight.
- Metadata should use muted color.
- Avoid using too many font weights.
- Maintain comfortable line height for scanning lists.

---

## 3.4 Light Theme Color System

| Token          | Value     | Usage                                |
| -------------- | --------- | ------------------------------------ |
| background     | `#f8fafc` | Page background                      |
| surface        | `#ffffff` | Cards, modals, inputs                |
| surface-muted  | `#f8fafc` | Hover rows, subtle panels            |
| border         | `#e2e8f0` | Default borders                      |
| border-strong  | `#cbd5e1` | Strong borders                       |
| text-primary   | `#0f172a` | Main text                            |
| text-secondary | `#64748b` | Muted text                           |
| text-disabled  | `#94a3b8` | Disabled text                        |
| primary        | `#6366f1` | Primary actions                      |
| success        | `#16a34a` | Positive states                      |
| warning        | `#d97706` | Warnings, due today                  |
| danger         | `#dc2626` | Errors, overdue, destructive actions |
| info           | `#0891b2` | Informational states                 |

---

## 3.5 Dark Theme Color System

| Token          | Value     | Usage                     |
| -------------- | --------- | ------------------------- |
| background     | `#0b1220` | Page background           |
| surface        | `#111827` | Cards, modals, inputs     |
| surface-muted  | `#1f2937` | Hover rows, subtle panels |
| border         | `#1f2937` | Default borders           |
| border-strong  | `#374151` | Strong borders            |
| text-primary   | `#f8fafc` | Main text                 |
| text-secondary | `#94a3b8` | Muted text                |
| text-disabled  | `#64748b` | Disabled text             |
| primary        | `#6366f1` | Primary buttons           |
| primary-text   | `#c7d2fe` | Links/text                |
| success        | `#22c55e` | Positive states           |
| warning        | `#f59e0b` | Warnings                  |
| danger         | `#ef4444` | Errors                    |
| info           | `#38bdf8` | Informational states      |

---

## 3.6 Application Status Colors

Status badges should use subtle backgrounds, colored text, and thin borders.

### Light Theme Status Badges

| Status    | Background | Text      | Border    |
| --------- | ---------- | --------- | --------- |
| Wishlist  | `#f1f5f9`  | `#475569` | `#e2e8f0` |
| Applied   | `#eef2ff`  | `#4338ca` | `#c7d2fe` |
| Screening | `#ecfeff`  | `#0e7490` | `#a5f3fc` |
| Interview | `#f5f3ff`  | `#6d28d9` | `#ddd6fe` |
| Offer     | `#f0fdf4`  | `#15803d` | `#bbf7d0` |
| Rejected  | `#fef2f2`  | `#b91c1c` | `#fecaca` |
| Withdrawn | `#f9fafb`  | `#6b7280` | `#e5e7eb` |

### Dark Theme Status Badges

| Status    | Background                  | Text      | Border                      |
| --------- | --------------------------- | --------- | --------------------------- |
| Wishlist  | `rgba(148, 163, 184, 0.12)` | `#cbd5e1` | `rgba(148, 163, 184, 0.25)` |
| Applied   | `rgba(99, 102, 241, 0.16)`  | `#c7d2fe` | `rgba(129, 140, 248, 0.35)` |
| Screening | `rgba(34, 211, 238, 0.12)`  | `#a5f3fc` | `rgba(34, 211, 238, 0.25)`  |
| Interview | `rgba(167, 139, 250, 0.14)` | `#ddd6fe` | `rgba(167, 139, 250, 0.30)` |
| Offer     | `rgba(34, 197, 94, 0.14)`   | `#bbf7d0` | `rgba(34, 197, 94, 0.30)`   |
| Rejected  | `rgba(239, 68, 68, 0.14)`   | `#fecaca` | `rgba(239, 68, 68, 0.30)`   |
| Withdrawn | `rgba(156, 163, 175, 0.12)` | `#e5e7eb` | `rgba(156, 163, 175, 0.25)` |

---

## 3.7 Interview Status Colors

| Status    | Light Text | Dark Text | Badge Style        |
| --------- | ---------- | --------- | ------------------ |
| Scheduled | `#1d4ed8`  | `#bfdbfe` | Blue subtle badge  |
| Completed | `#15803d`  | `#bbf7d0` | Green subtle badge |
| Cancelled | `#6b7280`  | `#e5e7eb` | Gray subtle badge  |
| No-show   | `#b91c1c`  | `#fecaca` | Red subtle badge   |

---

## 3.8 Spacing System

Use a 4px base spacing system.

Common spacing values:

```txt
4px
8px
12px
16px
24px
32px
48px
```

Spacing should create hierarchy instead of shadows.

---

## 3.9 Border Radius Rules

Avoid large rounded corners.

| Token       | Value    | Usage                                  |
| ----------- | -------- | -------------------------------------- |
| radius-xs   | `2px`    | Very small controls                    |
| radius-sm   | `4px`    | Badges, tags, checkboxes               |
| radius-md   | `6px`    | Buttons, inputs, selects, tabs         |
| radius-lg   | `8px`    | Cards, modals, dialogs                 |
| radius-full | `9999px` | Only avatars and optional switch knobs |

### Do Not Use

Avoid:

```css
border-radius: 12px;
border-radius: 16px;
border-radius: 24px;
```

for core UI components.

---

## 3.10 Shadow Rules

Use shadows only when absolutely necessary.

Preferred elevation method:

```txt
Border + surface color contrast
```

Not:

```txt
Heavy shadows
```

### Shadow Tokens

| Token          | Value                                | Usage                                |
| -------------- | ------------------------------------ | ------------------------------------ |
| shadow-none    | `none`                               | Default for buttons, inputs, cards   |
| shadow-popover | `0 8px 24px rgba(15, 23, 42, 0.08)`  | Optional for dropdowns/popovers only |
| shadow-modal   | `0 12px 32px rgba(15, 23, 42, 0.12)` | Optional for modals only             |

### Preferred Modal Style

Use:

```css
border: 1px solid var(--border);
background: var(--surface);
```

Instead of relying on shadow.

Use overlay:

```css
background: rgba(15, 23, 42, 0.45);
```

---

## 3.11 Iconography

- Use a consistent icon set, e.g. Lucide icons.
- Icons must be paired with text labels in primary navigation.
- Icon-only buttons must include tooltips and accessible labels.
- Icon sizes: 16px, 20px, 24px depending on context.
- Icons should inherit text color unless semantically required.

---

# 4. Layout and Navigation

## 4.1 Application Shell

The authenticated app uses a consistent shell.

### Desktop (≥1024px)

- Left sidebar navigation, 240px wide.
- Top bar with global search, theme toggle, “Add Application” button, and user menu.
- Main content area.

### Tablet (768–1023px)

- Collapsed icon sidebar or hamburger slide-over navigation.
- Top bar remains visible.

### Mobile (<768px)

- Top bar with menu, theme toggle, and add action.
- Bottom navigation with 4 items:
  - Dashboard
  - Applications
  - Interviews
  - Settings

---

## 4.2 Navigation Items

Primary navigation:

1. Dashboard
2. Applications
3. Interviews
4. Settings

Secondary actions:

- Logout, from user menu
- Theme toggle, from top bar
- Add Application, global action

Global search is an application search shortcut, not a separate search system.
Submitting it navigates to `/applications?search=<term>` and uses the canonical
company/role/location/tag/note search scope.

---

## 4.3 Page Structure

Each protected page should follow a consistent structure:

```text
Page title
Page description (optional)
Primary action button (right-aligned)
Content area
```

---

## 4.4 Desktop Shell Reference

```text
+--------------------------------------------------------------+
| [Logo]        [Search]              [Theme] [Add] [Avatar]   |
+------------+-------------------------------------------------+
| Dashboard  |                                                 |
| Applications|                 Main Content                  |
| Interviews |                                                 |
| Settings   |                                                 |
+------------+-------------------------------------------------+
```

---

## 4.5 Mobile Shell Reference

```text
+----------------------+
| [Menu] [Logo] [Add]  |
+----------------------+
|                      |
|      Content         |
|                      |
+----------------------+
| Dash | Apps | Int | Set |
+----------------------+
```

---

# 5. Responsive Breakpoints

| Name          | Range       | Behavior                        |
| ------------- | ----------- | ------------------------------- |
| Mobile        | < 640px     | Single column, bottom nav       |
| Small         | 640–767px   | Single column, wider cards      |
| Tablet        | 768–1023px  | Two-column layouts where useful |
| Desktop       | 1024–1279px | Sidebar visible, tables visible |
| Large desktop | ≥1280px     | Wider content max-width         |

Content max width:

```css
1280px
```

Centered horizontally.

---

# 6. Public Screens

## 6.1 Login

### Purpose

Allow verified users to access their account.

### Layout

Centered authentication card on neutral background.

### Elements

- App logo
- Page title: “Sign in”
- Email input
- Password input with show/hide toggle
- Submit button: “Sign in”
- “Forgot password?” link
- Divider: “or continue with”
- Google button
- GitHub button
- “Don’t have an account? Sign up” link

### Visual Rules

- Card radius: `8px`
- Card border: `1px solid var(--border)`
- Card shadow: none
- Inputs radius: `6px`
- Buttons radius: `6px`
- Primary button background: `#6366f1`

### Behavior

- Submit shows loading state.
- Invalid credentials show inline error banner.
- Unverified account shows verification notice with resend action.
- Social buttons redirect to provider.
- After successful login, redirect to the intended page; otherwise use the
  saved default landing page.

### States

- Loading: button spinner
- Error: inline banner
- Success: redirect

---

## 6.2 Register

### Purpose

Create a new unverified account.

### Elements

- Name input
- Email input
- Password input with show/hide toggle
- Password strength indicator
- Submit button: “Create account”
- Google and GitHub buttons
- “Already have an account? Sign in” link

### Behavior

- Client-side validation mirrors backend rules.
- Password policy hint displayed near password field.
- On success, redirect to “Verify your email” screen.

---

## 6.3 Verify Email Pending

### Purpose

Inform the user that email verification is required.

### Elements

- Icon
- Title: “Check your email”
- Message showing masked email address
- “Resend verification email” button with cooldown timer
- “Back to sign in” link
- Help text about spam folder

### Behavior

- Resend button disabled during cooldown.
- Resend success shows toast.
- If already verified and a valid session exists, use the saved landing page;
  otherwise direct the user to sign in.

---

## 6.4 Email Verification Result

### Purpose

Show result of clicking verification link.

### Success State

- Title: “Email verified”
- Message: account is ready
- CTA: “Go to sign in”

Email verification does not create a session, so the success state must not
offer a direct protected-page action.

### Failure State

- Title: “Verification failed”
- Reason: invalid or expired link
- CTA: “Resend verification email”
- CTA: “Back to sign in”

---

## 6.5 Forgot Password

### Purpose

Allow users to request password reset.

### Elements

- Email input
- Submit button: “Send reset link”
- “Back to sign in” link

### Behavior

- Always show neutral success message:
  “If an account exists for this email, a reset link has been sent.”
- Avoid account enumeration.

---

## 6.6 Reset Password

### Purpose

Set a new password using valid reset token.

### Elements

- New password input
- Confirm password input
- Password strength indicator
- Submit button: “Reset password”

### Behavior

- Invalid/expired token shows error state.
- Success shows confirmation and redirects to login.

---

# 7. Protected Screens

## 7.1 Dashboard

### Purpose

Give users immediate overview of job search.

### Desktop Layout

```text
+--------------------------------------------------------------+
| Stat cards row (4 cards)                                     |
+-----------------------------+--------------------------------+
| Follow-ups                  | Status distribution chart      |
| - Overdue                   +--------------------------------+
| - Due today                 | Recent applications            |
+-----------------------------+--------------------------------+
| Upcoming interviews         | Install prompt / quick actions |
+--------------------------------------------------------------+
```

### Mobile Layout

Stacked sections.

### Elements

- Stat cards:
  - Total applications
  - Active applications
  - Scheduled interviews
  - Offers
- Follow-ups card:
  - Overdue list with danger styling
  - Due today list with warning styling
- Upcoming interviews card
- Status distribution chart
- Recent applications list
- Optional PWA install prompt card

Metric semantics follow the PRD: archived applications are excluded; active
means Applied, Screening, or Interview; and “today” uses the user's saved time
zone. Follow-up cards render actual compact application rows, not counts alone.

### Visual Rules

- Cards:
  - background: `var(--surface)`
  - border: `1px solid var(--border)`
  - radius: `8px`
  - shadow: none
- Overdue follow-up:
  - danger color
- Due today:
  - warning color

### Behavior

- Stat cards link to filtered application views.
- Follow-up items link to application detail.
- Interview items link to application detail or interviews page.
- Empty dashboard shows onboarding CTA: “Add your first application”.

### States

- Loading: skeleton cards
- Empty: onboarding state
- Error: retry banner

---

## 7.2 Applications List

### Purpose

Browse, search, filter, and manage applications.

### Toolbar

- Search input
- Filters button
- Sort dropdown
- View toggle: List / Board, shown only when the Should Have board is enabled
- Add Application button

### Active Filters

- Displayed as removable chips below toolbar
- “Clear all” action
- Chip radius: `4px`
- Chip border: `1px solid var(--border)`

---

### List View Desktop

Table columns:

1. Company / Role
2. Status badge
3. Tags
4. Applied date
5. Follow-up date
6. Updated date
7. Row action / chevron

Table row style:

- Border bottom: `1px solid var(--border)`
- Hover background: `var(--surface-muted)`
- Selected background: `var(--primary-subtle)`
- No shadow

---

### List View Mobile

Card layout:

```text
+--------------------------------+
| Company                 [Badge]|
| Role                           |
| Tags                           |
| Follow-up: date [overdue flag] |
+--------------------------------+
```

Card style:

- border: `1px solid var(--border)`
- radius: `8px`
- shadow: none

---

### Board View (Should Have Enhancement)

The list and detail views are the MVP status-management surfaces. The board is
implemented only if the PRD Should Have enhancement is selected; it is not an
unconditional release gate.

Before enabling it, define a board API contract with per-status totals and
pagination/loading behavior. A single page from the standard list endpoint must
not be presented as the complete board.

Columns:

- Wishlist
- Applied
- Screening
- Interview
- Offer
- Rejected
- Withdrawn

Column header:

- Status name
- Count badge

Card content:

- Company
- Role
- Tags
- Follow-up indicator
- Status menu alternative

Visual rules:

- Card radius: `8px`
- Card border: `1px solid var(--border)`
- Card shadow: none
- Drag state: border color `#6366f1`

Behavior:

- Drag-and-drop changes status.
- Each card includes accessible status menu.
- Mobile: horizontal scrolling columns.

---

### Pagination

- Default page size: 20
- Desktop: page numbers + prev/next
- Mobile: prev/next with “Page X of Y”

---

### Behavior

- Row/card click opens application detail.
- Search debounced at 300ms.
- Sort default: recently updated.
- Empty state includes “Add Application” CTA.
- No-results state suggests clearing filters.

---

## 7.3 Application Detail

### Purpose

Show all information and activity for one application.

### Header

- Company name
- Role
- Status badge
- Actions:
  - Change status
  - Edit
  - Archive / Unarchive
  - Delete

### Meta Grid

- Location
- Remote type
- Employment type
- Source
- Applied date
- Follow-up date/time
- Salary range
- Job link

### Tabs or Sections

1. Overview
2. Notes
3. Interviews
4. Activity

---

### Overview

- Notes summary
- Tags
- Key dates

### Notes

- Add note composer
- Notes list, newest first
- Edit/delete per note

### Interviews

- Interview list with type, date, status
- Add interview button
- Edit/delete per interview

### Activity

- Status history timeline:
  - from status → to status
  - timestamp
  - optional note

---

### Visual Rules

- Section cards:
  - border: `1px solid var(--border)`
  - radius: `8px`
  - shadow: none
- Active tab:
  - text: `#6366f1`
  - border-bottom: `2px solid #6366f1`
- Overdue follow-up:
  - danger color
- Due today:
  - warning color

---

### Behavior

- External job link opens in new tab.
- Delete opens confirmation dialog.
- Archive hides from default list and shows success toast.
- Follow-up overdue/today highlighted.

---

## 7.4 Interviews

### Purpose

Manage interview schedule across applications.

### Layout

- Tabs or sections:
  - Upcoming
  - Past
- Add Interview button

The global Add Interview flow first requires selecting an owned application,
then shows the normal interview fields. Creating an interview without an
application is not allowed.

### Interview Card / Row

- Company and role
- Interview type badge
- Scheduled date/time
- Interviewer name
- Meeting link button
- Status badge
- Edit/delete actions

### Visual Rules

- Interview card:
  - border: `1px solid var(--border)`
  - radius: `8px`
  - shadow: none
- Scheduled badge:
  - blue subtle style
- Completed badge:
  - green subtle style
- Cancelled badge:
  - gray subtle style
- No-show badge:
  - red subtle style

### Behavior

- Upcoming sorted ascending.
- Past sorted descending.
- Meeting link opens in new tab.
- Empty state explains how to add interviews from an application.

---

## 7.5 Settings

### Purpose

Manage account, security, preferences, and data.

### Layout

Desktop:

- Left section navigation
- Right content panel

Mobile:

- Stacked sections

### Sections

1. Profile
2. Security
3. Tags
4. Preferences
5. Data

---

### Profile

Elements:

- Name input
- Email read-only display
- Save button

Behavior:

- Success toast on save.
- Inline validation for name.

---

### Security

Subsections:

#### Password

For users with password:

- Current password
- New password
- Confirm new password
- Submit: “Update password”

For OAuth-only users:

- New password
- Confirm new password
- Submit: “Set password”
- Helper text explaining email/password login will be enabled

#### Connected Accounts

- Google row
- GitHub row
- Connect/disconnect buttons
- Warning dialog before unlinking
- Prevent unlinking the last available login method

---

### Tags

- List the user's reusable tags with name and color.
- Provide create, edit, and delete actions.
- Tag deletion requires confirmation and explains that assignments will be
  removed without deleting applications.

---

### Preferences

- Theme selector: Light / Dark / System
- Default landing page selector: Dashboard / Applications
- Time-zone selector using IANA identifiers, with browser zone as the suggested
  initial value
- Notification preference toggle, optional

Behavior:

- Changes persist immediately or via save button with toast.

---

### Data

- Export JSON button
- Export CSV button
- Import JSON control
- Import confirmation dialog explaining replacement
- Success/error toasts

---

# 8. Modals and Dialogs

All modals and dialogs must follow flat bordered style.

Common modal style:

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 8px;
box-shadow: none;
```

Overlay:

```css
background: rgba(15, 23, 42, 0.45);
```

---

## 8.1 Add/Edit Application

Use modal on desktop and full-screen sheet on mobile.

### Fields

- Company (required)
- Role (required)
- Job URL
- Location
- Remote type select
- Employment type select
- Source select/input
- Status select in create mode; edit mode uses the separate Change Status flow
- Applied date
- Salary min
- Salary max
- Currency
- Follow-up date/time
- Tags multi-select
- Initial note textarea

### Behavior

- Required fields marked.
- Inline validation on blur/submit.
- Save button loading state.
- Success toast and close modal.
- Edit mode pre-fills values.

---

## 8.2 Delete Confirmation

- Title: “Delete application?”
- Body: irreversible warning including related notes/interviews
- Buttons:
  - Cancel
  - Delete (danger)

Danger button:

```css
background: #dc2626;
color: #ffffff;
border-radius: 6px;
```

---

## 8.3 Status Change Note (Optional)

- Collect the optional note before submitting the status mutation so the status
  update and immutable history row are written atomically.
- Buttons:
  - Skip
  - Save note

---

## 8.4 Import Confirmation

- Title: “Replace existing data?”
- Body: explains import replaces current data
- Buttons:
  - Cancel
  - Import (danger)

---

## 8.5 Unlink Provider Confirmation

- Title: “Disconnect Google/GitHub?”
- Body: explains login impact
- Buttons:
  - Cancel
  - Disconnect (danger)

---

# 9. Component Styling Rules

## 9.1 Buttons

### Primary Button

```css
background: #6366f1;
color: #ffffff;
border: 1px solid transparent;
border-radius: 6px;
box-shadow: none;
```

Hover:

```css
background: #4f46e5;
```

Active:

```css
background: #4338ca;
```

Focus:

```css
outline: 2px solid #6366f1;
outline-offset: 2px;
```

---

### Secondary Button

```css
background: var(--surface);
color: var(--text-primary);
border: 1px solid var(--border);
border-radius: 6px;
box-shadow: none;
```

Hover:

```css
background: var(--surface-muted);
```

---

### Ghost Button

```css
background: transparent;
border: 1px solid transparent;
border-radius: 6px;
```

Hover:

```css
background: var(--surface-muted);
```

---

### Danger Button

```css
background: #dc2626;
color: #ffffff;
border-radius: 6px;
```

Hover:

```css
background: #b91c1c;
```

---

## 9.2 Inputs

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 6px;
box-shadow: none;
```

Focus:

```css
border-color: #6366f1;
box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
```

Error:

```css
border-color: #dc2626;
```

---

## 9.3 Cards

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 8px;
box-shadow: none;
```

Clickable card hover:

```css
border-color: #c7d2fe;
background: var(--surface-muted);
```

Dark mode clickable card hover:

```css
border-color: rgba(129, 140, 248, 0.35);
```

---

## 9.4 Badges

```css
border-radius: 4px;
border: 1px solid transparent;
font-size: 12px;
font-weight: 500;
padding: 2px 8px;
```

Avoid pill-shaped badges unless specifically required.

---

## 9.5 Tags

```css
border-radius: 4px;
border: 1px solid var(--border);
background: var(--surface-muted);
```

Selected tag light:

```css
background: #eef2ff;
border-color: #c7d2fe;
color: #4338ca;
```

Selected tag dark:

```css
background: rgba(99, 102, 241, 0.16);
border-color: rgba(129, 140, 248, 0.35);
color: #c7d2fe;
```

---

## 9.6 Dropdowns / Popovers

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 6px;
box-shadow: none;
```

If separation is weak, allow only:

```css
box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
```

---

## 9.7 Toasts

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 6px;
box-shadow: none;
```

Use left border accent:

| Type    | Accent    |
| ------- | --------- |
| Success | `#16a34a` |
| Error   | `#dc2626` |
| Warning | `#d97706` |
| Info    | `#0891b2` |

Example:

```css
border-left: 3px solid #16a34a;
```

---

## 9.8 Navigation

### Desktop Sidebar Active Item

Light:

```css
background: #eef2ff;
color: #4338ca;
border-radius: 6px;
```

Dark:

```css
background: rgba(99, 102, 241, 0.14);
color: #c7d2fe;
border-radius: 6px;
```

Optional active indicator:

```css
border-left: 2px solid #6366f1;
```

No shadow on active navigation.

---

### Mobile Bottom Navigation

Active icon/text:

```css
color: #6366f1;
```

Dark mode:

```css
color: #c7d2fe;
```

Inactive:

```css
color: var(--text-secondary);
```

No shadow.

---

## 9.9 Tabs

Active tab:

```css
color: #6366f1;
border-bottom: 2px solid #6366f1;
```

Dark mode:

```css
color: #c7d2fe;
border-bottom: 2px solid #c7d2fe;
```

Inactive tab:

```css
color: var(--text-secondary);
border-bottom: 2px solid transparent;
```

---

# 10. Form UX Rules

1. Labels appear above inputs.
2. Required fields are marked.
3. Error messages appear below the affected field.
4. Errors use danger color and concise wording.
5. Inputs show focus ring.
6. Submit buttons show loading spinner.
7. Prevent double submission.
8. Password fields include show/hide toggle.
9. Date fields use accessible pickers.
10. Long forms are grouped into logical sections.
11. Successful form submission shows toast feedback.

---

# 11. Feedback and States

## 11.1 Toasts

- Position: bottom-right on desktop, top-center on mobile.
- Types: success, error, info, warning.
- Auto-dismiss after 4 seconds.
- Manual close button.
- Announced via `aria-live`.

Use toasts for:

- Save success
- Delete success
- Export success
- Import success/error
- Password update success
- Verification email sent
- Offline warning

---

## 11.2 Loading States

- Page-level skeleton for dashboard and lists.
- Button spinner for async actions.
- Table row skeletons while fetching.
- Avoid full-page spinners where possible.

Skeleton style:

```css
background: var(--surface-muted);
border-radius: 6px;
```

No shadow.

---

## 11.3 Empty States

Every list requires an empty state with:

- Icon
- Title
- Short description
- Primary CTA where relevant

Examples:

- No applications yet → “Add your first application”
- No search results → “Try a different search or clear filters”
- No interviews → “Add an interview from an application”
- No follow-ups today → “You’re all caught up”

---

## 11.4 Error States

- Inline field errors for validation.
- Banner errors for API failures.
- Retry action where possible.
- Friendly wording; avoid technical jargon.

Error banner:

```css
background: #fef2f2;
border: 1px solid #fecaca;
color: #b91c1c;
border-radius: 6px;
```

Dark error banner:

```css
background: rgba(239, 68, 68, 0.12);
border: 1px solid rgba(239, 68, 68, 0.3);
color: #fecaca;
```

---

## 11.5 Offline State

Top banner:

```text
You’re offline. Previously opened data may remain visible; changes are disabled.
```

Style:

```css
background: var(--surface-muted);
border: 1px solid var(--border);
border-left: 3px solid #d97706;
border-radius: 6px;
```

Behavior:

- Mutations disabled or warned.
- Attempting mutation while offline shows warning toast.
- When back online, banner disappears and data refreshes.

---

## 11.6 Unauthorized State

- Expired/invalid session redirects to login.
- Preserve intended destination and return after login.

---

# 12. Key UX Flows

## 12.1 First-time User Onboarding

```text
Register
  -> Verify email pending screen
  -> Verify email
  -> Sign in
  -> Empty dashboard with onboarding CTA
  -> Add first application
  -> See application in dashboard/list
```

---

## 12.2 Add Application

```text
Click Add Application
  -> Modal opens
  -> Enter required fields
  -> Optional fields
  -> Submit
  -> Success toast
  -> List/dashboard updates
```

---

## 12.3 Change Status

```text
Open application or board card
  -> Select new status
  -> Optional note dialog before submission
  -> Status badge updates
  -> History entry created
  -> Toast confirms change
```

---

## 12.4 Handle Follow-up

```text
Dashboard shows overdue/today follow-ups
  -> User clicks item
  -> Application detail opens
  -> User updates status or follow-up date
  -> Dashboard reflects change
```

---

## 12.5 Recover Account

```text
Login fails or password forgotten
  -> Click Forgot password
  -> Enter email
  -> Neutral confirmation shown
  -> Open reset email
  -> Set new password
  -> Login with new password
```

---

## 12.6 Manage Login Methods

```text
Settings > Security
  -> View connected accounts
  -> Connect Google/GitHub or disconnect
  -> Set or change password
  -> Confirmation dialogs protect destructive actions
```

---

# 13. Accessibility Requirements

Target:

```text
WCAG 2.1 AA
```

Requirements:

- Semantic HTML landmarks and headings.
- Skip-to-content link.
- Visible focus indicators.
- Keyboard operability for all interactive elements.
- Focus trap in modals and dialogs.
- Escape closes modals.
- Focus returns to trigger after modal close.
- Form inputs have associated labels.
- Error messages linked via `aria-describedby`.
- Color is not the only indicator.
- Contrast ratio at least 4.5:1 for body text.
- Drag-and-drop has keyboard/menu alternative.
- Toasts use live regions.
- Charts include text alternatives or data tables where practical.
- Respect `prefers-reduced-motion`.

---

# 14. PWA UX Requirements

## Install Prompt

- Show install card/button when `beforeinstallprompt` is available.
- Placement: dashboard or settings.
- Do not show intrusive native prompt immediately on first visit.

Install prompt card style:

```css
border: 1px solid var(--border);
border-radius: 8px;
background: var(--surface);
box-shadow: none;
```

---

## Offline Banner

Display when network unavailable.

Message:

```text
You’re offline. Previously opened data may remain visible; changes are disabled.
```

---

## Update Available

Show toast:

```text
A new version is available.
```

Action:

```text
Reload
```

---

## Standalone Mode

- Hide browser-specific assumptions.
- Use safe-area padding for mobile standalone display.

---

# 15. Motion and Micro-interactions

- Use subtle transitions, 150–200ms.
- Modals fade/scale in.
- Sheets slide in.
- Toasts slide/fade.
- Buttons show hover/active states.
- Avoid animation for critical information changes.
- Respect reduced motion settings.

Do not use motion to replace clear state feedback.

---

# 16. Keyboard Support

| Key                 | Action                      |
| ------------------- | --------------------------- |
| `/`                 | Focus global search         |
| `Esc`               | Close modal/popover         |
| `Tab` / `Shift+Tab` | Navigate focusable elements |
| `Enter`             | Activate focused control    |

Optional future shortcuts:

- `n` for new application
- `g d` for dashboard
- `g a` for applications

---

# 17. Content and Microcopy Guidelines

- Use sentence case for headings and buttons.
- Keep labels short and action-oriented.
- Error messages should explain what to do next.
- Avoid technical jargon.
- Avoid blaming the user.
- Use neutral security messages for authentication errors.

Examples:

Good:

```text
Enter a valid email address.
```

Bad:

```text
Invalid input.
```

Good:

```text
If an account exists for this email, a reset link has been sent.
```

Bad:

```text
Email not found.
```

---

# 18. Visual Do/Don’t List

## Do

- Use `#6366f1` for primary actions
- Use borders for separation
- Use compact radius
- Use subtle backgrounds for selected states
- Use clear focus rings
- Use flat buttons
- Use consistent spacing

## Don’t

- Don’t use heavy card shadows
- Don’t use large rounded corners
- Don’t use gradient primary buttons
- Don’t use glass effects
- Don’t use too many colors
- Don’t use shadow as the main depth system

---

# 19. UX Acceptance Criteria

The UI/UX implementation is complete when:

- Primary actions use `#6366f1`
- Hover state uses `#4f46e5`
- Focus states use indigo ring
- Cards have borders and no heavy shadow
- Buttons and inputs use `6px` radius
- Cards and modals use maximum `8px` radius
- Status badges use subtle backgrounds with borders
- Dark mode uses the same low-shadow, low-radius style
- All public and protected screens exist and match this specification
- Authentication flows are clear and safe
- Application list and detail views work on mobile and desktop; when the Should
  Have board is shipped, it is responsive and has a non-drag status control
- Empty, loading, error, success, offline, and unauthorized states are handled
- Forms validate inline and show feedback
- Toasts and confirmation dialogs behave consistently
- Accessibility requirements pass manual keyboard and screen reader checks
- Light and dark themes are consistent
- PWA install, offline banner, and update toast work

---

# 20. Final Visual Rule

Use this rule during implementation:

```text
Primary color: #6366f1
Shadow: minimal or none
Radius: small, maximum 8px for major containers
Depth: created using borders and surface contrast
Style: flat, clean, professional
```

This is now the final UI/UX visual direction for the project.
