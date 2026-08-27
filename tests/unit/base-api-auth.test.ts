// @vitest-environment node

import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000";
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
});

import type { ApiFailure, ApiSuccess } from "@/types/api.types";
import { authApi } from "@/store/api/auth.api";
import { makeStore } from "@/store";
import { clearSession, setSession } from "@/store/slices/auth.slice";
import { server } from "../mocks/server";

const user = {
  id: "user-auth-test",
  name: "Auth Test",
  email: "auth@example.com",
  emailVerified: true,
  hasPassword: true,
  providers: [],
  preferences: {
    theme: "system" as const,
    defaultLandingPage: "dashboard" as const,
    timeZone: "UTC",
    notificationsEnabled: false,
  },
};

const success = <T>(data: T): ApiSuccess<T> => ({ success: true, message: "ok", data });

const unauthorized = (code: string): ApiFailure => ({
  success: false,
  message: "Unauthorized",
  error: { code },
  meta: { requestId: "auth-test" },
});

afterEach(() => server.resetHandlers());

describe("base API authentication", () => {
  it("refreshes before the initial /auth/me request after a full reload", async () => {
    const store = makeStore();
    const newToken = "bootstrapped-access-token";
    const authorizationHeaders: string[] = [];
    let meCalls = 0;
    let refreshCalls = 0;

    server.use(
      http.get("*/auth/me", ({ request }) => {
        meCalls += 1;
        authorizationHeaders.push(request.headers.get("authorization") ?? "");
        return HttpResponse.json(success(user));
      }),
      http.post("*/auth/refresh", () => {
        refreshCalls += 1;
        return HttpResponse.json(success({ accessToken: newToken }));
      }),
    );

    const request = store.dispatch(authApi.endpoints.currentUser.initiate());
    await expect(request.unwrap()).resolves.toEqual(user);
    request.unsubscribe();

    expect(refreshCalls).toBe(1);
    expect(meCalls).toBe(1);
    expect(authorizationHeaders).toEqual(["Bearer bootstrapped-access-token"]);
  });

  it("refreshes once and retries an expired request with the new token", async () => {
    const store = makeStore();
    const newToken = "new-access-token";
    const authorizationHeaders: string[] = [];
    let meCalls = 0;
    let refreshCalls = 0;

    server.use(
      http.get("*/auth/me", ({ request }) => {
        meCalls += 1;
        authorizationHeaders.push(request.headers.get("authorization") ?? "");
        if (meCalls === 1) {
          return HttpResponse.json(unauthorized("TOKEN_EXPIRED"), { status: 401 });
        }
        return HttpResponse.json(success(user));
      }),
      http.post("*/auth/refresh", () => {
        refreshCalls += 1;
        return HttpResponse.json(success({ accessToken: newToken }));
      }),
    );

    store.dispatch(setSession({ accessToken: "expired-access-token", user }));
    const request = store.dispatch(authApi.endpoints.currentUser.initiate());
    await expect(request.unwrap()).resolves.toEqual(user);
    request.unsubscribe();

    expect(refreshCalls).toBe(1);
    expect(meCalls).toBe(2);
    expect(authorizationHeaders).toEqual([
      "Bearer expired-access-token",
      "Bearer new-access-token",
    ]);
  });

  it("shares one refresh request across concurrent expired API calls", async () => {
    const store = makeStore();
    const newToken = "concurrent-new-token";
    let refreshCalls = 0;
    const authorizationHeaders: string[] = [];

    server.use(
      http.get("*/auth/me", ({ request }) => {
        const authorization = request.headers.get("authorization") ?? "";
        authorizationHeaders.push(authorization);
        if (authorization === "Bearer expired-access-token") {
          return HttpResponse.json(unauthorized("TOKEN_EXPIRED"), { status: 401 });
        }
        return HttpResponse.json(success(user));
      }),
      http.get("*/auth/connected-accounts", ({ request }) => {
        const authorization = request.headers.get("authorization") ?? "";
        authorizationHeaders.push(authorization);
        if (authorization === "Bearer expired-access-token") {
          return HttpResponse.json(unauthorized("TOKEN_EXPIRED"), { status: 401 });
        }
        return HttpResponse.json(success({ providers: [], hasPassword: true }));
      }),
      http.post("*/auth/refresh", async ({ request }) => {
        refreshCalls += 1;
        expect(request.headers.get("authorization")).toBeNull();
        await new Promise((resolve) => setTimeout(resolve, 20));
        return HttpResponse.json(success({ accessToken: newToken }));
      }),
    );

    store.dispatch(setSession({ accessToken: "expired-access-token", user }));
    const userRequest = store.dispatch(authApi.endpoints.currentUser.initiate());
    const accountsRequest = store.dispatch(authApi.endpoints.connectedAccounts.initiate());
    await expect(Promise.all([userRequest.unwrap(), accountsRequest.unwrap()])).resolves.toEqual([
      user,
      { providers: [], hasPassword: true },
    ]);
    userRequest.unsubscribe();
    accountsRequest.unsubscribe();

    expect(refreshCalls).toBe(1);
    expect(authorizationHeaders).toEqual([
      "Bearer expired-access-token",
      "Bearer expired-access-token",
      "Bearer " + newToken,
      "Bearer " + newToken,
    ]);
  });

  it("does not refresh for a non-expiry 401 when an access token exists", async () => {
    const store = makeStore();
    let refreshCalls = 0;

    server.use(
      http.get("*/auth/me", () => HttpResponse.json(unauthorized("UNAUTHORIZED"), { status: 401 })),
      http.post("*/auth/refresh", () => {
        refreshCalls += 1;
        return HttpResponse.json(success({ accessToken: "unexpected-token" }));
      }),
    );

    store.dispatch(setSession({ accessToken: "invalid-access-token", user }));
    const request = store.dispatch(authApi.endpoints.currentUser.initiate());
    await expect(request.unwrap()).rejects.toBeDefined();
    request.unsubscribe();

    expect(refreshCalls).toBe(0);
  });

  it("does not keep refreshing after the session has been initialized and cleared", async () => {
    const store = makeStore();
    let refreshCalls = 0;

    server.use(
      http.get("*/auth/me", () => HttpResponse.json(unauthorized("UNAUTHORIZED"), { status: 401 })),
      http.post("*/auth/refresh", () => {
        refreshCalls += 1;
        return HttpResponse.json(success({ accessToken: "unexpected-token" }));
      }),
    );

    store.dispatch(clearSession());
    const request = store.dispatch(authApi.endpoints.currentUser.initiate());
    await expect(request.unwrap()).rejects.toBeDefined();
    request.unsubscribe();

    expect(refreshCalls).toBe(0);
  });
});
