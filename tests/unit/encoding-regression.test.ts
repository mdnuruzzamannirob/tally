import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

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
});
