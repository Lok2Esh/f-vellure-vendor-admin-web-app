import { ModuleState } from "@/components/portal/module-state";
import { Notice } from "@/components/portal/ui";
import { can } from "@/platform/domain";
import { vendorRoutes } from "@/platform/routes";
import { requireSession } from "@/platform/server-session";
export default async function Page() {
  const session = await requireSession("vendor");
  const route = vendorRoutes.find((r) => r.path === "/vendor/profile")!;
  if (!can(session, route.permission))
    return <Notice>You do not have permission to access this module.</Notice>;
  return <ModuleState route={route} />;
}
