/** Integration model, not a second implementation of the marketplace backend.
 * IDs are opaque; timestamps are ISO 8601 UTC; monetary amounts are integer paisa.
 */
import type {
  Appointment,
  Branch,
  Service,
  InventoryTransaction,
  AppointmentStatus,
  AuditEvent,
  CommissionSnapshot,
  LedgerEntry,
  LocalizedText,
  Money,
  OrderStatus,
  PayoutStatus,
  Permission,
  VendorStatus,
} from "./domain";
import type { MARKET_CONFIG, Language } from "./market";
export interface Entity {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
export interface VendorEntity extends Entity {
  vendorId: string;
}
export interface User extends Entity {
  displayName: string;
  emailMasked: string;
  phoneMasked: string;
  locale: Language;
  status: "ACTIVE" | "BLOCKED";
}
export interface Address extends Entity {
  userId: string;
  line1: string;
  line2?: string;
  cityId: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  country: typeof MARKET_CONFIG.country.code;
  landmark?: string;
  district?: string;
  state?: string;
}
export interface Vendor extends Entity {
  ownerId: string;
  name: LocalizedText;
  description: LocalizedText;
  status: VendorStatus;
  categoryIds: string[];
  logoMediaId?: string;
}
export interface VendorDocument extends VendorEntity {
  type: "IDENTITY" | "BUSINESS_REGISTRATION" | "TAX";
  mediaId: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  expiresAt?: string;
}
export interface VendorBankAccount extends VendorEntity {
  accountHolder: string;
  bankName: string;
  ibanMasked: string;
  // Legacy wire field retained until the backend bank DTO is versioned.
  accountNumberMasked?: string;
  ifscCode?: string;
  branchName?: string;
  verifiedAt?: string;
  providerReference: string;
}
export interface BranchHours extends Entity {
  branchId: string;
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  opensAt: string;
  closesAt: string;
  closed: boolean;
}
export interface Staff extends VendorEntity {
  name: string;
  photoMediaId?: string;
  role: string;
  branchIds: string[];
  serviceIds: string[];
  commissionRuleId?: string;
  status: "ACTIVE" | "INACTIVE";
}
export interface StaffSchedule extends VendorEntity {
  staffId: string;
  branchId: string;
  startsAt: string;
  endsAt: string;
  type: "WORKING" | "BREAK" | "DAY_OFF" | "UNAVAILABLE";
}
export interface StaffService {
  staffId: string;
  serviceId: string;
  branchId: string;
}
export interface Category extends Entity {
  parentId?: string;
  name: LocalizedText;
  kind: "SERVICE" | "PRODUCT";
  rank: number;
  status: "ACTIVE" | "ARCHIVED";
}
export interface Brand extends Entity {
  name: LocalizedText;
  logoMediaId?: string;
  status: "ACTIVE" | "ARCHIVED";
}
export interface ServiceVariant extends VendorEntity {
  serviceId: string;
  name: LocalizedText;
  durationMinutes: number;
  price: Money;
  salePrice?: Money;
}
export interface Product extends VendorEntity {
  name: LocalizedText;
  description: LocalizedText;
  brandId: string;
  categoryId: string;
  mediaIds: string[];
  branchIds: string[];
  deliveryEnabled: boolean;
  publication: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";
}
export interface ProductVariant extends VendorEntity {
  productId: string;
  attributes: Record<string, LocalizedText>;
  sku: string;
  barcode?: string;
  regularPrice: Money;
  salePrice?: Money;
  costPrice: Money;
  weightGrams: number;
}
export interface Inventory extends VendorEntity {
  branchId: string;
  variantId: string;
  physical: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
}
export interface AppointmentItem extends VendorEntity {
  appointmentId: string;
  serviceVariantId: string;
  staffId: string;
  serviceNameSnapshot: LocalizedText;
  startsAt: string;
  durationMinutes: number;
  regularPrice: Money;
  discount: Money;
  total: Money;
}
export interface StatusHistory<S> {
  id: string;
  entityId: string;
  previous: S | null;
  next: S;
  actorId: string;
  reason?: string;
  createdAt: string;
}
export type AppointmentStatusHistory = StatusHistory<AppointmentStatus>;
export type OrderStatusHistory = StatusHistory<OrderStatus>;
export type VendorStatusHistory = StatusHistory<VendorStatus>;
export interface Order extends VendorEntity {
  customerId: string;
  branchId: string;
  status: OrderStatus;
  deliveryAddressSnapshot: Omit<
    Address,
    "id" | "userId" | "createdAt" | "updatedAt" | "version"
  >;
  subtotal: Money;
  discount: Money;
  deliveryFee: Money;
  platformFee: Money;
  total: Money;
  vendorEarnings: Money;
  commission: Money;
  paymentId: string;
}
export interface OrderItem extends VendorEntity {
  orderId: string;
  variantId: string;
  productNameSnapshot: LocalizedText;
  skuSnapshot: string;
  quantity: number;
  unitPrice: Money;
  discount: Money;
  total: Money;
}
export interface Payment extends Entity {
  userId: string;
  orderId?: string;
  appointmentId?: string;
  provider: string;
  providerReference: string;
  amount: Money;
  status: "PENDING" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";
  idempotencyKey: string;
}
export interface Refund extends VendorEntity {
  paymentId: string;
  amount: Money;
  reason: string;
  status:
    | "REQUESTED"
    | "APPROVED"
    | "PROCESSING"
    | "SUCCEEDED"
    | "FAILED"
    | "REJECTED";
  requestedBy: string;
  approvedBy?: string;
}
export interface CommissionRule extends Entity {
  scope: "GLOBAL" | "VENDOR" | "CATEGORY" | "PRODUCT" | "SERVICE";
  scopeId?: string;
  rateBps: number;
  fixedFee: Money;
  validFrom: string;
  validUntil?: string;
  priority: number;
  enabled: boolean;
}
export interface Commission extends Entity {
  paymentId: string;
  vendorId: string;
  snapshot: CommissionSnapshot;
}
export interface Payout extends VendorEntity {
  bankAccountId: string;
  amount: Money;
  status: PayoutStatus;
  providerReference?: string;
  ledgerEntryIds: string[];
  approvedBy?: string;
}
export interface PayoutReconciliation extends Entity {
  payoutId: string;
  actorId: string;
  event: "APPROVED" | "HELD" | "RELEASED" | "PAID" | "FAILED" | "INVESTIGATED";
  reason: string;
  externalReference?: string;
}
export interface Promotion extends VendorEntity {
  title: LocalizedText;
  type:
    "PERCENTAGE" | "FIXED" | "SERVICE" | "PRODUCT" | "BUNDLE" | "TIME_BASED";
  startsAt: string;
  endsAt: string;
  status: "DRAFT" | "PENDING" | "ACTIVE" | "EXPIRED" | "REJECTED";
}
export interface Coupon extends Entity {
  promotionId: string;
  code: string;
  usageLimit: number;
  perCustomerLimit: number;
}
export interface PromotionRule extends Entity {
  promotionId: string;
  minimumPurchase?: Money;
  maximumDiscount?: Money;
  rateBps?: number;
  discount?: Money;
  branchIds: string[];
  categoryIds: string[];
  productIds: string[];
  serviceIds: string[];
  firstOrderOnly: boolean;
}
export interface Review extends VendorEntity {
  customerId: string;
  appointmentId?: string;
  orderId?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  moderationStatus: "PENDING" | "VISIBLE" | "HIDDEN";
}
export interface ReviewReply extends VendorEntity {
  reviewId: string;
  actorId: string;
  text: string;
}
export interface ReviewReport extends VendorEntity {
  reviewId: string;
  reason: string;
  status: "OPEN" | "RESOLVED" | "DISMISSED";
}
export type NotificationChannel = "IN_APP" | "PUSH" | "SMS" | "EMAIL";
export type NotificationEvent =
  | "APPOINTMENT_CREATED"
  | "APPOINTMENT_CONFIRMED"
  | "APPOINTMENT_CANCELLED"
  | "APPOINTMENT_REMINDER"
  | "ORDER_CREATED"
  | "ORDER_STATUS_CHANGED"
  | "PAYMENT_COMPLETED"
  | "REFUND_PROCESSED"
  | "PAYOUT_PROCESSED"
  | "LOW_INVENTORY"
  | "NEW_REVIEW"
  | "VENDOR_APPROVAL_UPDATE";
export interface Notification extends Entity {
  userId: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  title: LocalizedText;
  body: LocalizedText;
  deepLink: string;
  readAt?: string;
  deliveryStatus: "PENDING" | "SENT" | "FAILED";
}
export interface NotificationPreference {
  userId: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  enabled: boolean;
}
export interface NotificationTemplate extends Entity {
  event: NotificationEvent;
  channel: NotificationChannel;
  title: LocalizedText;
  body: LocalizedText;
  variableNames: string[];
}
export interface SupportTicket extends Entity {
  userId: string;
  vendorId?: string;
  assignedTo?: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
}
export interface Dispute extends VendorEntity {
  orderId?: string;
  appointmentId?: string;
  ticketId: string;
  reason: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  resolution?: string;
}
export interface CmsSection extends Entity {
  title: LocalizedText;
  kind:
    | "HERO"
    | "VENDORS"
    | "SERVICES"
    | "PRODUCTS"
    | "DEALS"
    | "CATEGORIES"
    | "ANNOUNCEMENT";
  entityIds: string[];
  state: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  rank: number;
  startsAt?: string;
  endsAt?: string;
  deepLink?: string;
}
export interface Banner extends Entity {
  sectionId: string;
  title: LocalizedText;
  mediaEnId: string;
  mediaUrId: string;
  deepLink: string;
  rank: number;
  startsAt?: string;
  endsAt?: string;
  state: CmsSection["state"];
}
export interface AdminUser extends Entity {
  userId: string;
  roleIds: string[];
  status: "ACTIVE" | "SUSPENDED";
  mfaEnabled: boolean;
}
export interface Role extends Entity {
  name: string;
  workspace: "vendor" | "admin";
  description: string;
}
export interface PermissionEntity {
  id: string;
  key: Permission;
  description: string;
}
export interface RolePermission {
  roleId: string;
  permissionId: string;
}
export interface EntityMap {
  appointments: Appointment;
  branches: Branch;
  services: Service;
  inventory_transactions: InventoryTransaction;
  users: User;
  addresses: Address;
  vendors: Vendor;
  vendor_documents: VendorDocument;
  vendor_bank_accounts: VendorBankAccount;
  branch_hours: BranchHours;
  staff: Staff;
  staff_schedules: StaffSchedule;
  staff_services: StaffService;
  categories: Category;
  brands: Brand;
  service_variants: ServiceVariant;
  products: Product;
  product_variants: ProductVariant;
  inventory: Inventory;
  appointment_items: AppointmentItem;
  appointment_status_history: AppointmentStatusHistory;
  orders: Order;
  order_items: OrderItem;
  order_status_history: OrderStatusHistory;
  payments: Payment;
  refunds: Refund;
  ledger_entries: LedgerEntry;
  commissions: Commission;
  commission_rules: CommissionRule;
  payouts: Payout;
  promotions: Promotion;
  coupons: Coupon;
  promotion_rules: PromotionRule;
  reviews: Review;
  review_replies: ReviewReply;
  review_reports: ReviewReport;
  notifications: Notification;
  support_tickets: SupportTicket;
  disputes: Dispute;
  cms_sections: CmsSection;
  banners: Banner;
  admin_users: AdminUser;
  roles: Role;
  permissions: PermissionEntity;
  role_permissions: RolePermission;
  audit_logs: AuditEvent;
}
