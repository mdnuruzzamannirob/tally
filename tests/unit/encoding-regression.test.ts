import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Pacifico: () => ({ className: "pacifico" }),
}));

import { AuthHeader } from "@/features/auth/AuthLayout";

const readSource = (relativePath: string) =>
  readFileSync(resolve(__dirname, "../..", relativePath), "utf8");

describe("source encoding regression", () => {
  it("does not contain mojibake artifacts in auth and install text", () => {
    const installPrompt = readSource("src/components/layout/InstallPrompt.tsx");
    const authForms = readSource("src/features/auth/AuthForms.tsx");
    const protectedRoute = readSource("src/features/auth/ProtectedRoute.tsx");

    const corruptedPattern = /(Ã|Â|â€|Ã¢|Ãƒ|â€˜|â€™)/i;

    expect(installPrompt).not.toMatch(corruptedPattern);
    expect(authForms).not.toMatch(corruptedPattern);
    expect(protectedRoute).not.toMatch(corruptedPattern);
  });

  it("uses the shared Tally logo in the default auth header fallback", () => {
    render(createElement(AuthHeader, { description: "Welcome back", title: "Secure sign in" }));

    expect(screen.getByText("Tally")).toBeInTheDocument();
  });
});
