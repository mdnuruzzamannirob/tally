import type { ComponentProps } from "react";

import {
  Tabs,
  TabsContent as PrimitiveTabsContent,
  TabsList as PrimitiveTabsList,
  TabsTrigger as PrimitiveTabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function TabsList({ className, ...props }: ComponentProps<typeof PrimitiveTabsList>) {
  return <PrimitiveTabsList className={cn("rounded-md bg-surface-muted", className)} {...props} />;
}

function TabsTrigger({ className, ...props }: ComponentProps<typeof PrimitiveTabsTrigger>) {
  return <PrimitiveTabsTrigger className={cn("rounded-sm", className)} {...props} />;
}

function TabsContent({ className, ...props }: ComponentProps<typeof PrimitiveTabsContent>) {
  return <PrimitiveTabsContent className={cn("mt-4", className)} {...props} />;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
