import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  routerReplace: vi.fn(),
  auth: { initialized: false, user: null as null | Record<string, unknown> },
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.routerReplace }) }));
vi.mock("@/store/hooks", () => ({
  useAppSelector: (selector: (state: { auth: typeof mocks.auth }) => unknown) =>
    selector({ auth: mocks.auth }),
}));
vi.mock("@/features/auth/AuthRouteLoading", () => ({
  AuthRouteLoading: () => <p role="status">Checking session</p>,
}));

import { PublicOnlyRoute } from "@/features/auth/PublicOnlyRoute";

afterEach(cleanup);
beforeEach(() => {
  mocks.routerReplace.mockReset();
  mocks.auth = { initialized: false, user: null };
});

describe("public route session behavior", () => {
  it("renders the public form while the session check is pending", () => {
    render(
      <PublicOnlyRoute>
        <h1>Sign in</h1>
      </PublicOnlyRoute>,
    );

    expect(screen.getByRole("heading", { name: "Sign in" })).toBeVisible();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("redirects a verified session to its preferred landing page", async () => {
    mocks.auth = {
      initialized: true,
      user: {
        emailVerified: true,
        preferences: { defaultLandingPage: "applications" },
      },
    };

    render(
      <PublicOnlyRoute>
        <h1>Sign in</h1>
      </PublicOnlyRoute>,
    );

    expect(screen.queryByRole("heading", { name: "Sign in" })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Checking session");
    await waitFor(() => expect(mocks.routerReplace).toHaveBeenCalledWith("/applications"));
  });
});
