import {
  MARKET_CONFIG,
  BUSINESS_TYPES,
  isMobile,
  type Language,
} from "./market";
import { INDIA_SUBDIVISIONS } from "./india-locations";
import { z } from "zod";

export type Workspace = "vendor" | "admin";
export type Locale = Language;
export type LocalizedText = { en: string; hi: string };
/** All monetary amounts are integer paisa; never floating point rupees. */
export type Money = {
  amount: number;
  currency: typeof MARKET_CONFIG.currency.code;
};
export const appointmentStatuses = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
  "REFUNDED",
] as const;
export type AppointmentStatus = (typeof appointmentStatuses)[number];
export type OrderStatus =
  | "NEW"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";
export type VendorStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "BLOCKED";
export type PayoutStatus =
  "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "HELD" | "CANCELLED";
export type Permission =
  | "vendor.create"
  | "branch.view"
  | "branch.create"
  | "staff.view"
  | "staff.manage"
  | "service.view"
  | "service.create"
  | "service.edit"
  | "service.approve"
  | "product.view"
  | "product.create"
  | "product.edit"
  | "product.approve"
  | "inventory.manage"
  | "appointment.manage"
  | "order.manage"
  | "refund.create"
  | "payout.view"
  | "commission.manage"
  | "review.view"
  | "review.moderate"
  | "content.manage"
  | "rbac.manage"
  | "audit.view"
  | "support.manage"
  | "dashboard.view"
  | "vendor.view"
  | "vendor.edit"
  | "vendor.approve"
  | "vendor.suspend"
  | "appointment.view"
  | "appointment.edit"
  | "order.view"
  | "order.edit"
  | "order.refund"
  | "customer.view"
  | "customer.block"
  | "finance.view"
  | "refund.approve"
  | "payout.approve"
  | "promotion.create"
  | "promotion.approve"
  | "content.edit"
  | "admin.manage"
  | "catalog.edit"
  | "staff.edit"
  | "branch.edit"
  | "review.reply";
export type AdminRole =
  | "SUPER_ADMIN"
  | "OPERATIONS_ADMIN"
  | "FINANCE_ADMIN"
  | "SUPPORT_AGENT"
  | "CONTENT_MANAGER"
  | "MODERATOR";
export const sessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  workspace: z.enum(["vendor", "admin"]),
  vendorId: z.string().optional(),
  vendorIds: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
  businessName: z.string().optional(),
  businessLocation: z.string().optional(),
  permissions: z.array(z.string()),
  demo: z.boolean().default(false),
});
export type Session = z.infer<typeof sessionSchema>;
export const can = (session: Session, permission: Permission) =>
  permission === "dashboard.view" ||
  session.roles?.includes("SUPER_ADMIN") ||
  session.permissions.includes("*") ||
  session.permissions.includes(permission);
