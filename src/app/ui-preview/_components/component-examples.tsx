"use client";

import {
  AppAlert,
  AppAvatar,
  AppBadge,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppCardSkeleton,
  AppCheckbox,
  AppCombobox,
  AppConfirmDialog,
  AppCurrencyInput,
  AppDatePicker,
  AppDateRangePicker,
  AppDropdownMenu,
  AppEmptyState,
  AppField,
  AppFileUpload,
  AppInput,
  AppKbd,
  AppModal,
  AppMobileList,
  AppMultiSelect,
  AppNumberInput,
  AppPageHeader,
  AppPagination,
  AppPopover,
  AppProgress,
  AppRadioGroup,
  AppRangeSlider,
  AppSegmentedControl,
  AppSelect,
  AppSheet,
  AppSkeleton,
  AppSection,
  AppStatCard,
  AppSwitch,
  AppTable,
  AppTabs,
  AppTextarea,
  AppTimePicker,
  AppTooltip,
  AppOfflineBanner,
} from "@/components/app-ui";
import { CreditCard, Mail, Plus, TrendingUp, WalletCards } from "lucide-react";
import { useState } from "react";

export const componentPreviewItems = [
  { id: "alert", label: "Alert" },
  { id: "avatar", label: "Avatar" },
  { id: "badge", label: "Badge" },
  { id: "breadcrumb", label: "Breadcrumb" },
  { id: "button", label: "Button" },
  { id: "card", label: "Card" },
  { id: "input", label: "Input" },
  { id: "checkbox", label: "Checkbox" },
  { id: "combobox", label: "Combobox" },
  { id: "confirm-dialog", label: "Confirm dialog" },
  { id: "currency-input", label: "Currency input" },
  { id: "date-picker", label: "Date picker" },
  { id: "date-range-picker", label: "Date range picker" },
  { id: "dropdown-menu", label: "Dropdown menu" },
  { id: "empty-state", label: "Empty state" },
  { id: "field", label: "Field" },
  { id: "file-upload", label: "File upload" },
  { id: "kbd", label: "Keyboard shortcut" },
  { id: "modal", label: "Modal" },
  { id: "mobile-list", label: "Mobile list" },
  { id: "multi-select", label: "Multi-select" },
  { id: "number-input", label: "Number input" },
  { id: "page-header", label: "Page header" },
  { id: "pagination", label: "Pagination" },
  { id: "popover", label: "Popover" },
  { id: "progress", label: "Progress" },
  { id: "radio-group", label: "Radio group" },
  { id: "range-slider", label: "Range slider" },
  { id: "segmented-control", label: "Segmented control" },
  { id: "select", label: "Select" },
  { id: "sheet", label: "Sheet" },
  { id: "skeleton", label: "Skeleton" },
  { id: "offline-banner", label: "Offline banner" },
  { id: "section", label: "Section" },
  { id: "card-skeleton", label: "Card skeleton" },
  { id: "stat-card", label: "Stat card" },
  { id: "switch", label: "Switch" },
  { id: "tabs", label: "Tabs" },
  { id: "table", label: "Table" },
  { id: "textarea", label: "Textarea" },
  { id: "time-picker", label: "Time picker" },
  { id: "tooltip", label: "Tooltip" },
] as const;

export type ComponentPreviewId = (typeof componentPreviewItems)[number]["id"];

