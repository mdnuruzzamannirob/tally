import type { ComponentProps } from "react";
import { Toaster } from "@/components/ui/sonner";

export type AppToasterProps = ComponentProps<typeof Toaster>;

export function AppToaster(props: AppToasterProps) {
  return <Toaster {...props} />;
}
