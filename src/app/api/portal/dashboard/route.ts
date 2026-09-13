import { authorize,upstream } from "@/platform/api-server";
import { demoDashboard } from "@/platform/demo-adapter";
import { NextRequest,NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  const auth = await authorize("dashboard.view");
  if (auth.error) return auth.error;
  const period = request.nextUrl.searchParams.get("period") || "7 days";
  const branchId = request.nextUrl.searchParams.get("branchId") || "all";
  if (
    !["Today", "7 days", "30 days", "12 months"].includes(period) ||
    (!["all", "sector17", "indiranagar"].includes(branchId) && auth.session.demo)
  )
    return NextResponse.json(
      { error: "Invalid dashboard filters" },
      { status: 400 },
    );
  if (auth.session.demo)
    return NextResponse.json(demoDashboard(period, branchId), {
      headers: { "Cache-Control": "private, no-store" },
    });
  return upstream(
    `/vendor/dashboard?${new URLSearchParams({ period, branchId })}`,
  );
}
