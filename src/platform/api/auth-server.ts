import { assertPortalIdentity } from "./access-policy";
import { cookies } from "next/headers";
import { cache } from "react";
import {
  ApiError,
  ApiUser,
  TokenPair,
  tokenSchema,
  userSchema,
  workspaceFor,
} from "./contracts";
import { backendData, cookieContext } from "./backend";
export const readUser = cache(async (): Promise<ApiUser> => {
  const context = await cookieContext();
  if (!context.token)
    throw new ApiError(401, "AUTH_UNAUTHORIZED", "Your session has expired.");
  const user = await backendData("/auth/me", userSchema, {}, context);
  assertPortalIdentity(user);
  return user;
});
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
export async function saveTokens(pair: TokenPair) {
  assertPortalIdentity(pair.user);
  const jar = await cookies();
  jar.set("vellure_session", pair.accessToken, {
    ...options,
    maxAge: pair.expiresIn,
  });
  jar.set("vellure_refresh", pair.refreshToken, {
    ...options,
    maxAge: 7 * 86400,
  });
  const previous = jar.get("vellure_vendor")?.value;
  const vendor =
    previous && pair.user.vendorIds.includes(previous)
      ? previous
      : pair.user.vendorIds[0];
  if (vendor)
    jar.set("vellure_vendor", vendor, { ...options, maxAge: 7 * 86400 });
  else jar.delete("vellure_vendor");
}
export async function clearTokens() {
  const jar = await cookies();
  for (const key of [
    "vellure_session",
    "vellure_refresh",
    "vellure_vendor",
    "vellure_demo_application",
    "vellure_demo_application_in",
  ])
    jar.delete(key);
}
export function authRedirect(user: ApiUser) {
  const workspace = workspaceFor(user);
  return workspace === "vendor" && !user.vendorIds.length
    ? "/vendor/onboarding"
    : workspace
      ? `/${workspace}/dashboard`
      : "/login?error=workspace";
}
// Single-flight rotation per refresh token in this process. Web Locks also serialize across browser tabs.
const rotations = new Map<string, Promise<TokenPair>>();
export async function refreshTokens() {
  const jar = await cookies();
  const refreshToken = jar.get("vellure_refresh")?.value;
  if (!refreshToken)
    throw new ApiError(401, "AUTH_UNAUTHORIZED", "Sign in to continue.");
  let pending = rotations.get(refreshToken);
  if (!pending) {
    pending = backendData(
      "/auth/refresh",
      tokenSchema,
      { method: "POST", body: JSON.stringify({ refreshToken }) },
      { locale: jar.get("vellure_locale")?.value },
    );
    rotations.set(refreshToken, pending);
    pending.finally(() => rotations.delete(refreshToken)).catch(() => {});
  }
  const pair = await pending;
  await saveTokens(pair);
  return pair;
}
