import type { ComponentProps } from "react";

import { Skeleton as PrimitiveSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: ComponentProps<typeof PrimitiveSkeleton>) {
  return <PrimitiveSkeleton className={cn("rounded-md bg-surface-muted", className)} {...props} />;
}
