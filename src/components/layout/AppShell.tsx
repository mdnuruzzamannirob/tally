"use client";
import { AppAvatar, AppButton, AppInput } from "@/components/app-ui";
import { AppConfirmDialog } from "@/components/app-ui/app-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCurrentUserQuery, useLogoutMutation } from "@/store/api/auth.api";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Target,
  Monitor,
  Moon,
  Sun,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
  Briefcase,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useState } from "react";
import { OfflineBanner } from "./OfflineBanner";
const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { href: "/interviews", label: "Interviews", icon: CalendarDays },
  { href: "/settings", label: "Settings", icon: Settings },
];
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useCurrentUserQuery();
  const [logout, { isLoading }] = useLogoutMutation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { resolvedTheme, setTheme, theme } = useTheme();
  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "T";
  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
  const pageName = navigation.find(({ href }) => isActive(href))?.label ?? "Tally";
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.replace("/login");
    } finally {
      setConfirmLogout(false);
    }
  };
  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[15.5rem] border-r border-border bg-card lg:flex lg:flex-col">
        <Link
          className="flex h-15 shrink-0 items-center gap-2 border-b border-border px-4 text-lg font-semibold tracking-tight"
          href="/dashboard"
        >
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Target className="size-4" />
          </span>
          Tally
        </Link>
        <nav aria-label="Main navigation" className="mt-5 space-y-1 px-3">
          {navigation.map(({ href, icon: Icon, label }) => (
            <Link
              className={cn(
                "flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                isActive(href) && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
              )}
              href={href}
              key={href}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border p-3">
          <Link className="flex items-center gap-3 rounded-md p-2 hover:bg-muted" href="/settings">
            <AppAvatar alt={user?.name || "Your profile"} fallback={initials} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">
                {user?.name || "Your profile"}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {user?.email || "Account settings"}
              </span>
            </span>
          </Link>
        </div>
      </aside>
      <div className="min-w-0 pb-18 lg:pl-62 lg:pb-0">
        <header className="fixed inset-x-0 top-0 z-20 h-15 border-b border-border bg-card/95 backdrop-blur lg:left-62 lg:bg-card">
          <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Link className="flex items-center gap-2 font-semibold lg:hidden" href="/dashboard"><span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground"><Target className="size-3.5" /></span><span className="hidden sm:inline">Tally</span></Link>
            <h1 className="hidden text-base font-semibold sm:block">{pageName}</h1>
            <div className="ml-auto flex items-center gap-2">
              <AppButton aria-label="Open search" className="h-8 w-8 justify-center gap-2 overflow-hidden border-border! bg-background! px-2.5 text-muted-foreground hover:bg-muted! sm:w-56 sm:justify-start" onClick={() => setSearchOpen(true)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSearchOpen(true); }} size="sm" tone="outline"><Search className="size-4 shrink-0" /><span className="hidden truncate sm:inline">Search applications...</span></AppButton>
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger
                  render={<button aria-label="Notifications" className="inline-flex size-8 items-center justify-center rounded-md border border-transparent bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" type="button" />}
                >
                  <Bell className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-2">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex items-center justify-between px-2 py-2 text-sm text-foreground">
                      <span>Notifications</span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">All caught up</span>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <div className="flex flex-col items-center gap-2 px-3 py-7 text-center">
                    <span className="grid size-10 place-items-center rounded-full bg-success-soft text-success"><CheckCircle2 className="size-5" /></span>
                    <p className="text-sm font-medium text-foreground">You&apos;re all caught up</p>
                    <p className="text-xs leading-5 text-muted-foreground">New reminders and activity will appear here.</p>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<button aria-label="Choose theme" className="inline-flex size-8 items-center justify-center rounded-md border border-transparent bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" type="button" />}
                >
                  {resolvedTheme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 p-2">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-2 text-sm text-foreground">Appearance</DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
                    <DropdownMenuRadioItem className="py-2" value="light"><Sun /> Light</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem className="py-2" value="dark"><Moon /> Dark</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem className="py-2" value="system"><Monitor /> System</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <AppButton aria-label="Log out" className="text-destructive hover:bg-destructive/10! hover:text-destructive!" onClick={() => setConfirmLogout(true)} loading={isLoading} size="icon-sm" tone="ghost"><LogOut className="size-4" /></AppButton>
            </div>
          </div>
        </header>
        <OfflineBanner />
        <main
          className="mx-auto w-full max-w-360 px-4 pb-6 pt-21 sm:px-6 lg:px-8 lg:pb-8 lg:pt-23"
          id="main-content"
        >
          {children}
        </main>
      </div>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-16! translate-y-0! gap-0 overflow-hidden rounded-xl border-border bg-card p-0 shadow-2xl sm:top-20! sm:max-w-xl">
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-5 shrink-0 text-primary" />
            <AppInput autoFocus aria-label="Search applications" className="h-13 border-0! bg-transparent! px-0 text-sm shadow-none focus-visible:ring-0" placeholder="Search applications, companies, notes..." />
            <kbd className="shrink-0 rounded-md border border-border bg-muted/50 px-1.5 py-1 text-[10px] font-medium text-muted-foreground">ESC</kbd>
          </div>
          <div className="p-2">
            <p className="px-2 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Quick search</p>
            <div className="space-y-0.5">
              <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" type="button">
                <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary"><Briefcase className="size-4" /></span>
                <span className="flex-1"><span className="block font-medium text-foreground">Applications</span><span className="text-xs">Search your saved applications</span></span>
                <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
              <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" type="button">
                <span className="grid size-8 place-items-center rounded-md bg-info-soft text-info"><FileText className="size-4" /></span>
                <span className="flex-1"><span className="block font-medium text-foreground">Notes and interviews</span><span className="text-xs">Find notes, companies, and interview details</span></span>
                <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock3 className="size-3.5" /> Search across Tally</span>
            <span>Press Enter to open</span>
          </div>
        </DialogContent>
      </Dialog>
      <AppConfirmDialog
        description="Are you sure you want to log out of your Tally account?"
        onConfirm={() => void handleLogout()}
        onOpenChange={setConfirmLogout}
        open={confirmLogout}
        title="Log out"
        confirmLabel="Log out"
        variant="danger"
      />
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {navigation.map(({ href, icon: Icon, label }) => (
          <Link
            className={cn(
              "flex flex-col items-center gap-1 px-2 py-2 text-[11px] text-muted-foreground",
              isActive(href) && "text-primary",
            )}
            href={href}
            key={href}
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
