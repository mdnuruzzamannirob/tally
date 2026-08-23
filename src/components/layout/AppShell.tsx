"use client";
import { AppAvatar, AppButton, AppInput } from "@/components/app-ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    await logout().unwrap();
    router.replace("/login");
  };
  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[15.5rem] border-r border-border bg-card lg:flex lg:flex-col lg:p-4">
        <Link
          className="flex items-center gap-2 px-2 py-2 text-lg font-semibold tracking-tight"
          href="/dashboard"
        >
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Target className="size-4" />
          </span>
          Tally
        </Link>
        <nav aria-label="Main navigation" className="mt-8 space-y-1">
          {navigation.map(({ href, icon: Icon, label }) => (
            <Link
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                isActive(href) && "bg-primary/10 text-primary",
              )}
              href={href}
              key={href}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border pt-4">
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
          <AppButton aria-label="Sign out" className="mt-3 w-full justify-start" onClick={handleLogout} loading={isLoading} tone="ghost"><LogOut /> Sign out</AppButton>
        </div>
      </aside>
      <div className="min-w-0 pb-18 lg:pl-62 lg:pb-0">
        <header className="fixed inset-x-0 top-0 z-20 h-15 border-b border-border bg-card/95 backdrop-blur lg:left-62 lg:bg-card">
          <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Link className="flex items-center gap-2 font-semibold lg:hidden" href="/dashboard"><span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground"><Target className="size-3.5" /></span><span className="hidden sm:inline">Tally</span></Link>
            <h1 className="text-base font-semibold">{pageName}</h1>
            <div className="ml-auto flex items-center gap-2">
              <AppButton aria-label="Open search" className="h-8 w-8 justify-start gap-2 overflow-hidden border-border! bg-background! px-2.5 text-muted-foreground hover:bg-muted! sm:w-56" onClick={() => setSearchOpen(true)} size="sm" tone="outline"><Search className="size-4 shrink-0" /><span className="hidden truncate sm:inline">Search applications...</span></AppButton>
              <AppButton aria-label="Notifications" size="icon-sm" tone="ghost">
                <Bell />
              </AppButton>
              <AppButton aria-label="Log out" onClick={handleLogout} loading={isLoading} size="icon-sm" tone="ghost"><LogOut /></AppButton>
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
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}><DialogContent><DialogHeader><DialogTitle>Search applications</DialogTitle></DialogHeader><AppInput autoFocus aria-label="Search applications" leading={<Search />} placeholder="Search applications, companies, notes..." /></DialogContent></Dialog>
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
