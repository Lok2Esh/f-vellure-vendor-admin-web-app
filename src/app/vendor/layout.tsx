import { getLocale } from "@/platform/server-locale";
import { PortalProvider } from "@/components/portal/providers";
import { Shell } from "@/components/portal/shell";
import { requireSession } from "@/platform/server-session";
import { ReactNode } from "react";
export const dynamic = "force-dynamic";
export default async function Layout({ children }: { children: ReactNode }) {
  const session = await requireSession("vendor");
  return (
    <PortalProvider session={session} initialLocale={await getLocale()}>
      <Shell>{children}</Shell>
    </PortalProvider>
  );
}
