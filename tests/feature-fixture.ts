import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import type { Feature } from "../src/features/content/contracts";
const initial: Feature = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Salon highlight",
  type: "HIGHLIGHT",
  placement: "HOME_FEED",
  targetType: "NONE",
  sortOrder: 1,
  isActive: true,
  vendorId: null,
  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",
};
let features: Feature[] = [
  initial,
  {
    ...initial,
    id: "22222222-2222-4222-8222-222222222222",
    title: "My salon",
    vendorId: "tenant-test",
    placement: "VENDOR_DETAIL",
  },
];
export async function featureFixture(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const url = new URL(req.url || "", "http://localhost");
  if (!url.pathname.startsWith("/features")) return false;
  const send = (data: unknown) => {
    res.end(JSON.stringify({ data }));
    return true;
  };
  if (url.pathname === "/features/admin/list") {
    const query = url.searchParams,
      page = Number(query.get("page") || 1),
      limit = Number(query.get("limit") || 20);
    const rows = features.filter(
      (feature) =>
        (!query.get("vendorId") ||
          feature.vendorId === query.get("vendorId")) &&
        (!query.get("placement") ||
          feature.placement === query.get("placement")) &&
        (!query.get("search") ||
          feature.title
            .toLowerCase()
            .includes(query.get("search")!.toLowerCase())) &&
        (!query.get("isActive") ||
          String(feature.isActive) === query.get("isActive")),
    );
    res.end(
      JSON.stringify({
        data: rows.slice((page - 1) * limit, page * limit),
        meta: {
          total: rows.length,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(rows.length / limit)),
        },
      }),
    );
    return true;
  }
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const body = raw ? JSON.parse(raw) : {};
  if (url.pathname === "/features" && req.method === "POST") {
    const feature = {
      ...body,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    features.push(feature);
    res.statusCode = 201;
    return send(feature);
  }
  if (url.pathname === "/features" && req.method === "GET")
    return send(
      features
        .filter((feature) => feature.isActive)
        .map((feature) => ({
          ...feature,
          displayTitle:
            url.searchParams.get("locale") === "hi"
              ? feature.titleHindi || feature.title
              : feature.title,
        })),
    );
  if (url.pathname === "/features/reorder") {
    for (const item of body.items) {
      const feature = features.find((feature) => feature.id === item.id);
      if (feature) feature.sortOrder = item.sortOrder;
    }
    return send({ updatedCount: body.items.length });
  }
  const id = url.pathname
    .split("/")
    .filter(Boolean)
    .find((segment) => segment.includes("-"));
  const feature = features.find((feature) => feature.id === id);
  if (!feature) {
    res.statusCode = 404;
    res.end(
      JSON.stringify({ error: { code: "NOT_FOUND", message: "Not found" } }),
    );
    return true;
  }
  if (req.method === "DELETE") {
    features = features.filter((feature) => feature.id !== id);
    return send({ deleted: true, id });
  }
  if (req.method === "PATCH") {
    if (url.pathname.endsWith("/toggle")) feature.isActive = !feature.isActive;
    else Object.assign(feature, body);
  }
  return send(feature);
}
