"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState, type ComponentProps } from "react";

import { AppButton, AppInput } from "@/components/app-ui";

export function PasswordInput(props: ComponentProps<typeof AppInput>) {
  const [visible, setVisible] = useState(false);
  return (
    <AppInput
      {...props}
      type={visible ? "text" : "password"}
      leading={<LockKeyhole />}
      trailing={
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          className="rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setVisible((value) => !value)}
          type="button"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M22.5 12.27c0-.78-.07-1.53-.2-2.27H12v4.3h5.92a5.07 5.07 0 0 1-2.2 3.32v2.76h3.55c2.07-1.91 3.23-4.72 3.23-8.11z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.76c-.98.66-2.24 1.06-3.73 1.06-2.87 0-5.3-1.94-6.16-4.54H2.18v2.84A11 11 0 0 0 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.7 7.32 9.13 5.38 12 5.38z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.26 5.65.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55A11 11 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export function EmailInput(props: ComponentProps<typeof AppInput>) {
  return <AppInput {...props} leading={<Mail />} />;
}

export function SocialButtons({
  onProvider,
}: {
  onProvider?: (provider: "google" | "github") => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <AppButton
        className="h-10 bg-card! text-foreground!"
        onClick={() => onProvider?.("google")}
        tone="outline"
        type="button"
      >
        <GoogleIcon /> Google
      </AppButton>
      <AppButton
        className="h-10 bg-card! text-foreground!"
        onClick={() => onProvider?.("github")}
        tone="outline"
        type="button"
      >
        <GitHubIcon /> GitHub
      </AppButton>
    </div>
  );
}

export function PasswordStrength({ password }: { password: string }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  return (
    <div aria-live="polite" className="space-y-2">
      <div aria-label="Password strength indicator" className="flex gap-1">
        {[0, 1, 2, 3].map((bar) => (
          <span
            className={`h-1.5 flex-1 rounded-full ${bar < score ? "bg-success" : "bg-muted"}`}
            key={bar}
          />
        ))}
      </div>
    </div>
  );
}
