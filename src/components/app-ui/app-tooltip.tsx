"use client";
import type { ReactElement, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type AppTooltipSize = "sm" | "md" | "lg";

export function AppTooltip({
  children,
  className,
  content,
  size = "sm",
}: {
  children: ReactElement;
  className?: string;
  content: ReactNode;
  size?: AppTooltipSize;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={children} />
        <TooltipContent
          className={cn(
            "rounded-sm! shadow-none!",
            {
              sm: "gap-1 px-2 py-1 text-[11px] leading-4",
              md: "gap-1.5 px-3 py-1.5 text-xs leading-4",
              lg: "gap-1.5 px-3 py-2 text-sm leading-5",
            }[size],
            className,
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
