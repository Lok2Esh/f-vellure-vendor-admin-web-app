import { MARKET_CONFIG } from "@/platform/market";
import { z } from "zod";
import { appointmentStatuses, onboardingDraftSchema } from "./domain";
const moneySchema = z.object({
  amount: z.number().int().nonnegative(),
  currency: z.literal(MARKET_CONFIG.currency.code),
});
const count = z.number().int().nonnegative();
const appointmentSchema = z.object({
  id: z.string(),
  customer: z.string(),
  initials: z.string(),
  service: z.string(),
  staff: z.string(),
  branchId: z.string(),
  startsAt: z.iso.datetime(),
  duration: z.number().positive(),
  price: moneySchema,
  status: z.enum(appointmentStatuses),
  payment: z.enum(["PAID", "UNPAID"]),
  notes: z.string(),
});
export const dashboardSchema = z.object({
  businessName: z.string(),
  branches: z.array(z.object({ value: z.string(), label: z.string() })),
  businessHours: z.string(),
  occupancyPercent: z.number().min(0).max(100),
  changes: z.object({
    revenue: z.string(),
    appointments: z.string(),
    orders: z.string(),
    rating: z.string(),
    periodRevenue: z.string(),
  }),
  date: z.iso.datetime(),
  revenue: moneySchema,
  appointments: count,
  orders: count,
  pendingAppointments: count,
  pendingOrders: count,
  rating: z.number().min(0).max(5),
  ratingCount: count,
  lowStock: count,
  upcoming: count,
  serviceRevenue: moneySchema,
  productRevenue: moneySchema,
  trend: z
    .array(z.object({ label: z.string(), services: count, products: count }))
    .min(2),
  appointmentsList: z.array(appointmentSchema),
  payout: z.object({
    amount: moneySchema,
    expectedAt: z.iso.datetime(),
    bankVerified: z.boolean(),
  }),
  inventory: z.array(
    z.object({
      name: z.string(),
      sku: z.string(),
      available: count,
      threshold: count,
    }),
  ),
  reviews: z.array(
    z.object({
      name: z.string(),
      service: z.string(),
      rating: z.number().min(1).max(5),
      text: z.string(),
    }),
  ),
  actionOrders: z.array(
    z.object({
      id: z.string(),
      customer: z.string(),
      items: count,
      total: moneySchema,
      status: z.enum([
        "NEW",
        "ACCEPTED",
        "PREPARING",
        "READY",
        "DISPATCHED",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
      ]),
    }),
  ),
});
export const applicationSchema = z.object({
  id: z.string(),
  status: z.enum([
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "CHANGES_REQUESTED",
    "APPROVED",
    "REJECTED",
    "SUSPENDED",
    "BLOCKED",
  ]),
  data: onboardingDraftSchema,
  updatedAt: z.iso.datetime(),
});
