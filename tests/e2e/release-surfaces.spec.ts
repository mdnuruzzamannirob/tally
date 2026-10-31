import { expect, test } from "@playwright/test";

test.describe("release public surfaces", () => {
  const pages = [
    ["/register", "Create your account"],
    ["/forgot-password", "Forgot your password?"],
    ["/reset-password", "Set a new password"],
    ["/verify-email", "Check your email"],
  ] as const;

  for (const [path, heading] of pages) {
    test(`${path} is reachable`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    });
  }

  test("login form exposes accessible credentials and submit controls", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});
