import { ModuleState } from "@/components/portal/module-state";
import { Notice } from "@/components/portal/ui";
import { can } from "@/platform/domain";
import { adminRoutes } from "@/platform/routes";
import { requireSession } from "@/platform/server-session";
export default async function Page() {
  const session = await requireSession("admin");
  const route = adminRoutes.find((r) => r.path === "/admin/dashboard")!;
  if (!can(session, route.permission))
    return <Notice>You do not have permission to access this module.</Notice>;
  return <ModuleState route={route} />;
}
