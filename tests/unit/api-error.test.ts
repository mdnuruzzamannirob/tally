import { describe, expect, it } from "vitest";
import { getErrorMessage } from "@/lib/api-error";

const fallback = "Could not save your changes.";
const failure = (status: number, code: string, message: unknown) => ({
  status,
  data: { success: false, message, error: { code, stack: "private stack" } },
});

describe("user-facing API errors", () => {
  it.each([
    [401, "INVALID_CREDENTIALS", "Current password is incorrect."],
    [409, "CONFLICT", "An account with this email already exists."],
    [400, "VALIDATION_ERROR", "Salary maximum cannot be below salary minimum."],
    [400, "INVALID_OR_EXPIRED_TOKEN", "Verification token is invalid or expired."],
  ])("shows expected application messages (%s %s)", (status, code, message) => {
    expect(getErrorMessage(failure(status, code, message), fallback)).toBe(message);
  });

  it.each([
    failure(500, "INTERNAL_ERROR", "database password leaked"),
    failure(503, "SERVICE_UNAVAILABLE", "provider credentials missing"),
    failure(500, "CONFLICT", "internal stack"),
    failure(400, "UNKNOWN", "internal stack"),
    failure(400, "BAD_REQUEST", "<html>proxy error</html>"),
    failure(400, "BAD_REQUEST", { private: "details" }),
    { status: "PARSING_ERROR", data: "<html>proxy error</html>" },
    { status: 400, data: { message: "unrecognized body" } },
    new Error("private exception"),
    null,
  ])("hides technical and malformed errors %#", (error) => {
    expect(getErrorMessage(error, fallback)).toBe(fallback);
  });

  it("handles delivery failure without revealing provider internals", () => {
    expect(getErrorMessage(failure(503, "EMAIL_DELIVERY_FAILED", "private"), fallback)).toBe(
      "We couldn't send the email right now. Please try again shortly.",
    );
  });

  it("distinguishes network failures from invalid verification links", () => {
    expect(getErrorMessage({ status: "FETCH_ERROR" }, fallback)).toContain("Unable to connect");
    expect(getErrorMessage({ status: "TIMEOUT_ERROR" }, fallback)).toContain("took too long");
    expect(getErrorMessage({ status: 429 }, fallback)).toContain("Too many requests");
  });

  it("keeps validation internals and route paths out of notifications", () => {
    expect(
      getErrorMessage(failure(400, "VALIDATION_ERROR", "Validation failed"), fallback),
    ).toContain("check your entries");
    expect(
      getErrorMessage(
        failure(404, "NOT_FOUND", "Route GET /private/path was not found."),
        fallback,
      ),
    ).not.toContain("/private");
  });
});
