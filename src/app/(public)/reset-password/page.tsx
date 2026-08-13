import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/AuthForms";

export const metadata: Metadata = { referrer: "no-referrer" };

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
