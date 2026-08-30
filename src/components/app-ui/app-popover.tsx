"use client";

import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

export function AppPopover({
  children,
  description,
  title,
  trigger,
  contentClassName,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  open,
  onOpenChange,
}: {
  children: ReactNode;
  description?: ReactNode;
  title?: ReactNode;
  trigger: ReactElement;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "w-80 gap-2 rounded-md border border-border bg-popover ring-0 shadow-popover",
          contentClassName,
        )}
      >
        {title || description ? (
          <PopoverHeader>
            {title ? <PopoverTitle>{title}</PopoverTitle> : null}
            {description ? <PopoverDescription>{description}</PopoverDescription> : null}
          </PopoverHeader>
        ) : null}
        {children}
      </PopoverContent>
    </Popover>
  );
}
