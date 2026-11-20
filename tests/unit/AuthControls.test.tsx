import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EmailInput, PasswordInput, PasswordStrength, SocialButtons } from "@/features/auth/AuthControls";

describe("auth controls", () => {
  it("provides email semantics and toggles password visibility accessibly", () => {
    render(
      <>
        <EmailInput aria-label="Email address" />
        <PasswordInput aria-label="Password" />
      </>,
    );

    expect(screen.getByRole("textbox", { name: "Email address" })).toHaveAttribute("type", "email");
    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");
  });

  it("exposes the password strength score as an accessible meter", () => {
    const { rerender } = render(<PasswordStrength password="" />);
    const meter = screen.getByRole("meter", { name: "Password strength" });
    expect(meter).toHaveAttribute("aria-valuenow", "0");

    rerender(<PasswordStrength password="Strong123!" />);
    expect(meter).toHaveAttribute("aria-valuenow", "4");
    expect(meter).toHaveAttribute("aria-valuetext", "4 of 4 strength requirements met");
  });

  it("reports which social provider was selected", () => {
    const onProvider = vi.fn();
    render(<SocialButtons onProvider={onProvider} />);

    fireEvent.click(screen.getByRole("button", { name: "Google" }));
    fireEvent.click(screen.getByRole("button", { name: "GitHub" }));

    expect(onProvider.mock.calls).toEqual([["google"], ["github"]]);
  });
});
