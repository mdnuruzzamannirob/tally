import { describe, expect, it } from "vitest";
import { getAuthRedirect } from "@/lib/auth-redirect";

describe("post-login redirects", () => {
  const origin = "https://tally.example";
  it("preserves internal paths, query parameters and fragments", () => {
    expect(getAuthRedirect("/applications?status=APPLIED#recent", origin)).toBe(
      "/applications?status=APPLIED#recent",
    );
  });
  it.each([
    null,
    "https://other.example",
    "//other.example",
    "/\\other.example",
    "/\n/other.example",
    "javascript:alert(1)",
  ])("rejects external redirect %j", (value) => {
    expect(getAuthRedirect(value, origin)).toBe("/dashboard");
  });
});
