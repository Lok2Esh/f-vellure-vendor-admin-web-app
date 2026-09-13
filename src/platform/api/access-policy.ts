import { ApiError, adminRoles, vendorRoles, type ApiUser } from "./contracts";

/** Server-only policy. Backend roles remain authoritative; an email never grants a role. */
export function assertPortalIdentity(user: ApiUser) {
  if (user.status !== "ACTIVE")
    throw new ApiError(
      403,
      "ACCOUNT_INACTIVE",
      "This account is not active. Contact support.",
    );
  if (user.roles.some((role) => adminRoles.includes(role))) {
    const administrator = process.env.VELLURE_ADMIN_EMAIL?.trim().toLowerCase();
    if (
      !administrator ||
      !user.roles.includes("SUPER_ADMIN") ||
      user.email?.toLowerCase() !== administrator
    )
      throw new ApiError(
        403,
        "ADMIN_ACCESS_DENIED",
        "This account is not authorized for the administration console.",
      );
    return;
  }
  if (!user.roles.some((role) => vendorRoles.includes(role)))
    throw new ApiError(
      403,
      "WORKSPACE_ACCESS_DENIED",
      "Sign in with a vendor account to access this workspace.",
    );
}
