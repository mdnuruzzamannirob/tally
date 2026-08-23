import type { ReactNode } from "react";
import { PublicOnlyRoute } from "@/features/auth/PublicOnlyRoute";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicOnlyRoute><main>{children}</main></PublicOnlyRoute>;
}
