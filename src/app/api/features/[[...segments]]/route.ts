import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readUser } from "@/platform/api/auth-server";
import {
  apiFailure,
  assertOrigin,
  backendFetch,
  backendData,
  cookieContext,
} from "@/platform/api/backend";
import { ApiError, errorFromResponse } from "@/platform/api/contracts";
import {
  featureInputSchema,
  featureSchema,
} from "@/features/content/contracts";

async function handle(
  request: NextRequest,
  { params }: { params: Promise<{ segments?: string[] }> },
) {
  try {
    const user = await readUser();
    const admin = user.roles.includes("SUPER_ADMIN");
    if (!admin && !user.roles.includes("VENDOR_OWNER"))
      throw new ApiError(
        403,
        "FORBIDDEN",
        "Only business owners can manage features.",
      );
    const context = await cookieContext();
    if (!admin) {
      context.vendorId = context.vendorId || user.vendorIds[0];
      if (!context.vendorId || !user.vendorIds.includes(context.vendorId))
        throw new ApiError(
          403,
          "VENDOR_REQUIRED",
          "Complete vendor onboarding before managing features.",
        );
    }
    const segments = (await params).segments || [];
    const [id, action] = segments;
    if (
      segments.length > 2 ||
      (id &&
        !["preview", "reorder"].includes(id) &&
        !z.uuid().safeParse(id).success)
    )
      throw new ApiError(404, "NOT_FOUND", "Feature not found.");
    if (request.method !== "GET") assertOrigin(request);
    let path = "";
    let body: unknown;
    if (request.method === "GET" && (!id || id === "preview")) {
      const query = new URLSearchParams();
      for (const key of [
        "page",
        "limit",
        "search",
        "placement",
        "type",
        "isActive",
        "locale",
      ]) {
        const value = request.nextUrl.searchParams.get(key);
        if (value) query.set(key, value);
      }
      if (!admin) query.set("vendorId", context.vendorId!);
      path = `/features${id === "preview" ? "" : "/admin/list"}?${query}`;
    } else if (id === "reorder" && request.method === "PUT" && admin) {
      body = z
        .object({
          items: z
            .array(
              z.object({ id: z.uuid(), sortOrder: z.number().int().min(0) }),
            )
            .min(1)
            .max(100),
        })
        .parse(await request.json());
      path = "/features/reorder";
    } else if (!id && request.method === "POST") {
      body = featureInputSchema.parse(await request.json());
      if (!admin)
        body = {
          ...(body as object),
          vendorId: context.vendorId,
          placement: "VENDOR_DETAIL",
        };
      path = "/features";
    } else if (id && !["preview", "reorder"].includes(id)) {
      if (!admin) {
        const feature = await backendData(
          `/features/admin/${id}`,
          featureSchema,
          {},
          context,
        );
        if (feature.vendorId !== context.vendorId)
          throw new ApiError(
            403,
            "FORBIDDEN",
            "This feature belongs to another business.",
          );
      }
      if (request.method === "GET" && !action) path = `/features/admin/${id}`;
      else if (request.method === "PATCH" && action === "toggle")
        path = `/features/${id}/toggle`;
      else if (request.method === "PATCH" && !action) {
        body = featureInputSchema.parse(await request.json());
        if (!admin)
          body = {
            ...(body as object),
            vendorId: context.vendorId,
            placement: "VENDOR_DETAIL",
          };
        path = `/features/${id}`;
      } else if (request.method === "DELETE" && !action && admin)
        path = `/features/${id}`;
    }
    if (!path)
      throw new ApiError(
        403,
        "FORBIDDEN",
        "This operation is not available to your account.",
      );
    const response = await backendFetch(
      path,
      {
        method: request.method,
        body: body === undefined ? undefined : JSON.stringify(body),
      },
      context,
    );
    const payload = await response.json();
    if (!response.ok) throw errorFromResponse(response.status, payload);
    return NextResponse.json(payload, {
      status: response.status,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return apiFailure(
      error instanceof z.ZodError
        ? new ApiError(
            422,
            "VALIDATION_ERROR",
            error.issues[0]?.message || "Check feature details.",
          )
        : error,
    );
  }
}
export {
  handle as GET,
  handle as POST,
  handle as PATCH,
  handle as PUT,
  handle as DELETE,
};
