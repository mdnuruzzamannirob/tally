import type { ComponentPropsWithoutRef } from "react";

import { Label as PrimitiveLabel } from "@/components/ui/label";

export function Label(props: ComponentPropsWithoutRef<typeof PrimitiveLabel>) {
  return <PrimitiveLabel {...props} />;
}
