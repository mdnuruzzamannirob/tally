import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Pacifico: () => ({ className: "font-pacifico", variable: "--font-pacifico" }),
}));

import { AuthCard, AuthDivider, AuthFooter, AuthHeader, AuthLayout } from "@/features/auth/AuthLayout";

describe("auth layout primitives", () => {
  it("provides a main landmark, card, title and footer for auth screens", () => {
    render(
      <AuthLayout>
        <AuthCard>
          <AuthHeader title="Create your account" description="Start tracking applications." />
          <AuthFooter>
            <a href="/login">Sign in</a>
          </AuthFooter>
        </AuthCard>
      </AuthLayout>,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Create your account" })).toBeVisible();
    expect(screen.getByText("Start tracking applications.")).toBeVisible();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login");
  });

  it("renders an optional header icon and social divider", () => {
    render(
      <>
        <AuthHeader
          title="Connect account"
          description="Choose a provider."
          icon={<span data-testid="provider-icon">Provider</span>}
        />
        <AuthDivider />
      </>,
    );

    expect(screen.getByTestId("provider-icon")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Connect account" })).toBeVisible();
    expect(screen.getByText("or continue with")).toBeVisible();
  });
});