function ExampleFrame({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-border bg-card p-5 sm:p-6">{children}</div>;
}

function PreviewHeader({ description, title }: { description: string; title: string }) {
  return (
    <header className="mb-6 space-y-1">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </header>
  );
}

export function ComponentExamples({ component }: { component: ComponentPreviewId }) {
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("personal");
  const [comboboxValue, setComboboxValue] = useState<string | null>("cash");
  const [checked, setChecked] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [page, setPage] = useState(2);
  const [numberValue, setNumberValue] = useState(3);
  const [rangeValue, setRangeValue] = useState(40);
  const [segment, setSegment] = useState("month");
  const [timeValue, setTimeValue] = useState("14:30");
  const [selectedCategories, setSelectedCategories] = useState(["career"]);

  if (component === "breadcrumb") {
    return (
      <div>
        <PreviewHeader
          description="A path indicator for nested application screens."
          title="Breadcrumb"
        />
        <ExampleFrame>
          <AppBreadcrumb
            items={[
              { href: "/", label: "Home" },
              { href: "/applications", label: "Applications" },
              { label: "Acme role" },
            ]}
          />
        </ExampleFrame>
      </div>
    );
  }

  if (component === "card") {
    return (
      <div>
        <PreviewHeader
          description="Surface containers with compact, standard, and spacious padding."
          title="Card"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <AppCard padding="sm">Small padding</AppCard>
          <AppCard>Default padding</AppCard>
          <AppCard padding="lg">Large padding</AppCard>
        </div>
      </div>
    );
  }

  if (component === "confirm-dialog") {
    return (
      <div>
        <PreviewHeader
          description="A confirmation overlay for irreversible actions."
          title="Confirm dialog"
        />
        <ExampleFrame>
          <AppButton onClick={() => setConfirmOpen(true)} variant="destructive">
            Delete application
          </AppButton>
        </ExampleFrame>
        <AppConfirmDialog
          description="This permanently removes the application and its notes."
          onConfirm={() => setConfirmOpen(false)}
          onOpenChange={setConfirmOpen}
          open={confirmOpen}
          title="Delete application?"
        />
      </div>
    );
  }

  if (component === "currency-input") {
    return (
      <div>
        <PreviewHeader description="A text input with a currency prefix." title="Currency input" />
        <ExampleFrame>
          <div className="grid gap-5 sm:grid-cols-2">
            <AppCurrencyInput currency="৳" defaultValue="12500" />
            <AppCurrencyInput currency="$" placeholder="0.00" />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "date-picker") {
    return (
      <div>
        <PreviewHeader
          description="Single-date and date-range selection controls."
          title="Date picker"
        />
        <ExampleFrame>
          <div className="grid gap-5 sm:grid-cols-2">
            <AppDatePicker />
            <AppDateRangePicker />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "date-range-picker") {
    return (
      <div>
        <PreviewHeader
          description="A date picker that supports a start and end date."
          title="Date range picker"
        />
        <ExampleFrame>
          <div className="max-w-lg">
            <AppDateRangePicker />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "dropdown-menu") {
    return (
      <div>
        <PreviewHeader description="A compact menu of contextual actions." title="Dropdown menu" />
        <ExampleFrame>
          <AppDropdownMenu
            items={[
              { icon: <Mail />, label: "Email application" },
              { label: "Archive application", separatorBefore: true },
              { label: "Delete application", separatorBefore: true, variant: "destructive" },
            ]}
            trigger={<AppButton variant="outline">More actions</AppButton>}
          />
        </ExampleFrame>
      </div>
    );
  }

  if (component === "empty-state") {
    return (
      <div>
        <PreviewHeader
          description="An empty content area with optional next action."
          title="Empty state"
        />
        <ExampleFrame>
          <AppEmptyState
            action={
              <AppButton size="sm">
                <Plus />
                Add application
              </AppButton>
            }
            description="Add your first role to start tracking progress."
            icon={<WalletCards />}
            title="No applications yet"
          />
        </ExampleFrame>
      </div>
    );
  }

  if (component === "field") {
    return (
      <div>
        <PreviewHeader
          description="Field labels, descriptions, required marks, and error messages."
          title="Field"
        />
        <ExampleFrame>
          <div className="grid gap-5 sm:grid-cols-2">
            <AppField description="Used for updates and reminders." label="Email" required>
              <AppInput placeholder="name@example.com" />
            </AppField>
            <AppField error="A company name is required." label="Company" required>
              <AppInput aria-invalid="true" placeholder="Company name" />
            </AppField>
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "file-upload") {
    return (
      <div>
        <PreviewHeader
          description="An upload zone with selected-file feedback."
          title="File upload"
        />
        <ExampleFrame>
          <AppFileUpload files={["resume.pdf", "cover-letter.pdf"]} multiple onRemove={() => {}} />
        </ExampleFrame>
      </div>
    );
  }

  if (component === "kbd") {
    return (
      <div>
        <PreviewHeader
          description="Keyboard key labels for shortcuts and quick actions."
          title="Keyboard shortcut"
        />
        <ExampleFrame>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            Open search <AppKbd>Ctrl</AppKbd>
            <AppKbd>K</AppKbd>
            <span className="mx-2 text-muted-foreground">then</span>
            <AppKbd>Esc</AppKbd>
            <span>to close</span>
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "multi-select") {
    return (
      <div>
        <PreviewHeader description="Searchable selection of several values." title="Multi-select" />
        <ExampleFrame>
          <div className="max-w-md">
            <AppMultiSelect
              onValueChange={setSelectedCategories}
              options={[
                { label: "Career", value: "career" },
                { label: "Finance", value: "finance" },
                { label: "Learning", value: "learning" },
              ]}
              value={selectedCategories}
            />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "number-input") {
    return (
      <div>
        <PreviewHeader
          description="A bounded numeric stepper with increment and decrement controls."
          title="Number input"
        />
        <ExampleFrame>
          <div className="max-w-sm">
            <AppNumberInput
              label="Interview rounds"
              max={8}
              min={1}
              onValueChange={setNumberValue}
              value={numberValue}
            />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "page-header") {
    return (
      <div>
        <PreviewHeader
          description="A page title with breadcrumb context and responsive actions."
          title="Page header"
        />
        <ExampleFrame>
          <AppPageHeader
            actions={
              <AppButton size="sm">
                <Plus />
                Add application
              </AppButton>
            }
            breadcrumb={
              <AppBreadcrumb
                items={[{ href: "/", label: "Dashboard" }, { label: "Applications" }]}
              />
            }
            description="Track each opportunity and its next action."
            title="Applications"
          />
        </ExampleFrame>
      </div>
    );
  }

  if (component === "pagination") {
    return (
      <div>
        <PreviewHeader
          description="Paginated navigation with previous, next, and page controls."
          title="Pagination"
        />
        <ExampleFrame>
          <AppPagination onPageChange={setPage} page={page} totalPages={8} />
        </ExampleFrame>
      </div>
    );
  }

  if (component === "popover") {
    return (
      <div>
        <PreviewHeader
          description="A contextual floating panel with title, description, and body content."
          title="Popover"
        />
        <ExampleFrame>
          <AppPopover
            description="Helpful context without changing screens."
            title="Application details"
            trigger={<AppButton variant="outline">Show details</AppButton>}
          >
            <p className="text-sm text-muted-foreground">Last updated today at 10:30 AM.</p>
          </AppPopover>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "radio-group") {
    return (
      <div>
        <PreviewHeader
          description="A single-choice list with detailed option descriptions."
          title="Radio group"
        />
        <ExampleFrame>
          <AppRadioGroup
            defaultValue="email"
            options={[
              {
                description: "Receive updates in your inbox.",
                label: "Email notifications",
                value: "email",
              },
              {
                description: "Only see alerts in the app.",
                label: "In-app notifications",
                value: "app",
              },
              { disabled: true, label: "SMS notifications", value: "sms" },
            ]}
          />
        </ExampleFrame>
      </div>
    );
  }

  if (component === "range-slider") {
    return (
      <div>
        <PreviewHeader
          description="A numeric range input with a visible current value."
          title="Range slider"
        />
        <ExampleFrame>
          <AppRangeSlider
            label="Weekly job-search goal"
            onValueChange={setRangeValue}
            suffix=" applications"
            value={rangeValue}
          />
        </ExampleFrame>
      </div>
    );
  }

  if (component === "segmented-control") {
    return (
      <div>
        <PreviewHeader
          description="A compact single-choice segmented control."
          title="Segmented control"
        />
        <ExampleFrame>
          <AppSegmentedControl
            onValueChange={(value) => setSegment(value ?? "month")}
            options={[
              { label: "Week", value: "week" },
              { label: "Month", value: "month" },
              { label: "Year", value: "year" },
            ]}
            value={segment}
          />
        </ExampleFrame>
      </div>
    );
  }

  if (component === "sheet") {
    return (
      <div>
        <PreviewHeader
          description="A side panel for filters and focused secondary tasks."
          title="Sheet"
        />
        <ExampleFrame>
          <AppButton onClick={() => setSheetOpen(true)} variant="outline">
            Open filters
          </AppButton>
        </ExampleFrame>
        <AppSheet
          footer={<AppButton onClick={() => setSheetOpen(false)}>Apply filters</AppButton>}
          onOpenChange={setSheetOpen}
          open={sheetOpen}
          title="Application filters"
        >
          <p className="text-sm text-muted-foreground">
            Choose which applications to display in the current view.
          </p>
        </AppSheet>
      </div>
    );
  }

  if (component === "skeleton") {
    return (
      <div>
        <PreviewHeader
          description="Loading placeholders for content that is still being fetched."
          title="Skeleton"
        />
        <ExampleFrame>
          <div className="space-y-4">
            <AppSkeleton className="h-5 w-1/3" />
            <AppSkeleton className="h-4 w-full" />
            <AppSkeleton className="h-4 w-4/5" />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "card-skeleton") {
    return (
      <div>
        <PreviewHeader
          description="A complete loading-card layout built from skeleton primitives."
          title="Card skeleton"
        />
        <ExampleFrame>
          <div className="max-w-sm">
            <AppCardSkeleton />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "time-picker") {
    return (
      <div>
        <PreviewHeader description="Time selection in 30-minute increments." title="Time picker" />
        <ExampleFrame>
          <div className="max-w-sm">
            <AppTimePicker
              onValueChange={(value) => setTimeValue(value ?? "14:30")}
              value={timeValue}
            />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "tooltip") {
    return (
      <div>
        <PreviewHeader
          description="A short label shown on hover or keyboard focus."
          title="Tooltip"
        />
        <ExampleFrame>
          <AppTooltip content="Helpful additional information">
            <AppButton variant="outline">Hover or focus me</AppButton>
          </AppTooltip>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "modal") {
    return (
      <div>
        <PreviewHeader
          description="A standard application modal with body content and a dedicated action footer."
          title="Modal"
        />
        <ExampleFrame>
          <AppButton onClick={() => setModalOpen(true)}>Open modal</AppButton>
        </ExampleFrame>
        <AppModal
          footer={
            <>
              <AppButton onClick={() => setModalOpen(false)} variant="ghost">
                Cancel
              </AppButton>
              <AppButton onClick={() => setModalOpen(false)}>Save changes</AppButton>
            </>
          }
          onOpenChange={setModalOpen}
          open={modalOpen}
          title="Edit application"
        >
          <p className="text-sm text-muted-foreground">
            This is the modal body. The footer stays visually separate and contains the available
            actions.
          </p>
        </AppModal>
      </div>
    );
  }

  if (component === "mobile-list") {
    return (
      <div>
        <PreviewHeader description="A stacked data pattern for narrow screens." title="Mobile list" />
        <AppMobileList
          getItemKey={(item) => item.company}
          items={[
            { company: "Acme", role: "Product Designer", status: "Interview" },
            { company: "Globex", role: "Frontend Engineer", status: "Applied" },
          ]}
          renderItem={(item) => (
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0"><p className="truncate text-sm font-medium">{item.company}</p><p className="truncate text-xs text-muted-foreground">{item.role}</p></div>
              <AppBadge status={item.status === "Interview" ? "warning" : "info"}>{item.status}</AppBadge>
            </div>
          )}
        />
      </div>
    );
  }

  if (component === "offline-banner") {
    return (
      <div>
        <PreviewHeader description="A shared connection status message for mutation-aware screens." title="Offline banner" />
        <AppOfflineBanner online={false} />
      </div>
    );
  }

  if (component === "section") {
    return (
      <div>
        <PreviewHeader description="Responsive heading, description, actions, and content spacing." title="Section" />
        <AppSection actions={<AppButton size="sm">Add item</AppButton>} description="Reusable content blocks keep page rhythm consistent." title="Recent applications">
          <AppCard padding="sm"><p className="text-sm text-muted-foreground">Section content</p></AppCard>
        </AppSection>
      </div>
    );
  }

  if (component === "button") {
    return (
      <div>
        <PreviewHeader
          description="Actions across primary, secondary, outline, ghost, and destructive states."
          title="Button"
        />
        <ExampleFrame>
          <div className="flex flex-wrap items-center gap-3">
            <AppButton>Primary action</AppButton>
            <AppButton variant="secondary">Secondary</AppButton>
            <AppButton variant="outline">Outline</AppButton>
            <AppButton variant="ghost">Ghost</AppButton>
            <AppButton variant="destructive">Delete</AppButton>
            <AppButton variant="link">Link action</AppButton>
            <AppButton loading>Saving</AppButton>
            <AppButton disabled>Disabled</AppButton>
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "input") {
    return (
      <div>
        <PreviewHeader
          description="Text input with default, filled, disabled, and validation-ready states."
          title="Input"
        />
        <ExampleFrame>
          <div className="grid gap-5 sm:grid-cols-2">
            <AppField label="Default input" required>
              <AppInput
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Enter a company name"
                value={inputValue}
              />
            </AppField>
            <AppField label="Filled input" optional>
              <AppInput defaultValue="Tally" />
            </AppField>
            <AppField label="Disabled input">
              <AppInput defaultValue="Not editable" disabled />
            </AppField>
            <AppField label="Email input" optional>
              <AppInput placeholder="name@example.com" type="email" />
            </AppField>
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "textarea") {
    return (
      <div>
        <PreviewHeader
          description="Multi-line text input for notes and longer form content."
          title="Textarea"
        />
        <ExampleFrame>
          <div className="grid gap-5 sm:grid-cols-2">
            <AppField label="Empty">
              <AppTextarea placeholder="Add a note..." />
            </AppField>
            <AppField label="With value" optional>
              <AppTextarea defaultValue="Follow up with the recruiter next week." />
            </AppField>
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "select") {
    return (
      <div>
        <PreviewHeader
          description="A selected value, a placeholder, and disabled choices."
          title="Select"
        />
        <ExampleFrame>
          <div className="grid gap-5 sm:grid-cols-2">
            <AppField label="Account type">
              <AppSelect
                onValueChange={(value) => setSelectValue(value ?? "personal")}
                options={[
                  { label: "Personal", value: "personal" },
                  { label: "Work", value: "work" },
                  { disabled: true, label: "Family", value: "family" },
                ]}
                value={selectValue}
              />
            </AppField>
            <AppField label="Placeholder" optional>
              <AppSelect
                options={[
                  { label: "Weekly", value: "weekly" },
                  { label: "Monthly", value: "monthly" },
                ]}
                placeholder="Choose a period"
              />
            </AppField>
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "combobox") {
    return (
      <div>
        <PreviewHeader
          description="Searchable selection for a longer list of options."
          title="Combobox"
        />
        <ExampleFrame>
          <div className="max-w-md">
            <AppField label="Choose a wallet" optional>
              <AppCombobox
                onValueChange={setComboboxValue}
                options={[
                  { label: "Cash wallet", value: "cash" },
                  { label: "bKash account", value: "bkash" },
                  { label: "BRAC Bank savings", value: "brac" },
                ]}
                value={comboboxValue}
              />
            </AppField>
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "checkbox") {
    return (
      <div>
        <PreviewHeader
          description="Checkboxes in checked, unchecked, descriptive, and disabled states."
          title="Checkbox"
        />
        <ExampleFrame>
          <div className="grid gap-5 sm:grid-cols-2">
            <AppCheckbox
              checked={checked}
              label="Remember this device"
              onCheckedChange={setChecked}
            />
            <AppCheckbox
              description="Get a weekly summary every Monday."
              label="Email notifications"
            />
            <AppCheckbox disabled label="Unavailable option" />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "switch") {
    return (
      <div>
        <PreviewHeader description="Switches for immediate on/off preferences." title="Switch" />
        <ExampleFrame>
          <div className="grid gap-4 sm:grid-cols-2">
            <AppSwitch
              checked={enabled}
              description="Receive updates about application activity."
              label="Notifications"
              onCheckedChange={setEnabled}
            />
            <AppSwitch defaultChecked label="Weekly summary" />
            <AppSwitch disabled label="Locked preference" />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "tabs") {
    return (
      <div>
        <PreviewHeader
          description="Two tab patterns: an underline style for page sections and a boxed style for compact view switching."
          title="Tabs"
        />
        <ExampleFrame>
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Line tabs</p>
              <AppTabs
                items={[
                  { content: <p className="p-2 text-sm text-muted-foreground">Overview content</p>, label: "Overview", value: "overview" },
                  { content: <p className="p-2 text-sm text-muted-foreground">Activity content</p>, label: "Activity", value: "activity" },
                  { content: <p className="p-2 text-sm text-muted-foreground">Settings content</p>, disabled: true, label: "Settings", value: "settings" },
                ]}
                variant="line"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Box tabs</p>
              <AppTabs
                items={[
                  { content: <p className="p-2 text-sm text-muted-foreground">List content</p>, label: "List", value: "list" },
                  { content: <p className="p-2 text-sm text-muted-foreground">Board content</p>, label: "Board", value: "board" },
                  { content: <p className="p-2 text-sm text-muted-foreground">Archived content</p>, label: "Archived", value: "archived" },
                ]}
                variant="box"
              />
            </div>
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "badge") {
    return (
      <div>
        <PreviewHeader
          description="Compact status labels across semantic tones and sizes."
          title="Badge"
        />
        <ExampleFrame>
          <div className="flex flex-wrap items-center gap-3">
            <AppBadge status="neutral">Neutral</AppBadge>
            <AppBadge status="info">Info</AppBadge>
            <AppBadge status="success">Success</AppBadge>
            <AppBadge status="warning">Warning</AppBadge>
            <AppBadge status="danger">Danger</AppBadge>
            <AppBadge size="sm" status="info">
              Small
            </AppBadge>
            <AppBadge size="lg" status="success">
              Large
            </AppBadge>
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "avatar") {
    return (
      <div>
        <PreviewHeader
          description="Profile representations at each supported size."
          title="Avatar"
        />
        <ExampleFrame>
          <div className="flex flex-wrap items-end gap-5">
            <AppAvatar alt="Samira Khan" fallback="SK" size="sm" />
            <AppAvatar alt="Samira Khan" fallback="SK" size="md" />
            <AppAvatar alt="Samira Khan" fallback="SK" size="lg" />
            <AppAvatar alt="Samira Khan" fallback="SK" size="xl" />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  if (component === "stat-card") {
    return (
      <div>
        <PreviewHeader
          description="Summary cards using standard, compact, and featured variants."
          title="Stat card"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AppStatCard
            change="+12%"
            icon={<WalletCards />}
            label="Total balance"
            value="৳128,450"
          />
          <AppStatCard
            icon={<TrendingUp />}
            label="Monthly income"
            tone="success"
            value="৳43,200"
            variant="compact"
          />
          <AppStatCard icon={<CreditCard />} label="Budget used" value="68%" variant="featured" />
        </div>
      </div>
    );
  }

  if (component === "table") {
    return (
      <div>
        <PreviewHeader
          description="A responsive data table with cells, badges, and empty-state support."
          title="Table"
        />
        <ExampleFrame>
          <AppTable
            columns={[
              { header: "Company", key: "company", render: (row) => row.company },
              {
                header: "Status",
                key: "status",
                render: (row) => (
                  <AppBadge status={row.status === "Applied" ? "info" : "success"}>
                    {row.status}
                  </AppBadge>
                ),
              },
              { align: "right", header: "Follow-up", key: "date", render: (row) => row.date },
            ]}
            getRowKey={(row) => row.company}
            rows={[
              { company: "Acme", date: "Tomorrow", status: "Applied" },
              { company: "Globex", date: "Friday", status: "Interview" },
            ]}
          />
        </ExampleFrame>
      </div>
    );
  }

  if (component === "alert") {
    return (
      <div>
        <PreviewHeader
          description="Feedback messages for information, success, warning, and error states."
          title="Alert"
        />
        <div className="space-y-3">
          <AppAlert title="Profile saved" tone="success">
            Your preferences have been updated.
          </AppAlert>
          <AppAlert title="Follow-up due" tone="warning">
            This application needs attention today.
          </AppAlert>
          <AppAlert title="Could not save" tone="danger">
            Try again in a moment.
          </AppAlert>
          <AppAlert title="New update" tone="info">
            Your import is ready to review.
          </AppAlert>
        </div>
      </div>
    );
  }

  if (component === "progress") {
    return (
      <div>
        <PreviewHeader
          description="Progress indicators in semantic colors and completion values."
          title="Progress"
        />
        <ExampleFrame>
          <div className="space-y-6">
            <AppProgress label="Application profile" value={35} />
            <AppProgress label="Interview preparation" tone="success" value={68} />
            <AppProgress label="Monthly follow-up goal" tone="warning" value={85} />
            <AppProgress label="Import failed" tone="danger" value={100} />
          </div>
        </ExampleFrame>
      </div>
    );
  }

  return null;
}
