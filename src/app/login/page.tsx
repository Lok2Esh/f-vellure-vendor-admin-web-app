import { LoginForm } from "@/components/portal/login-form";
import { demoEnabled } from "@/platform/server-session";
export const dynamic = "force-dynamic";
export default function Page() {
  return <LoginForm demo={demoEnabled()} />;
}
