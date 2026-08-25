"use client";

import { Bell, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppNotificationMenu({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <DropdownMenu onOpenChange={onOpenChange} open={open}>
      <DropdownMenuTrigger
        render={
          <button
            aria-label="Notifications"
            className="inline-flex size-8 items-center justify-center rounded-md border border-transparent bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            type="button"
          />
        }
      >
        <Bell className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between px-2 py-2 text-sm text-foreground">
            <span>Notifications</span>
            <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              All caught up
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="flex flex-col items-center gap-2 px-3 py-7 text-center">
          <span className="grid size-10 place-items-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="size-5" />
          </span>
          <p className="text-sm font-medium text-foreground">You&apos;re all caught up</p>
          <p className="text-xs leading-5 text-muted-foreground">
            New reminders and activity will appear here.
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
