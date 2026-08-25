"use client";
import type { ReactElement, ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export type AppDropdownItem = {
  disabled?: boolean;
  icon?: ReactNode;
  label: ReactNode;
  onSelect?: () => void;
  separatorBefore?: boolean;
  variant?: "default" | "destructive";
};
export function AppDropdownMenu({
  items,
  trigger,
}: {
  items: readonly AppDropdownItem[];
  trigger: ReactElement;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="min-w-48 rounded-md border border-border p-1 shadow-popover ring-0"
      >
        {items.map((item, index) => (
          <span key={index}>
            {item.separatorBefore ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem
              className="rounded-md"
              disabled={item.disabled}
              onClick={item.onSelect}
              variant={item.variant}
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          </span>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
