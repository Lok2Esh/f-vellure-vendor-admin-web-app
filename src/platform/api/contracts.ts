import { MARKET_CONFIG, isMobile, normalizeMobile } from "@/platform/market";
import { z } from "zod";
import type { Money, Session, Workspace } from "../domain";
export const userSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  status: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
  vendorIds: z.array(z.string()),
});
export type ApiUser = z.infer<typeof userSchema>;
export const tokenSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  tokenType: z.literal("Bearer"),
  expiresIn: z.number().int().positive(),
  user: userSchema,
});
export type TokenPair = z.infer<typeof tokenSchema>;
export const loginSchema = z.object({
  identifier: z.string().trim().min(1).max(254),
  password: z.string().min(1).max(128),
  device: z.string().max(120).optional(),
  platform: z.string().max(120).optional(),
});
export const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  email: z.email(),
  phone: z.string().refine(isMobile, "Enter a valid Indian mobile number").transform(normalizeMobile),
  password: z
    .string()
    .min(8)
    .max(64)
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d\W]).+$/,
      "Use uppercase, lowercase and a number or symbol",
    ),
  role: z.literal("VENDOR_OWNER").default("VENDOR_OWNER"),
});
export const metaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type ApiMeta = z.infer<typeof metaSchema>;
export interface ApiEnvelope<T> {
  data: T;
  meta?: ApiMeta;
}
export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type ApiRecord = { [key: string]: JsonValue };
export const envelopeSchema = <T>(schema: z.ZodType<T>) =>
  z.object({ data: schema, meta: metaSchema.optional() });
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
export function errorFromResponse(status: number, body: unknown): ApiError {
  const result = z
    .object({
      error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.unknown().optional(),
      }),
    })
    .safeParse(body);
  return result.success
    ? new ApiError(
        status,
        result.data.error.code,
        result.data.error.message,
        result.data.error.details,
      )
    : new ApiError(
        status,
        status === 404 ? "ENDPOINT_UNAVAILABLE" : "API_ERROR",
        status === 404
          ? "This endpoint is not available on the connected backend."
          : "The backend could not complete the request.",
      );
}
export const adminRoles = [
  "SUPER_ADMIN",
  "OPERATIONS_ADMIN",
  "FINANCE_ADMIN",
  "SUPPORT_AGENT",
  "CONTENT_MANAGER",
  "MODERATOR",
];
export const vendorRoles = ["VENDOR_OWNER", "VENDOR_MANAGER", "VENDOR_STAFF"];
export function workspaceFor(user: ApiUser): Workspace | null {
  return user.roles.some((r) => adminRoles.includes(r))
    ? "admin"
    : user.roles.some((r) => vendorRoles.includes(r))
      ? "vendor"
      : null;
}
export function sessionFromUser(
  user: ApiUser,
  workspace: Workspace,
  vendorId?: string,
): Session | null {
  if (
    user.status !== "ACTIVE" ||
    !user.roles.some((role) =>
      (workspace === "admin" ? adminRoles : vendorRoles).includes(role),
    )
  )
    return null;
  if (vendorId && !user.vendorIds.includes(vendorId)) return null;
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    workspace,
    roles: user.roles,
    permissions: user.permissions,
    vendorIds: user.vendorIds,
    vendorId: vendorId || user.vendorIds[0],
    demo: false,
  };
}
/** Exact decimal strings on the wire; integer paisa inside the UI. No floating point multiplication. */
export function fromApiAmount(value: string, currency: string): Money {
  if (currency !== MARKET_CONFIG.currency.code)
    throw new ApiError(
      502,
      "UNSUPPORTED_CURRENCY",
      "The service returned an unsupported currency.",
    );
  if (!/^\d+\.\d{2}$/.test(value))
    throw new ApiError(
      502,
      "INVALID_AMOUNT",
      `Expected an ${MARKET_CONFIG.currency.code} amount with two decimals.`,
    );
  const [whole, fraction] = value.split(".");
  const paisa = BigInt(whole) * BigInt(100) + BigInt(fraction);
  if (paisa > BigInt(Number.MAX_SAFE_INTEGER))
    throw new ApiError(
      502,
      "INVALID_AMOUNT",
      "Amount exceeds the supported range.",
    );
  return { amount: Number(paisa), currency: MARKET_CONFIG.currency.code };
}
export function toApiAmount(value: Money): string {
  if (!Number.isSafeInteger(value.amount) || value.amount < 0)
    throw new Error("Invalid paisa amount");
  return `${Math.floor(value.amount / 100)}.${String(value.amount % 100).padStart(2, "0")}`;
}
