"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, Input } from "@/components/app-ui";
import { useLoginMutation } from "@/store/api/auth.api";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/slices/auth.slice";

const loginSchema = z.object({ email: z.email(), password: z.string().min(8) });
type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>();
  const onSubmit = async (values: LoginValues) => {
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setError("Enter a valid email and password.");
      return;
    }
    try {
      const session = await login(parsed.data).unwrap();
      dispatch(setSession(session));
      router.replace("/dashboard");
    } catch {
      setError("Unable to sign in with those credentials.");
    }
  };
  return (
    <form className="stack" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1>Sign in to Tally</h1>
      <label>
        Email
        <Input type="email" autoComplete="email" {...register("email")} />
      </label>
      <label>
        Password
        <Input type="password" autoComplete="current-password" {...register("password")} />
      </label>
      {(error || errors.email || errors.password) && (
        <p role="alert">{error ?? "Please complete all fields."}</p>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
