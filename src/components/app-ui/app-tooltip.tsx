"use client";
import type { ReactElement, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export function AppTooltip({ children, content }: { children: ReactElement; content: ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={children} />
        <TooltipContent className="rounded-sm shadow-none!">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
