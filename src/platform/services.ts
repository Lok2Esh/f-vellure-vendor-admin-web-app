import {
  Appointment,
  AppointmentStatus,
  Dashboard,
  InventoryTransaction,
  ListQuery,
  LocalizedText,
  Money,
  OnboardingInput,
  PageResult,
  VendorApplication,
} from "./domain";
import { applicationSchema, dashboardSchema } from "./response-schemas";

export interface VendorService {
  dashboard(
    query: { period: string; branchId: string },
    signal?: AbortSignal,
  ): Promise<Dashboard>;
  application(signal?: AbortSignal): Promise<VendorApplication | null>;
  saveApplication(
    input: OnboardingInput,
    submit: boolean,
  ): Promise<VendorApplication>;
}
export interface AppointmentService {
  list(query: ListQuery): Promise<PageResult<Appointment>>;
  get(id: string): Promise<Appointment>;
  transition(
    id: string,
    status: AppointmentStatus,
    version: number,
    reason?: string,
  ): Promise<Appointment>;
  reschedule(id: string, slotId: string, version: number): Promise<Appointment>;
}
export interface AvailabilityService {
  slots(input: {
    serviceId: string;
    branchId: string;
    staffId?: string;
    date: string;
  }): Promise<{ id: string; startsAt: string; staffId: string }[]>;
}
export interface InventoryService {
  record(
    input: Omit<InventoryTransaction, "id" | "createdAt">,
    idempotencyKey: string,
  ): Promise<InventoryTransaction>;
}
export interface PaymentProvider {
  createPayment(input: {
    amount: Money;
    reference: string;
    idempotencyKey: string;
  }): Promise<{ id: string; redirectUrl: string }>;
  verifyWebhook(
    body: string,
    signature: string,
  ): Promise<{ id: string; status: string }>;
}
export interface SmsProvider {
  send(
    to: string,
    template: string,
    variables: Record<string, string>,
  ): Promise<string>;
}
export interface EmailProvider {
  send(
    to: string,
    template: string,
    variables: Record<string, string>,
  ): Promise<string>;
}
export interface PushProvider {
  send(
    userId: string,
    title: LocalizedText,
    body: LocalizedText,
    deepLink: string,
  ): Promise<string>;
}
export interface StorageProvider {
  presign(input: {
    mime: string;
    size: number;
    purpose: string;
  }): Promise<{ uploadUrl: string; mediaId: string }>;
}
export interface GeocodingProvider {
  search(
    query: string,
    options?: { countryCode?: string; latitude?: number; longitude?: number },
  ): Promise<{ address: string; lat: number; lng: number }[]>;
}
export interface SearchProvider {
  search(input: {
    query: string;
    lat: number;
    lng: number;
    radiusKm: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    availableAt?: string;
  }): Promise<{ ids: string[]; total: number }>;
}
export interface AnalyticsProvider {
  track(
    event: string,
    properties: Record<string, string | number>,
  ): Promise<void>;
}
export interface ErrorMonitoringProvider {
  capture(error: Error, context: Record<string, string>): void;
}
async function request<T>(
  path: string,
  init: RequestInit | undefined,
  schema: import("zod").ZodType<T>,
): Promise<T> {
  const response = await fetch(`/api/portal/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Something went wrong. Please try again.");
  }
  const parsed = schema.safeParse(await response.json());
  if (!parsed.success)
    throw new Error(
      "The service returned an unexpected response. Please contact support.",
    );
  return parsed.data;
}
export const vendorService: VendorService = {
  dashboard: ({ period, branchId }, signal) =>
    request(
      `dashboard?${new URLSearchParams({ period, branchId })}`,
      {
        signal,
      },
      dashboardSchema,
    ),
  application: (signal) =>
    request("application", { signal }, applicationSchema.nullable()),
  saveApplication: (data, submit) =>
    request(
      "application",
      {
        method: "POST",
        body: JSON.stringify({ data, submit }),
      },
      applicationSchema,
    ),
};
