import { describe, expect, it } from "vitest";

describe("MSW test server", () => {
  it("serves the shared auth mock handlers", async () => {
    const response = await fetch("http://localhost/api/v1/auth/me");
    const body = (await response.json()) as {
      success: boolean;
      data: { user: { email: string } };
    };

    expect(response.ok).toBe(true);
    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe("test@example.com");
  });
});
