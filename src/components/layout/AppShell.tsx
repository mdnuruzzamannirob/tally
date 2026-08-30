"use client";
import { AppAvatar, AppButton, AppSearchDialog, AppThemeMenu } from "@/components/app-ui";
import { AppConfirmDialog } from "@/components/app-ui/app-confirm-dialog";
import { TallyLogo } from "@/components/shared/TallyLogo";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/store/api/auth.api";
import { baseApi } from "@/store/api/base-api";
import { useUpdatePreferencesMutation } from "@/store/api/users.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearSession, setCurrentUser } from "@/store/slices/auth.slice";
import {
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { InstallPrompt } from "./InstallPrompt";
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
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logout, { isLoading }] = useLogoutMutation();
  const [updatePreferences] = useUpdatePreferencesMutation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);
  const [noticeHeight, setNoticeHeight] = useState(0);
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
  const closeDrawer = () => setDrawerOpen(false);
  const handleThemeChange = (nextTheme: string) => {
    if (nextTheme !== "light" && nextTheme !== "dark" && nextTheme !== "system") return;
    setTheme(nextTheme);
    void updatePreferences({ theme: nextTheme })
      .unwrap()
      .then((updatedUser) => dispatch(setCurrentUser(updatedUser)))
      .catch(() => undefined);
  };
  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // The local session is cleared even if the server session already expired.
    } finally {
      dispatch(clearSession());
      dispatch(baseApi.util.resetApiState());
      setConfirmLogout(false);
      router.replace("/login");
    }
  };
  useLayoutEffect(() => {
    const element = noticeRef.current;
    if (!element) return;
    const syncHeight = () => setNoticeHeight(element.getBoundingClientRect().height);
    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className="min-h-dvh bg-background"
      style={{ "--shell-notice-height": `${noticeHeight}px` } as CSSProperties}
    >
      <a
        className="fixed top-2 left-2 z-70 -translate-y-20 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0"
        href="#main-content"
      >
        Skip to content
      </a>
      <div className="fixed inset-x-0 top-0 z-50 space-y-0 bg-background" ref={noticeRef}>
        <OfflineBanner />
        <InstallPrompt />
      </div>
      <div className="min-h-dvh bg-background" style={{ paddingTop: noticeHeight }}>
        {drawerOpen ? (
          <button
            aria-label="Close navigation"
            className="fixed inset-x-0 bottom-0 z-30 bg-foreground/50 lg:hidden"
            onClick={closeDrawer}
            style={{ top: "var(--shell-notice-height)" }}
            type="button"
          />
        ) : null}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-65 -translate-x-full flex-col border-r border-border bg-card transition-transform duration-200 lg:w-60 lg:translate-x-0",
            drawerOpen && "translate-x-0",
          )}
          style={{ top: "var(--shell-notice-height)" }}
        >
          <Link
            className="flex h-15 shrink-0 items-center gap-2 border-b border-border px-4 text-lg font-semibold tracking-tight"
            href="/dashboard"
          >
            <TallyLogo className="text-2xl" />
          </Link>
          <nav aria-label="Main navigation" className="mt-5 space-y-1 px-3">
            {navigation.map(({ href, icon: Icon, label }) => (
              <Link
                className={cn(
                  "flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                  isActive(href) &&
                    "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
                )}
                href={href}
                onClick={closeDrawer}
                key={href}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-border p-3">
            <Link
              className="flex items-center gap-3 rounded-md p-2 hover:bg-muted"
              href="/settings"
            >
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
        <div className="min-w-0 pb-18 lg:pl-60 lg:pb-0">
          <header
            className="fixed inset-x-0 z-20 h-15 border-b border-border bg-card/95 backdrop-blur lg:left-60 lg:bg-card"
            style={{ top: "var(--shell-notice-height)" }}
          >
            <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8">
              <Link className="flex items-center gap-2 font-semibold lg:hidden" href="/dashboard">
                <TallyLogo className="text-xl" />
              </Link>
              <h1 className="hidden text-base font-semibold lg:block">{pageName}</h1>
              <div className="ml-auto flex items-center gap-2">
                <AppButton
                  aria-label="Open search"
                  className="h-8 w-8 justify-center gap-2 overflow-hidden border-border! bg-background! px-2.5 text-muted-foreground hover:bg-muted! sm:w-56 sm:justify-start"
                  onClick={() => setSearchOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSearchOpen(true);
                  }}
                  size="sm"
                  tone="outline"
                >
                  <Search className="size-4 shrink-0" />
                  <span className="hidden truncate sm:inline">Search applications...</span>
                </AppButton>
                <Link
                  aria-label="Add application"
                  className="hidden h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary-hover sm:inline-flex"
                  href="/applications?create=1"
                >
                  <span className="hidden md:inline">Add application</span>
                  <span className="md:hidden">Add</span>
                </Link>

                <AppThemeMenu
                  onThemeChange={handleThemeChange}
                  resolvedTheme={resolvedTheme}
                  theme={theme}
                />
                <AppButton
                  aria-label="Log out"
                  className="text-destructive hover:bg-destructive/10! hover:text-destructive!"
                  onClick={() => setConfirmLogout(true)}
                  loading={isLoading}
                  size="icon-sm"
                  tone="ghost"
                >
                  <LogOut className="size-4" />
                </AppButton>
              </div>
            </div>
          </header>
          <main
            className="w-full px-4 pb-6 pt-21 sm:px-6 lg:px-8 lg:pb-8 lg:pt-23"
            id="main-content"
          >
            {children}
          </main>
        </div>
        <AppSearchDialog onOpenChange={setSearchOpen} open={searchOpen} />
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
              onClick={closeDrawer}
              key={href}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
