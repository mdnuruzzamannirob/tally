import type { ComponentProps } from "react";

import { Badge as PrimitiveBadge } from "@/components/ui/badge";

export function Badge(props: ComponentProps<typeof PrimitiveBadge>) {
  return <PrimitiveBadge {...props} />;
}
