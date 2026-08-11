import type { TextareaHTMLAttributes } from "react";

import { Textarea as PrimitiveTextarea } from "@/components/ui/textarea";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <PrimitiveTextarea {...props} />;
}
