import { Suspense } from "react";

import { SocialCallback } from "@/features/auth/SocialCallback";

export default function SocialCallbackPage() {
  return <Suspense fallback={<p aria-live="polite">Completing sign-in…</p>}><SocialCallback /></Suspense>;
}
