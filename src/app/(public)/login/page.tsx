import Link from "next/link";
import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <p>
        <Link href="/forgot-password">Forgot password?</Link> ·{" "}
        <Link href="/register">Create an account</Link>
      </p>
    </>
  );
}
