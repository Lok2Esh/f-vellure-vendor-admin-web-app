import { MARKET_CONFIG } from "./market";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Session, Workspace } from "./domain";
import { readUser } from "./api/auth-server";
import { ApiError, sessionFromUser } from "./api/contracts";

export const demoEnabled = () => process.env.VELLURE_DEMO_MODE === "true";
export async function getSession(
  workspace: Workspace,
): Promise<Session | null> {
  if (demoEnabled())
    return {
      id: "demo-owner",
      name: "Neha Kapoor",
      businessName: "Glow & Grace Salon",
      businessLocation: `Chandigarh, ${MARKET_CONFIG.country.name}`,
      workspace,
      vendorId: workspace === "vendor" ? "demo-salon" : undefined,
      demo: true,
      roles: workspace === "admin" ? ["SUPER_ADMIN"] : ["VENDOR_OWNER"],
      permissions:
        workspace === "vendor"
          ? [
              "dashboard.view",
              "vendor.view",
              "vendor.edit",
              "appointment.view",
              "appointment.edit",
              "order.view",
              "catalog.edit",
              "customer.view",
              "branch.edit",
              "staff.edit",
              "finance.view",
              "review.reply",
              "promotion.create",
            ]
          : [
              "dashboard.view",
              "vendor.view",
              "vendor.approve",
              "finance.view",
              "admin.manage",
              "content.edit",
              "customer.view",
              "order.view",
              "appointment.view",
            ],
    };
  try {
    const user = await readUser();
    const vendorId =
      workspace === "vendor"
        ? (await cookies()).get("vellure_vendor")?.value
        : undefined;
    return sessionFromUser(user, workspace, vendorId);
  } catch (error) {
    if (!(error instanceof ApiError) || ![401,403].includes(error.status)) throw error;
    return null;
  }
}
export async function requireSession(workspace: Workspace) {
  const session = await getSession(workspace);
  if (!session) {
    const jar = await cookies();
    if (!jar.has("vellure_session") && jar.has("vellure_refresh"))
      redirect(`/session/renew?next=/${workspace}/dashboard`);
    redirect("/login");
  }
  return session;
}
