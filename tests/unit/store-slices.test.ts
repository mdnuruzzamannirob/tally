import { describe, expect, it } from "vitest";

import authReducer, {
  clearSession,
  setAccessToken,
  setCurrentUser,
  setInitialized,
  setSession,
} from "@/store/slices/auth.slice";
import uiReducer, { setSidebarOpen, setTheme } from "@/store/slices/ui.slice";

const user = {
  id: "user-1",
  email: "user@example.test",
  name: "User",
  emailVerified: true,
  hasPassword: true,
  providers: ["password"],
  preferences: {
    theme: "dark" as const,
    defaultLandingPage: "dashboard" as const,
    timeZone: "UTC",
    notificationsEnabled: true,
  },
};

describe("auth state transitions", () => {
  it("sets session and user state", () => {
    const initial = authReducer(undefined, { type: "init" });
    const withSession = authReducer(
      initial,
      setSession({ accessToken: "token", user }),
    );
    expect(withSession).toMatchObject({ accessToken: "token", user, initialized: true });

    expect(authReducer(initial, setCurrentUser(user))).toMatchObject({ user, initialized: true });
    expect(authReducer(initial, setAccessToken("next-token")).accessToken).toBe("next-token");
  });

  it("marks the session initialized and clears credentials", () => {
    const initialized = authReducer(undefined, setInitialized());
    expect(initialized.initialized).toBe(true);
    expect(authReducer(initialized, clearSession())).toEqual({
      accessToken: null,
      user: null,
      initialized: true,
    });
  });
});

describe("UI state transitions", () => {
  it("updates sidebar visibility and theme", () => {
    const initial = uiReducer(undefined, { type: "init" });
    expect(uiReducer(initial, setSidebarOpen(true)).sidebarOpen).toBe(true);
    expect(uiReducer(initial, setTheme("dark")).theme).toBe("dark");
    expect(uiReducer(initial, setTheme("light")).theme).toBe("light");
  });
});
