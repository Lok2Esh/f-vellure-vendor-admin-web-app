import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Permission, can } from "./domain";
import { getSession } from "./server-session";
import { getLocale } from "./server-locale";
export async function authorize(permission: Permission) {
  const session = await getSession("vendor");
  if (!session)
    return {
      error: NextResponse.json(
        { error: "Your session has expired." },
        { status: 401 },
      ),
    };
  if (!can(session, permission))
    return {
      error: NextResponse.json(
        { error: "You do not have permission for this action." },
        { status: 403 },
      ),
    };
  return { session };
}
export function sameOrigin(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}
export async function upstream(path: string, init?: RequestInit) {
  const token = (await cookies()).get("vellure_session")?.value;
  try {
    const response = await fetch(`${process.env.VELLURE_API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": await getLocale(),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok)
      return NextResponse.json(
        { error: "The Vellure service could not complete this request." },
        { status: response.status },
      );
    return NextResponse.json(await response.json(), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Vellure is temporarily unavailable. Please retry." },
      { status: 503 },
    );
  }
}
