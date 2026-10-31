type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue | undefined {
  return value !== null && typeof value === "object" ? (value as RecordValue) : undefined;
}

// Only these application errors carry messages intended for the user.
const publicCodes = new Set([
  "INVALID_CREDENTIALS",
  "CONFLICT",
  "BAD_REQUEST",
  "VALIDATION_ERROR",
  "INVALID_OR_EXPIRED_TOKEN",
]);

export function getErrorMessage(error: unknown, fallback: string): string {
  const failure = record(error);
  if (!failure) return fallback;
  const status = failure.status;
  if (status === "FETCH_ERROR")
    return "Unable to connect. Check your internet connection and try again.";
  if (status === "TIMEOUT_ERROR" || status === 408 || status === 504)
    return "The request took too long. Please try again.";
  if (status === 429) return "Too many requests. Please wait a moment and try again.";

  const data = record(failure.data);
  const code = record(data?.error)?.code;
  if (data?.success !== false || typeof code !== "string") return fallback;
  if (code === "EMAIL_DELIVERY_FAILED")
    return "We couldn't send the email right now. Please try again shortly.";
  if (typeof status !== "number") return fallback;
  if (status >= 500) return fallback;
  if (code === "EMAIL_NOT_VERIFIED") return "Please verify your email address before continuing.";
  if (code === "UNAUTHORIZED" || code === "TOKEN_EXPIRED")
    return "Your session has expired. Please sign in again.";
  if (code === "FORBIDDEN") return "You don't have permission to perform this action.";
  if (code === "NOT_FOUND")
    return "This item is no longer available. Refresh the page and try again.";
  if (code === "PAYLOAD_TOO_LARGE")
    return "This upload is too large. Please choose a smaller file.";
  if (code === "RATE_LIMITED") return "Too many requests. Please wait a moment and try again.";
  if (!publicCodes.has(code) || status < 400 || status >= 500) return fallback;

  const message = data.message;
  if (
    code === "VALIDATION_ERROR" &&
    (message === "Validation failed" || message === "Validation failed.")
  )
    return "Some information is invalid. Please check your entries and try again.";
  // Never display raw exception messages, stacks, validation internals or proxy HTML.
  return typeof message === "string" &&
    message.trim() &&
    message.length <= 300 &&
    !/[<>\r\n]/.test(message)
    ? message.trim()
    : fallback;
}
