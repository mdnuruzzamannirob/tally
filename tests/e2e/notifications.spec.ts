import { expect, test } from "@playwright/test";

test("notification inbox is an anchored popover that closes with Escape", async ({ page }) => {
  const success = (data: unknown) => ({ success: true, message: "OK", data });
  const user = {
    id: "preview-user",
    name: "Alex Morgan",
    email: "alex@example.test",
    emailVerified: true,
    hasPassword: true,
    providers: [],
    preferences: {
      theme: "light",
      defaultLandingPage: "dashboard",
      timeZone: "UTC",
      notificationsEnabled: true,
    },
  };
  let unread = 1;
  await page.route("**/auth/refresh", (route) =>
    route.fulfill({ json: success({ accessToken: "preview-token" }) }),
  );
  await page.route("**/auth/me", (route) => route.fulfill({ json: success(user) }));
  await page.route("**/dashboard", async (route) => {
    if (route.request().resourceType() === "document") return route.continue();
    await route.fulfill({
      json: success({
        totalApplications: 0,
        activeApplications: 0,
        offers: 0,
        scheduledInterviews: 0,
        statusCounts: {},
        followUps: { overdueCount: 0, todayCount: 0, overdue: [], today: [] },
        upcomingInterviews: [],
        recentApplications: [],
      }),
    });
  });
  await page.route("**/notifications", (route) =>
    route.fulfill({
      json: success({
        unread,
        items: [
          {
            id: "n1",
            title: "Upcoming interview",
            body: "Your interview for Product Designer at Acme is tomorrow at 10:00 AM.",
            href: "/applications/a1",
            readAt: unread ? null : new Date().toISOString(),
            createdAt: new Date(Date.now() - 300_000).toISOString(),
          },
        ],
      }),
    }),
  );
  await page.route("**/notifications/read-all", async (route) => {
    unread = 0;
    await route.fulfill({ json: success({}) });
  });
  await page.goto("/dashboard");
  const trigger = page.getByRole("button", { name: "Notifications, 1 unread" });
  await trigger.click();
  const panel = page.locator('[data-slot="popover-content"]');
  await expect(panel).toBeVisible();
  await expect(panel.getByText("Upcoming interview")).toBeVisible();
  await expect(page.locator('[data-slot="dialog-overlay"]')).toHaveCount(0);
  await page.screenshot({ path: "test-results/notification-popover-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(panel).toBeVisible();
  await expect
    .poll(async () => {
      const bounds = await panel.boundingBox();
      return Boolean(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 390);
    })
    .toBe(true);
  await page.screenshot({ path: "test-results/notification-popover-mobile.png" });
  await panel.getByRole("button", { name: "Mark all as read" }).click();
  await expect(page.getByRole("button", { name: "Notifications", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(page.getByRole("button", { name: "Notifications", exact: true })).toBeFocused();
});
