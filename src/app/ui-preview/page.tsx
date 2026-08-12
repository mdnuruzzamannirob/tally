import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  ToastExamples,
} from "@/components/app-ui";
import { Info } from "lucide-react";

export const metadata = {
  title: "UI Preview",
  robots: { index: false, follow: false },
};

const statusBadges = [
  {
    label: "Wishlist",
    tone: "default" as const,
    className: "border-border bg-surface-muted text-muted-foreground",
  },
  {
    label: "Applied",
    tone: "default" as const,
    className: "border-primary-border bg-primary-subtle text-primary-text",
  },
  { label: "Screening", tone: "info" as const },
  {
    label: "Interview",
    tone: "default" as const,
    className:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-200",
  },
  { label: "Offer", tone: "success" as const },
  { label: "Rejected", tone: "danger" as const },
  {
    label: "Withdrawn",
    tone: "default" as const,
    className: "border-border bg-surface-muted text-muted-foreground",
  },
];

export default function UiPreviewPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2 border-b border-border pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Tally app-ui
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Component preview</h1>
        <p className="max-w-2xl text-muted-foreground">
          A visual reference for the themed wrappers used by pages and features. Toggle the document
          theme to compare light and dark states.
        </p>
      </header>

      <section className="space-y-4" aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="text-xl font-semibold">
          Actions
        </h2>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-5">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Delete application</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link action</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Saving changes</Button>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="icon" aria-label="More information">
                  <Info />
                </Button>
              }
            />
            <TooltipContent>More information</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="secondary" />}>
              More actions
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>View application</DropdownMenuItem>
              <DropdownMenuItem>Mark as interview</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="badges-heading">
        <h2 id="badges-heading" className="text-xl font-semibold">
          Status badges
        </h2>
        <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-5">
          {statusBadges.map((badge) => (
            <Badge key={badge.label} tone={badge.tone} className={badge.className}>
              {badge.label}
            </Badge>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2" aria-labelledby="forms-heading">
        <div className="space-y-4">
          <h2 id="forms-heading" className="text-xl font-semibold">
            Form states
          </h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-5">
            <div className="space-y-2">
              <Label htmlFor="company">Company name</Label>
              <Input id="company" placeholder="e.g. Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invalid-email">Email with error</Label>
              <Input
                id="invalid-email"
                error
                defaultValue="not-an-email"
                aria-describedby="email-error"
              />
              <p id="email-error" className="text-sm text-danger">
                Enter a valid email address.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Initial note</Label>
              <Textarea id="notes" placeholder="Add context about this opportunity..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Application status</Label>
                <Select defaultValue="applied">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Choose status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wishlist">Wishlist</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-3 pb-2">
                <Checkbox id="follow-up" defaultChecked />
                <Label htmlFor="follow-up">Needs follow-up</Label>
                <Checkbox id="archived" />
                <Label htmlFor="archived">Archived</Label>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-surface-muted p-3">
              <div>
                <p className="text-sm font-medium">Email reminders</p>
                <p className="text-xs text-muted-foreground">
                  Get a reminder before follow-up dates.
                </p>
              </div>
              <Switch defaultChecked aria-label="Email reminders" />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-surface-muted p-3">
              <div>
                <p className="text-sm font-medium">Weekly summary</p>
                <p className="text-xs text-muted-foreground">Disabled switch state.</p>
              </div>
              <Switch aria-label="Weekly summary" />
            </div>
          </div>
        </div>

        <div className="space-y-4" aria-labelledby="loading-heading">
          <h2 id="loading-heading" className="text-xl font-semibold">
            Loading states
          </h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="overlays-heading">
        <h2 id="overlays-heading" className="text-xl font-semibold">
          Overlays and navigation
        </h2>
        <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-5">
          <Dialog>
            <DialogTrigger render={<Button variant="secondary" />}>Open dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit application</DialogTitle>
                <DialogDescription>
                  Update the opportunity details without changing its status.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input defaultValue="Acme Inc." aria-label="Company" />
              </div>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="danger" />}>
              Delete dialog
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this application?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone and removes related notes and interviews.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Sheet>
            <SheetTrigger render={<Button variant="secondary" />}>Open mobile sheet</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Application filters</SheetTitle>
                <SheetDescription>Filter your opportunities by status.</SheetDescription>
              </SheetHeader>
              <div className="space-y-3 p-4">
                <Checkbox id="sheet-applied" />
                <Label htmlFor="sheet-applied">Applied only</Label>
              </div>
              <SheetFooter>
                <Button>Apply filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="feedback-heading">
        <h2 id="feedback-heading" className="text-xl font-semibold">
          Feedback
        </h2>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="mb-3 text-sm text-muted-foreground">
            These buttons use the global Sonner provider.
          </p>
          <ToastExamples />
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="tabs-heading">
        <h2 id="tabs-heading" className="text-xl font-semibold">
          Tabs
        </h2>
        <Tabs defaultValue="overview" className="rounded-lg border border-border bg-card p-5">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-sm text-muted-foreground">
            Application metadata and next actions appear here.
          </TabsContent>
          <TabsContent value="activity" className="text-sm text-muted-foreground">
            Status changes and notes appear here.
          </TabsContent>
          <TabsContent value="interviews" className="text-sm text-muted-foreground">
            Scheduled interviews appear here.
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
