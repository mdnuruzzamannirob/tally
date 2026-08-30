import type { ComponentProps } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

export type AppTooltipProviderProps = ComponentProps<typeof TooltipProvider>;

export function AppTooltipProvider({ children, ...props }: AppTooltipProviderProps) {
  return <TooltipProvider {...props}>{children}</TooltipProvider>;
}
