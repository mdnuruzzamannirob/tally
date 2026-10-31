import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationCenter } from "@/components/layout/NotificationCenter";

const mocks = vi.hoisted(() => ({ query: vi.fn(), read: vi.fn(), refetch: vi.fn() }));
vi.mock("@/store/hooks", () => ({ useAppSelector: () => ({ id: "user-1" }) }));
vi.mock("@/store/api/notifications.api", () => ({
  useNotificationsQuery: mocks.query,
  useReadNotificationMutation: () => [mocks.read, { isLoading: false }],
}));
afterEach(cleanup);
beforeEach(() => {
  mocks.read.mockReset().mockReturnValue({ unwrap: () => Promise.resolve({}) });
  mocks.refetch.mockReset();
  mocks.query.mockReturnValue({
    data: {
      unread: 1,
      items: [
        {
          id: "n1",
          title: "Upcoming interview",
          body: "Interview tomorrow",
          href: "/applications/a1",
          readAt: null,
          createdAt: "2026-10-31T04:00:00Z",
        },
      ],
    },
    refetch: mocks.refetch,
  });
});
describe("notification inbox", () => {
  it("shows unread alerts and lets the user mark them read", async () => {
    render(<NotificationCenter />);
    fireEvent.click(screen.getByRole("button", { name: "Notifications, 1 unread" }));
    expect(await screen.findByRole("link", { name: /Upcoming interview/ })).toHaveAttribute(
      "href",
      "/applications/a1",
    );
    fireEvent.click(screen.getByRole("button", { name: "Mark all as read" }));
    await waitFor(() => expect(mocks.read).toHaveBeenCalledWith(undefined));
    expect(mocks.refetch).toHaveBeenCalled();
  });
  it("shows a safe load error with retry instead of an empty inbox", async () => {
    mocks.query.mockReturnValue({
      error: { status: 500, data: { message: "database secret" } },
      refetch: mocks.refetch,
    });
    render(<NotificationCenter />);
    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load notifications.");
    expect(screen.queryByText("database secret")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(mocks.refetch).toHaveBeenCalledTimes(2);
  });
});
