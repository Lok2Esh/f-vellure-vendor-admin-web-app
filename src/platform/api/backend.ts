import { MARKET_CONFIG } from "@/platform/market";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, errorFromResponse, envelopeSchema } from "./contracts";

export function apiBase() {
  return (
    process.env.VELLURE_API_URL || "http://localhost:3000/api/v1"
  ).replace(/\/$/, "");
}
export async function backendFetch(
  path: string,
  init: RequestInit = {},
  context: {
    token?: string;
    vendorId?: string;
    locale?: string;
    root?: boolean;
  } = {},
) {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set(
    "Accept-Language",
    MARKET_CONFIG.localization.languages.find(
      (language) => language === context.locale,
    ) ?? MARKET_CONFIG.localization.defaultLanguage,
  );
  if (!(init.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  if (context.token) headers.set("Authorization", `Bearer ${context.token}`);
  if (context.vendorId) headers.set("X-Vendor-ID", context.vendorId);
  headers.set("X-Correlation-ID", crypto.randomUUID());
  try {
    const base = context.root ? new URL(apiBase()).origin : apiBase();
    return await fetch(`${base}${path}`, {
      ...init,
      headers,
      cache: "no-store",
      redirect: "error",
      signal: init.signal ?? AbortSignal.timeout(15000),
    });
  } catch {
    throw new ApiError(
      503,
      "BACKEND_UNAVAILABLE",
      "The Vellure API is unavailable. Please try again.",
    );
  }
}
export async function backendData<T>(
  path: string,
  schema: z.ZodType<T>,
  init: RequestInit = {},
  context: Parameters<typeof backendFetch>[2] = {},
): Promise<T> {
  const response = await backendFetch(path, init, context);
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) throw errorFromResponse(response.status, body);
  const result = envelopeSchema(schema).safeParse(body);
  if (!result.success)
    throw new ApiError(
      502,
      "INVALID_RESPONSE",
      "The backend returned a response that does not match its API contract.",
    );
  return result.data.data;
}
export function apiFailure(error: unknown) {
  const e =
    error instanceof ApiError
      ? error
      : new ApiError(
          500,
          "INTERNAL_ERROR",
          "The request could not be completed.",
        );
  return NextResponse.json(
    { error: { code: e.code, message: e.message, details: e.details } },
    { status: e.status, headers: { "Cache-Control": "no-store" } },
  );
}
export async function cookieContext() {
  const jar = await cookies();
  return {
    token: jar.get("vellure_session")?.value,
    locale: jar.get("vellure_locale")?.value || "en",
    vendorId: jar.get("vellure_vendor")?.value,
  };
}
export function assertOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    throw new ApiError(403, "INVALID_ORIGIN", "Invalid request origin.");
}
