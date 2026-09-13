import { authorize,sameOrigin,upstream } from "@/platform/api-server";
import { onboardingDraftSchema,onboardingSchema } from "@/platform/domain";
import { cookies } from "next/headers";
import { NextRequest,NextResponse } from "next/server";
export async function GET() {
  const auth = await authorize("vendor.view");
  if (auth.error) return auth.error;
  if (!auth.session.demo) return upstream("/vendor/application");
  const raw = (await cookies()).get("vellure_demo_application_in")?.value;
  try {
    return NextResponse.json(raw ? JSON.parse(raw) : null);
  } catch {
    return NextResponse.json(null);
  }
}
export async function POST(request: NextRequest) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 },
    );
  const auth = await authorize("vendor.edit");
  if (auth.error) return auth.error;
  const body = await request.json().catch(() => null);
  const parsed = (body?.submit === false ? onboardingDraftSchema : onboardingSchema).safeParse(body?.data);
  if (!parsed.success || typeof body?.submit !== "boolean")
    return NextResponse.json(
      { error: parsed.error?.issues[0]?.message || "Invalid request" },
      { status: 400 },
    );
  if (!auth.session.demo)
    return upstream("/vendor/application", {
      method: "POST",
      body: JSON.stringify({ data: parsed.data, submit: body.submit }),
    });
  const jar = await cookies();
  const previous = jar.get("vellure_demo_application_in")?.value;
  if (previous) {
    try {
      if (JSON.parse(previous).status === "SUBMITTED")
        return NextResponse.json(
          { error: "This application has already been submitted." },
          { status: 409 },
        );
    } catch {}
  }
  const application = {
    id: "DEMO-APP-001",
    status: body.submit ? "SUBMITTED" : "DRAFT",
    data: parsed.data,
    updatedAt: new Date().toISOString(),
  };
  const encoded = JSON.stringify(application);
  if (encoded.length > 3400)
    return NextResponse.json(
      { error: "Please shorten your application details." },
      { status: 400 },
    );
  jar.set("vellure_demo_application_in", encoded, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 86400,
  });
  return NextResponse.json(application);
}
