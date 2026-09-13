import { z } from "zod";
import { ApiError, errorFromResponse, envelopeSchema } from "./contracts";
let refreshing: Promise<void> | null = null;
export async function refreshSession() {
  if (!refreshing) {
    const run = async () => {
      const response = await fetch("/api/auth/refresh", { method: "POST" });
      if (!response.ok)
        throw errorFromResponse(
          response.status,
          await response.json().catch(() => null),
        );
    };
    refreshing = (
      typeof navigator !== "undefined" && navigator.locks
        ? navigator.locks.request("vellure-session-refresh", run)
        : run()
    )
      .then(() => undefined)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}
/** Retry once after a 401. Non-auth failures and business mutations are never blindly retried. */
export async function apiRequest(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  const response = await fetch(path, { ...init, headers });
  if (response.status === 401 && retry) {
    await refreshSession();
    return apiRequest(path, init, false);
  }
  if (!response.ok)
    throw errorFromResponse(
      response.status,
      await response.json().catch(() => null),
    );
  return response;
}
export async function requestEnvelope<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
) {
  const response = await apiRequest(path, init);
  if (response.status === 204) return { data: null as T };
  const result = envelopeSchema(schema).safeParse(await response.json());
  if (!result.success)
    throw new ApiError(502, "INVALID_RESPONSE", "Unexpected API response.");
  return result.data;
}
