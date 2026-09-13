import { ModuleState } from "@/components/portal/module-state";
import { Notice } from "@/components/portal/ui";
import { can } from "@/platform/domain";
import { adminChildren,adminRoutes } from "@/platform/routes";
import { requireSession } from "@/platform/server-session";
import { notFound } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = "/admin/" + slug.join("/");
  const route =
    adminRoutes.find((r) => r.path === path) ||
    adminRoutes.find((r) => r.path === "/admin/" + slug[0]);
  if (!route || slug.length > 2) notFound();
  if (
    slug.length === 2 &&
    !adminRoutes.some((r) => r.path === path) &&
    !adminChildren.some((c) => c === slug.join("/") || c === slug[0] + "/[id]")
  )
    notFound();
  const session = await requireSession("admin");
  if (!can(session, route.permission))
    return <Notice>You don’t have permission to access this module.</Notice>;
  return <ModuleState route={route} detail={slug[1]} />;
}
