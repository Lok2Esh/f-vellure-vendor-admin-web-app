import { ModuleState } from "@/components/portal/module-state";
import { Notice } from "@/components/portal/ui";
import { can } from "@/platform/domain";
import { vendorChildren,vendorRoutes } from "@/platform/routes";
import { requireSession } from "@/platform/server-session";
import { notFound } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = "/vendor/" + slug.join("/");
  const route =
    vendorRoutes.find((r) => r.path === path) ||
    vendorRoutes.find((r) => r.path === "/vendor/" + slug[0]);
  if (!route || slug.length > 2) notFound();
  if (
    slug.length === 2 &&
    !vendorChildren.some((c) => c === slug.join("/") || c === slug[0] + "/[id]")
  )
    notFound();
  const session = await requireSession("vendor");
  if (!can(session, route.permission))
    return <Notice>You don’t have permission to access this module.</Notice>;
  return <ModuleState route={route} detail={slug[1]} />;
}
