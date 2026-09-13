import { Permission } from "./domain";
export interface ModuleRoute {
  path: string;
  label: string;
  group: string;
  permission: Permission;
  phase: number;
}
const vendorGroups: {
  group: string;
  phase: number;
  permission: Permission;
  items: [string, string][];
}[] = [
  {
    group: "Workspace",
    phase: 2,
    permission: "dashboard.view",
    items: [["dashboard", "Overview"]],
  },
  {
    group: "Workspace",
    phase: 3,
    permission: "appointment.view",
    items: [
      ["appointments", "Appointments"],
      ["calendar", "Calendar"],
    ],
  },
  {
    group: "Workspace",
    phase: 4,
    permission: "order.view",
    items: [["orders", "Orders"]],
  },
  {
    group: "Manage",
    phase: 2,
    permission: "catalog.edit",
    items: [["services", "Services"]],
  },
  {
    group: "Manage",
    phase: 4,
    permission: "catalog.edit",
    items: [
      ["products", "Products"],
      ["inventory", "Inventory"],
    ],
  },
  {
    group: "Manage",
    phase: 2,
    permission: "staff.edit",
    items: [["staff", "Staff"]],
  },
  {
    group: "Manage",
    phase: 2,
    permission: "branch.edit",
    items: [["branches", "Branches"]],
  },
  {
    group: "Grow",
    phase: 7,
    permission: "customer.view",
    items: [["customers", "Customers"]],
  },
  {
    group: "Grow",
    phase: 5,
    permission: "promotion.create",
    items: [["promotions", "Promotions"]],
  },
  {
    group: "Grow",
    phase: 5,
    permission: "review.reply",
    items: [["reviews", "Reviews"]],
  },
  {
    group: "Business",
    phase: 5,
    permission: "finance.view",
    items: [
      ["finance", "Finance"],
      ["analytics", "Analytics"],
    ],
  },
  {
    group: "Business",
    phase: 9,
    permission: "vendor.view",
    items: [
      ["profile", "Business profile"],
      ["notifications", "Notifications"],
      ["support", "Help & support"],
      ["settings", "Settings"],
      ["features", "App features"],
    ],
  },
];
export const vendorRoutes: ModuleRoute[] = vendorGroups.flatMap((g) =>
  g.items.map(([path, label]) => ({
    path: `/vendor/${path}`,
    label,
    group: g.group,
    permission: g.permission,
    phase: g.phase,
  })),
);
export const adminRoutes: ModuleRoute[] = [
  ["dashboard", "Overview"],
  ["vendors", "Vendors"],
  ["branches", "Branches"],
  ["catalog/categories", "Categories"],
  ["catalog/brands", "Brands"],
  ["catalog/services", "Services"],
  ["catalog/products", "Products"],
  ["appointments", "Appointments"],
  ["orders", "Orders"],
  ["customers", "Customers"],
  ["reviews", "Reviews"],
  ["moderation", "Moderation"],
  ["transactions", "Transactions"],
  ["refunds", "Refunds"],
  ["commissions", "Commissions"],
  ["payouts", "Payouts"],
  ["promotions", "Promotions"],
  ["coupons", "Coupons"],
  ["content", "Content"],
  ["notifications", "Notifications"],
  ["support", "Support"],
  ["disputes", "Disputes"],
  ["locations", "Locations"],
  ["service-areas", "Service areas"],
  ["analytics", "Analytics"],
  ["users", "Admin users"],
  ["roles", "Roles"],
  ["permissions", "Permissions"],
  ["audit-logs", "Audit logs"],
  ["settings", "Settings"],
].map(([path, label]) => ({
  path: `/admin/${path}`,
  label,
  group: ["dashboard", "vendors", "branches", "moderation"].includes(path)
    ? "Operations"
    : ["transactions", "refunds", "commissions", "payouts"].includes(path)
      ? "Finance"
      : "Marketplace",
  permission: (["transactions", "refunds", "commissions", "payouts"].includes(
    path,
  )
    ? "finance.view"
    : ["users", "roles", "permissions", "audit-logs", "settings"].includes(path)
      ? "admin.manage"
      : path === "dashboard"
        ? "dashboard.view"
        : path === "customers"
          ? "customer.view"
          : path === "orders"
            ? "order.view"
            : path === "appointments"
              ? "appointment.view"
              : path.startsWith("content")
                ? "content.edit"
                : "vendor.view") as Permission,
  phase: 6,
}));
export const vendorChildren = [
  "appointments/[id]",
  "orders/[id]",
  "services/new",
  "services/[id]",
  "products/new",
  "products/[id]",
  "staff/new",
  "staff/[id]",
  "branches/new",
  "branches/[id]",
  "customers/[id]",
  "promotions/new",
  "promotions/[id]",
  "finance/transactions",
  "finance/payouts",
  "finance/invoices",
];
export const adminChildren = [
  "vendors/applications",
  "vendors/[id]",
  "customers/[id]",
  "content/banners",
  "content/featured",
];
