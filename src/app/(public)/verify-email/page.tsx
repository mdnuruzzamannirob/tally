import type { Metadata } from "next";
import { VerifyEmailForm } from "@/features/auth/VerifyEmailForm";

export const metadata: Metadata = { referrer: "no-referrer" };

export default function VerifyEmailPage() {
  return <VerifyEmailForm />;
}
