"use client";

import Link from "next/link";
import { ArrowLeft, Check, Info, MailCheck } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";

import { AppButton, AppField, toast } from "@/components/app-ui";
import { useResendVerificationMutation, useVerifyEmailMutation } from "@/store/api/auth.api";

import { AuthCard, AuthFooter, AuthHeader, AuthLayout } from "./AuthLayout";
import { EmailInput } from "./AuthControls";

type VerificationState = "pending" | "success" | "failure";

export function VerifyEmailForm() {
  const [state, setState] = useState<VerificationState>("pending");
  const [typedEmail, setTypedEmail] = useState("");
  const queryEmail = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("email") ?? "",
    () => "",
  );
  const email = typedEmail || queryEmail;
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const verified = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token || verified.current) return;
    verified.current = true;
    window.history.replaceState(null, "", "/verify-email");
    void verifyEmail({ token })
      .unwrap()
      .then(() => {
        toast.success("Email verified successfully.");
        setState("success");
      })
      .catch(() => {
        toast.error("This verification link is invalid or has expired.");
        setState("failure");
      });
  }, [verifyEmail]);

  const resend = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email address to resend the verification link.");
      return;
    }
    try {
      await resendVerification({ email }).unwrap();
      toast.success("Verification email sent. Check your inbox and spam folder.");
    } catch {
      toast.error("We couldn't send the verification email. Please try again.");
    }
  };

  if (state === "success")
    return (
      <AuthLayout>
        <AuthCard>
          <AuthHeader
            description="Your account is ready. Sign in to start tracking applications."
            icon={<Check className="size-6" />}
            title="Email verified"
          />
          <Link
            className="flex h-10 w-full items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            href="/login"
          >
            Go to sign in
          </Link>
          <AuthFooter>
            Wrong account?{" "}
            <Link className="font-medium text-primary hover:underline" href="/login">
              Use a different email
            </Link>
          </AuthFooter>
        </AuthCard>
      </AuthLayout>
    );
  if (state === "failure")
    return (
      <AuthLayout>
        <AuthCard>
          <AuthHeader
            description="This verification link is invalid or has expired."
            icon={<Info className="size-6" />}
            title="Verification failed"
          />
          <form className="space-y-4" onSubmit={resend}>
            <AppField label="Email" required>
              <EmailInput
                autoComplete="email"
                onChange={(event) => setTypedEmail(event.target.value)}
                placeholder="you@company.com"
                value={email}
              />
            </AppField>
            <AppButton className="h-10 w-full" loading={isResending} type="submit">
              Resend verification email
            </AppButton>
          </form>
          <AuthFooter>
            <Link className="font-medium text-primary hover:underline" href="/login">
              <span className="inline-flex items-center gap-1.5">
                <ArrowLeft className="size-4" />
                Back to sign in
              </span>
            </Link>
          </AuthFooter>
        </AuthCard>
      </AuthLayout>
    );
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          description={
            email ? (
              <>
                We sent a verification link to{" "}
                <strong className="font-medium text-foreground">{email}</strong>. Click the link to
                activate your account.
              </>
            ) : (
              "Click the verification link in your inbox to activate your account."
            )
          }
          icon={<MailCheck className="size-6" />}
          title="Check your email"
        />
        <div className="space-y-4">
          <form className="space-y-4" onSubmit={resend}>
            {email ? (
              <AppButton className="h-10 w-full" loading={isResending} type="submit">
                Resend verification email
              </AppButton>
            ) : (
              <>
                <AppField label="Email" required>
                  <EmailInput
                    autoComplete="email"
                    onChange={(event) => setTypedEmail(event.target.value)}
                    placeholder="you@company.com"
                    value={email}
                  />
                </AppField>
                <AppButton className="h-10 w-full" loading={isResending} type="submit">
                  Resend verification email
                </AppButton>
              </>
            )}
          </form>
          <p className="text-xs leading-5 text-muted-foreground">
            Didn&apos;t get it? Check your spam folder, or wait 30 seconds before requesting
            another.
          </p>
        </div>
        <AuthFooter>
          <Link className="font-medium text-primary hover:underline" href="/login">
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="size-4" />
              Back to sign in
            </span>
          </Link>
        </AuthFooter>
        {isVerifying ? (
          <p aria-live="polite" className="sr-only">
            Verifying your email…
          </p>
        ) : null}
      </AuthCard>
    </AuthLayout>
  );
}
