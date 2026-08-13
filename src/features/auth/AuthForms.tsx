"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppButton, AppCheckbox, AppField, AppInput, toast } from "@/components/app-ui";
import { useAppDispatch } from "@/store/hooks";
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
  useResetPasswordMutation,
} from "@/store/api/auth.api";
import { setSession } from "@/store/slices/auth.slice";

import { AuthCard, AuthDivider, AuthFooter, AuthHeader, AuthLayout } from "./AuthLayout";
import { EmailInput, PasswordInput, PasswordStrength, SocialButtons } from "./AuthControls";

const emailSchema = z.string().trim().email("Enter a valid email address.");
const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(72, "Password must not exceed 72 characters.");
const loginSchema = z.object({ email: emailSchema, password: passwordSchema });
const registerSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: emailSchema,
  password: passwordSchema,
});

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string")
      return data.message;
  }
  return fallback;
}

function SocialLogin() {
  const startProvider = (provider: "google" | "github") => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) window.location.replace(`${apiUrl}/auth/${provider}`);
  };
  return <SocialButtons onProvider={startProvider} />;
}

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [remember, setRemember] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), mode: "onBlur" });

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      const session = await login(values).unwrap();
      dispatch(setSession(session));
      const redirect = new URLSearchParams(window.location.search).get("redirect");
      router.replace(redirect?.startsWith("/") ? redirect : "/dashboard");
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, "Unable to sign in with those credentials."));
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          description="Track your job search, interviews & follow-ups."
          title="Sign in to Tally"
        />
        <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
          <AppField error={errors.email?.message} label="Email" required>
            <AppInput
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              placeholder="you@company.com"
              {...register("email")}
            />
          </AppField>
          <AppField
            error={errors.password?.message}
            label={
              <span className="flex w-full items-center justify-between">
                <span>
                  Password <span className="text-destructive">*</span>
                </span>
                <Link
                  className="text-xs font-normal text-muted-foreground hover:text-primary"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
              </span>
            }
          >
            <PasswordInput
              aria-invalid={Boolean(errors.password)}
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register("password")}
            />
          </AppField>
          <AppCheckbox
            checked={remember}
            label="Keep me signed in for 30 days"
            onCheckedChange={(value) => setRemember(value === true)}
            size="sm"
          />
          <AppButton className="h-10 w-full" loading={isLoading} type="submit">
            {isLoading ? "Signing in…" : "Sign in"}
          </AppButton>
          <AuthDivider />
          <SocialLogin />
        </form>
        <AuthFooter>
          Don&apos;t have an account?{" "}
          <Link className="font-medium text-primary hover:underline" href="/register">
            Create one
          </Link>
        </AuthFooter>
      </AuthCard>
    </AuthLayout>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [terms, setTerms] = useState(false);
  const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });
  const passwordField = register("password");

  const onSubmit = async (values: { name?: string; email: string; password: string }) => {
    if (!terms) {
      toast.error("Please agree to the Terms and Privacy Policy.");
      return;
    }
    try {
      const payload = { ...values, name: values.name?.trim() || undefined };
      await registerUser(payload).unwrap();
      router.replace(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (submitError) {
      toast.error(
        getErrorMessage(submitError, "We couldn't create your account. Please try again."),
      );
    }
  };

  return (
    <AuthLayout>
      <AuthCard wide>
        <AuthHeader
          description="Start tracking your job search in minutes."
          title="Create your account"
        />
        <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
          <AppField error={errors.name?.message} label="Full name">
            <AppInput autoComplete="name" placeholder="Alex Morgan" {...register("name")} />
          </AppField>
          <AppField error={errors.email?.message} label="Email" required>
            <EmailInput
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              placeholder="you@company.com"
              {...register("email")}
            />
          </AppField>
          <AppField
            description={
              errors.password
                ? undefined
                : "Use at least 8 characters, one uppercase letter, one number, and one special character."
            }
            error={errors.password?.message}
            label="Password"
            required
          >
            <PasswordInput
              {...passwordField}
              aria-invalid={Boolean(errors.password)}
              autoComplete="new-password"
              onChange={(event) => {
                setPassword(event.target.value);
                passwordField.onChange(event);
              }}
              placeholder="Create a password"
            />
            <PasswordStrength password={password} />
          </AppField>
          <AppCheckbox
            checked={terms}
            label={
              <span>
                I agree to the{" "}
                <Link className="text-primary hover:underline" href="#">
                  Terms
                </Link>{" "}
                &{" "}
                <Link className="text-primary hover:underline" href="#">
                  Privacy Policy
                </Link>
              </span>
            }
            onCheckedChange={(value) => setTerms(value === true)}
            size="sm"
          />
          <AppButton className="h-10 w-full" loading={isLoading} type="submit">
            {isLoading ? "Creating account…" : "Create account"}
          </AppButton>
          <AuthDivider />
          <SocialLogin />
        </form>
        <AuthFooter>
          Already have an account?{" "}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Sign in
          </Link>
        </AuthFooter>
      </AuthCard>
    </AuthLayout>
  );
}

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }
    try {
      await forgotPassword({ email: parsed.data }).unwrap();
      toast.success("If an account exists for this email, a reset link has been sent.");
    } catch (submitError) {
      toast.error(
        getErrorMessage(submitError, "We couldn't send the reset link. Please try again."),
      );
    }
  };
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          description="Enter your email and we'll send you a reset link."
          title="Forgot your password?"
        />
        <form className="space-y-4" noValidate onSubmit={submit}>
          <AppField label="Email" required>
            <EmailInput
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              value={email}
            />
          </AppField>
          <AppButton className="h-10 w-full" loading={isLoading} type="submit">
            {isLoading ? "Sending…" : "Send reset link"}
          </AppButton>
        </form>
        <AuthFooter>
          <Link className="font-medium text-primary hover:underline" href="/login">
            ← Back to sign in
          </Link>
        </AuthFooter>
      </AuthCard>
    </AuthLayout>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Enter a valid password.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      toast.error("This reset link is invalid or has expired.");
      return;
    }
    try {
      await resetPassword({ token, password }).unwrap();
      toast.success("Password reset successfully. Taking you to sign in…");
      window.setTimeout(() => router.replace("/login"), 900);
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, "This reset link is invalid or has expired."));
    }
  };
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          description="Choose a strong password you don't use anywhere else."
          title="Set a new password"
        />
        <form className="space-y-4" noValidate onSubmit={submit}>
          <AppField
            description="Use at least 8 characters, one uppercase letter, one number, and one special character."
            label="New password"
            required
          >
            <PasswordInput
              autoComplete="new-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              value={password}
            />
          </AppField>
          <PasswordStrength password={password} />
          <AppField
            error={confirm && password !== confirm ? "Passwords don't match." : undefined}
            label="Confirm new password"
            required
          >
            <PasswordInput
              aria-invalid={Boolean(confirm && password !== confirm)}
              autoComplete="new-password"
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="Repeat your password"
              value={confirm}
            />
          </AppField>
          <AppButton className="h-10 w-full" loading={isLoading} type="submit">
            {isLoading ? "Resetting password…" : "Reset password"}
          </AppButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