export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
export interface ListQuery {
  search?: string;
  page: number;
  pageSize: number;
  sort?: string;
  direction?: "asc" | "desc";
  branchId?: string;
  status?: string;
  from?: string;
  to?: string;
}
export interface Appointment {
  id: string;
  customer: string;
  initials: string;
  service: string;
  staff: string;
  branchId: string;
  startsAt: string;
  duration: number;
  price: Money;
  status: AppointmentStatus;
  payment: "PAID" | "UNPAID";
  notes: string;
}
export interface Dashboard {
  businessName: string;
  branches: { value: string; label: string }[];
  businessHours: string;
  occupancyPercent: number;
  changes: {
    revenue: string;
    appointments: string;
    orders: string;
    rating: string;
    periodRevenue: string;
  };
  date: string;
  revenue: Money;
  appointments: number;
  orders: number;
  pendingAppointments: number;
  pendingOrders: number;
  rating: number;
  ratingCount: number;
  lowStock: number;
  upcoming: number;
  serviceRevenue: Money;
  productRevenue: Money;
  trend: { label: string; services: number; products: number }[];
  appointmentsList: Appointment[];
  payout: { amount: Money; expectedAt: string; bankVerified: boolean };
  inventory: {
    name: string;
    sku: string;
    available: number;
    threshold: number;
  }[];
  reviews: { name: string; service: string; rating: number; text: string }[];
  actionOrders: {
    id: string;
    customer: string;
    items: number;
    total: Money;
    status: OrderStatus;
  }[];
}
export const onboardingSchema = z.object({
  businessName: z.string().trim().min(2, "Enter your business name").max(120),
  registrationType: z.enum(BUSINESS_TYPES).default("Individual / Proprietor"),
  legalName: z.string().max(120).default(""),
  pan: z.string().max(10).default(""),
  gstin: z.string().max(15).default(""),
  secondaryName: z.string().max(120),
  category: z.enum(["Salon", "Spa", "Barber", "Wellness"]),
  ownerName: z.string().trim().min(2, "Enter the owner’s name"),
  email: z.email("Enter a valid email"),
  phone: z
    .string()
    .refine(isMobile, "Enter a valid 10-digit Indian mobile number"),
  city: z.string().trim().min(2).max(120),
  address: z.string().trim().min(8, "Enter a complete address"),
  addressLine2: z.string().max(120),
  landmark: z.string().max(120),
  district: z.string().trim().min(2, "Enter your district").max(120),
  state: z
    .string()
    .refine(
      (value) => INDIA_SUBDIVISIONS.some((item) => item.code === value),
      "Select a state or union territory",
    ),
  postalCode: z
    .string()
    .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN Code"),
  country: z.literal(MARKET_CONFIG.country.code),
  terms: z.literal(true, { error: "Accept the partner terms to continue" }),
});
export const onboardingDraftSchema = z.object({
  businessName: z.string().max(120),
  registrationType: z.enum(BUSINESS_TYPES).default("Individual / Proprietor"),
  legalName: z.string().max(120).default(""),
  pan: z.string().max(10).default(""),
  gstin: z.string().max(15).default(""),
  secondaryName: z.string().max(120),
  category: z.enum(["Salon", "Spa", "Barber", "Wellness"]),
  ownerName: z.string().max(120),
  email: z.string().max(254),
  phone: z.string().max(24),
  city: z.string().trim().min(2).max(120),
  address: z.string().max(500),
  addressLine2: z.string().max(120),
  landmark: z.string().max(120),
  district: z.string().max(120),
  state: z.string().max(2),
  postalCode: z.string().max(6),
  country: z.literal(MARKET_CONFIG.country.code),
  terms: z.boolean(),
});
export type OnboardingInput = z.infer<typeof onboardingDraftSchema>;
export interface VendorApplication {
  id: string;
  status: VendorStatus;
  data: OnboardingInput;
  updatedAt: string;
}
export interface Service {
  id: string;
  vendorId: string;
  name: LocalizedText;
  description: LocalizedText;
  categoryId: string;
  images: string[];
  duration: number;
  regularPrice: Money;
  salePrice?: Money;
  branchIds: string[];
  staffIds: string[];
  bufferMinutes: number;
  gender: "ALL" | "WOMEN" | "MEN";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  variants: {
    id: string;
    name: LocalizedText;
    duration: number;
    price: Money;
  }[];
}
export interface Branch {
  id: string;
  vendorId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  timezone: string;
  phone: string;
  bookingEnabled: boolean;
}
export interface InventoryTransaction {
  id: string;
  branchId: string;
  variantId: string;
  type:
    "STOCK_IN" | "STOCK_OUT" | "SALE" | "RETURN" | "ADJUSTMENT" | "TRANSFER";
  quantity: number;
  reason: string;
  referenceId: string;
  createdAt: string;
}
export interface LedgerEntry {
  id: string;
  vendorId: string;
  transactionId: string;
  amount: Money;
  account: "PENDING" | "AVAILABLE" | "PROCESSING" | "PAID";
  direction: "DEBIT" | "CREDIT";
  createdAt: string;
}
export interface CommissionSnapshot {
  ruleId: string;
  version: number;
  scope: "GLOBAL" | "VENDOR" | "CATEGORY" | "PRODUCT" | "SERVICE";
  basis: Money;
  rateBps: number;
  amount: Money;
}
export interface AuditEvent {
  readonly id: string;
  readonly actorId: string;
  readonly action: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly oldValues: Readonly<Record<string, unknown>>;
  readonly newValues: Readonly<Record<string, unknown>>;
  readonly timestamp: string;
  readonly sessionId?: string;
  readonly ip?: string;
}
