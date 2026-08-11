import { http, HttpResponse } from "msw";

import type { ApiSuccess } from "@/types/api.types";
import type { AuthSession, CurrentUser } from "@/types/auth.types";

const user: CurrentUser = {
  id: "user-test-1",
  name: "Test User",
  email: "test@example.com",
  emailVerified: true,
};

const session: AuthSession = { accessToken: "test-access-token", user };

const success = <T>(data: T, message: string): ApiSuccess<T> => ({
  success: true,
  message,
  data,
});

export const handlers = [
  http.post("*/auth/login", async () =>
    HttpResponse.json(success(session, "Signed in successfully.")),
  ),
  http.get("*/auth/me", async () => HttpResponse.json(success({ user }, "Current user loaded."))),
  http.post("*/auth/refresh", async () =>
    HttpResponse.json(success({ accessToken: session.accessToken }, "Session refreshed.")),
  ),
  http.post("*/auth/logout", async () =>
    HttpResponse.json(success(null, "Signed out successfully.")),
  ),
];
