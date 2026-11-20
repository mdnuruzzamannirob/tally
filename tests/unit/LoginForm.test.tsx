import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  forgot: vi.fn(),
  reset: vi.fn(),
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
  useSearchParams: () => mocks.searchParams,
}));

vi.mock("next/font/google", () => ({
  Pacifico: () => ({ className: "font-pacifico", variable: "--font-pacifico" }),
}));

vi.mock("@/store/hooks", () => ({ useAppDispatch: () => mocks.dispatch }));

vi.mock("@/store/api/auth.api", () => ({
  useLoginMutation: () => [mocks.login, { isLoading: false }],
  useForgotPasswordMutation: () => [mocks.forgot, { isLoading: false }],
  useRegisterMutation: () => [mocks.register, { isLoading: false }],
  useResetPasswordMutation: () => [mocks.reset, { isLoading: false }],
}));

import {
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
  ResetPasswordForm,
} from "@/features/auth/AuthForms";

describe("login form", () => {
  afterEach(cleanup);

  beforeEach(() => {
    mocks.dispatch.mockReset();
    mocks.login.mockReset();
    mocks.register.mockReset();
    mocks.forgot.mockReset();
    mocks.reset.mockReset();
    mocks.replace.mockReset();
    mocks.searchParams = new URLSearchParams();
    window.history.replaceState(null, "", "/");
  });

  it("shows field validation for missing credentials", async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Enter a valid email address.")).toBeVisible();
    expect(screen.getByText("Password must contain at least 8 characters.")).toBeVisible();
    expect(mocks.login).not.toHaveBeenCalled();
  });

  it("stores a successful session and redirects to the default dashboard", async () => {
    const session = { accessToken: "test-access-token", user: { id: "user-1" } };
    mocks.login.mockReturnValue({ unwrap: vi.fn().mockResolvedValue(session) });
    render(<LoginForm />);

    fireEvent.change(screen.getByRole("textbox", { name: /Email/ }), {
      target: { value: "person@example.test" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPass123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mocks.login).toHaveBeenCalledWith({
        email: "person@example.test",
        password: "StrongPass123!",
      });
      expect(mocks.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "auth/setSession", payload: session }),
      );
      expect(mocks.replace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("registers an account after validating password and terms", async () => {
    mocks.register.mockReturnValue({ unwrap: vi.fn().mockResolvedValue({}) });
    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("Alex Morgan"), {
      target: { value: " Alex Morgan " },
    });
    fireEvent.change(screen.getByPlaceholderText("you@company.com"), {
      target: { value: "person@example.test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "StrongPass123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat your password"), {
      target: { value: "StrongPass123!" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /I agree to the Terms/ }));
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(mocks.register).toHaveBeenCalledWith({
        name: "Alex Morgan",
        email: "person@example.test",
        password: "StrongPass123!",
      });
      expect(mocks.replace).toHaveBeenCalledWith("/verify-email?email=person%40example.test");
    });
  });

  it("submits a valid password-recovery email", async () => {
    mocks.forgot.mockReturnValue({ unwrap: vi.fn().mockResolvedValue({}) });
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("you@company.com"), {
      target: { value: "person@example.test" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send reset link" }));

    await waitFor(() => {
      expect(mocks.forgot).toHaveBeenCalledWith({ email: "person@example.test" });
    });
  });

  it("uses the reset token from the URL and submits matching new passwords", async () => {
    window.history.replaceState(null, "", "/reset-password?token=reset-token");
    mocks.reset.mockReturnValue({ unwrap: vi.fn().mockResolvedValue({}) });
    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "StrongPass123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat your password"), {
      target: { value: "StrongPass123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset password" }));

    await waitFor(() => {
      expect(mocks.reset).toHaveBeenCalledWith({
        token: "reset-token",
        password: "StrongPass123!",
      });
    });
  });
});
