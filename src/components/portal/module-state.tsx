import { ModuleRoute } from "@/platform/routes";
import { Card, EmptyState, NavLink, PageHeader, Stack } from "./ui";
export function ModuleState({
  route,
  detail,
}: {
  route: ModuleRoute;
  detail?: string;
}) {
  return (
    <Stack>
      <PageHeader
        eyebrow={`PHASE ${route.phase}`}
        title={detail ? `${route.label} · ${detail}` : route.label}
        description="Your workspace is ready. This module is the next step."
      />
      <Card>
        <EmptyState
          title={`${route.label} is not connected yet`}
          description="This route is reserved in the application architecture. Its workflows will be implemented against the Vellure service contracts in the next delivery phases."
          action={
            <NavLink
              href={`/${route.path.split("/")[1]}/dashboard`}
              className="v-button secondary"
            >
              Back to overview
            </NavLink>
          }
        />
      </Card>
    </Stack>
  );
}
