"use client";

import { Monitor, Moon, Sun } from "lucide-react";
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

export function AppThemeMenu({
  onThemeChange,
  resolvedTheme,
  theme,
}: {
  onThemeChange: (theme: string) => void;
  resolvedTheme?: string;
  theme?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label="Choose theme"
            className="inline-flex size-8 items-center justify-center rounded-md border border-transparent bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            type="button"
          />
        }
      >
        {resolvedTheme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-md border-border p-2 shadow-popover">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2 text-sm text-foreground">
            Appearance
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup onValueChange={onThemeChange} value={theme ?? "system"}>
          <DropdownMenuRadioItem className="py-2" value="light">
            <Sun /> Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="py-2" value="dark">
            <Moon /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="py-2" value="system">
            <Monitor /> System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
