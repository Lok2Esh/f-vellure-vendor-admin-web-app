// Generated from docs/api/vellure_api_reference.md. Run npm run api:generate after updating the reference.
export interface EndpointDefinition { method:'GET'|'POST'|'PUT'|'PATCH'|'DELETE';path:string;audience:'public'|'customer'|'vendor'|'vendor-owner'|'admin'|'admin-vendor'|'customer-vendor'|'webhook';availability:'live'|'blueprint' }
export const endpoints = {
  "getCustomersProfile": {
    "method": "GET",
    "path": "/customers/profile",
    "audience": "customer",
    "availability": "blueprint"
  },
  "patchCustomersProfile": {
    "method": "PATCH",
    "path": "/customers/profile",
    "audience": "customer",
    "availability": "blueprint"
  },
  "getAddresses": {
    "method": "GET",
    "path": "/addresses",
    "audience": "customer",
    "availability": "blueprint"
  },
  "postAddresses": {
    "method": "POST",
    "path": "/addresses",
    "audience": "customer",
    "availability": "blueprint"
  },
  "patchAddressesById": {
    "method": "PATCH",
    "path": "/addresses/:id",
    "audience": "customer",
    "availability": "blueprint"
  },
  "deleteAddressesById": {
    "method": "DELETE",
    "path": "/addresses/:id",
    "audience": "customer",
    "availability": "blueprint"
  },
  "postAddressesByIdSetDefault": {
    "method": "POST",
    "path": "/addresses/:id/set-default",
    "audience": "customer",
    "availability": "blueprint"
  },
  "getVendors": {
    "method": "GET",
    "path": "/vendors",
    "audience": "public",
    "availability": "blueprint"
  },
  "getVendorsBySlug": {
    "method": "GET",
    "path": "/vendors/:slug",
    "audience": "public",
    "availability": "blueprint"
  },
  "postVendorsRegister": {
    "method": "POST",
    "path": "/vendors/register",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "getVendorsMe": {
    "method": "GET",
    "path": "/vendors/me",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "patchVendorsMe": {
    "method": "PATCH",
    "path": "/vendors/me",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "postVendorsMeDocuments": {
    "method": "POST",
    "path": "/vendors/me/documents",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "getBranches": {
    "method": "GET",
    "path": "/branches",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "postBranches": {
    "method": "POST",
    "path": "/branches",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "patchBranchesById": {
    "method": "PATCH",
    "path": "/branches/:id",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "getBranchesByIdHours": {
    "method": "GET",
    "path": "/branches/:id/hours",
    "audience": "public",
    "availability": "blueprint"
  },
  "putBranchesByIdHours": {
    "method": "PUT",
    "path": "/branches/:id/hours",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "getStaff": {
    "method": "GET",
    "path": "/staff",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "postStaff": {
    "method": "POST",
    "path": "/staff",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "patchStaffById": {
    "method": "PATCH",
    "path": "/staff/:id",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "getStaffByIdSchedule": {
    "method": "GET",
    "path": "/staff/:id/schedule",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "putStaffByIdSchedule": {
    "method": "PUT",
    "path": "/staff/:id/schedule",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "getStaffByIdTimeOff": {
    "method": "GET",
    "path": "/staff/:id/time-off",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "postStaffByIdTimeOff": {
    "method": "POST",
    "path": "/staff/:id/time-off",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "getCategories": {
    "method": "GET",
    "path": "/categories",
    "audience": "public",
    "availability": "blueprint"
  },
  "getServices": {
    "method": "GET",
    "path": "/services",
    "audience": "public",
    "availability": "blueprint"
  },
  "getServicesById": {
    "method": "GET",
    "path": "/services/:id",
    "audience": "public",
    "availability": "blueprint"
  },
  "postServices": {
    "method": "POST",
    "path": "/services",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "patchServicesById": {
    "method": "PATCH",
    "path": "/services/:id",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "deleteServicesById": {
    "method": "DELETE",
    "path": "/services/:id",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "putServicesByIdStaff": {
    "method": "PUT",
    "path": "/services/:id/staff",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "putServicesByIdBranches": {
    "method": "PUT",
    "path": "/services/:id/branches",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "getProducts": {
    "method": "GET",
    "path": "/products",
    "audience": "public",
    "availability": "blueprint"
  },
  "getProductsBySlug": {
    "method": "GET",
    "path": "/products/:slug",
    "audience": "public",
    "availability": "blueprint"
  },
  "postProducts": {
    "method": "POST",
    "path": "/products",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "patchProductsById": {
    "method": "PATCH",
    "path": "/products/:id",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "getInventory": {
    "method": "GET",
    "path": "/inventory",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "postInventoryAdjust": {
    "method": "POST",
    "path": "/inventory/adjust",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "getInventoryTransactions": {
    "method": "GET",
    "path": "/inventory/transactions",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "getAppointmentsSlots": {
    "method": "GET",
    "path": "/appointments/slots",
    "audience": "public",
    "availability": "blueprint"
  },
  "postAppointments": {
    "method": "POST",
    "path": "/appointments",
    "audience": "customer",
    "availability": "blueprint"
  },
  "getAppointmentsMy": {
    "method": "GET",
    "path": "/appointments/my",
    "audience": "customer",
    "availability": "blueprint"
  },
  "getAppointmentsById": {
    "method": "GET",
    "path": "/appointments/:id",
    "audience": "customer-vendor",
    "availability": "blueprint"
  },
  "patchAppointmentsByIdConfirm": {
    "method": "PATCH",
    "path": "/appointments/:id/confirm",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "patchAppointmentsByIdStart": {
    "method": "PATCH",
    "path": "/appointments/:id/start",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "patchAppointmentsByIdComplete": {
    "method": "PATCH",
    "path": "/appointments/:id/complete",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "patchAppointmentsByIdCancel": {
    "method": "PATCH",
    "path": "/appointments/:id/cancel",
    "audience": "customer-vendor",
    "availability": "blueprint"
  },
  "patchAppointmentsByIdReschedule": {
    "method": "PATCH",
    "path": "/appointments/:id/reschedule",
    "audience": "customer-vendor",
    "availability": "blueprint"
  },
  "getCarts": {
    "method": "GET",
    "path": "/carts",
    "audience": "customer",
    "availability": "blueprint"
  },
  "postCartsItems": {
    "method": "POST",
    "path": "/carts/items",
    "audience": "customer",
    "availability": "blueprint"
  },
  "patchCartsItemsById": {
    "method": "PATCH",
    "path": "/carts/items/:id",
    "audience": "customer",
    "availability": "blueprint"
  },
  "deleteCartsItemsById": {
    "method": "DELETE",
    "path": "/carts/items/:id",
    "audience": "customer",
    "availability": "blueprint"
  },
  "postOrders": {
    "method": "POST",
    "path": "/orders",
    "audience": "customer",
    "availability": "blueprint"
  },
  "getOrdersMy": {
    "method": "GET",
    "path": "/orders/my",
    "audience": "customer",
    "availability": "blueprint"
  },
  "getOrdersVendor": {
    "method": "GET",
    "path": "/orders/vendor",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "getOrdersById": {
    "method": "GET",
    "path": "/orders/:id",
    "audience": "customer-vendor",
    "availability": "blueprint"
  },
  "patchOrdersByIdAccept": {
    "method": "PATCH",
    "path": "/orders/:id/accept",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "patchOrdersByIdDispatch": {
    "method": "PATCH",
    "path": "/orders/:id/dispatch",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "patchOrdersByIdDeliver": {
    "method": "PATCH",
    "path": "/orders/:id/deliver",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "patchOrdersByIdCancel": {
    "method": "PATCH",
    "path": "/orders/:id/cancel",
    "audience": "customer-vendor",
    "availability": "blueprint"
  },
  "postPaymentsInitialize": {
    "method": "POST",
    "path": "/payments/initialize",
    "audience": "customer",
    "availability": "blueprint"
  },
  "postPaymentsWebhooksByGateway": {
    "method": "POST",
    "path": "/payments/webhooks/:gateway",
    "audience": "webhook",
    "availability": "blueprint"
  },
  "getPaymentsByIdStatus": {
    "method": "GET",
    "path": "/payments/:id/status",
    "audience": "customer-vendor",
    "availability": "blueprint"
  },
  "postPaymentsByIdRefund": {
    "method": "POST",
    "path": "/payments/:id/refund",
    "audience": "admin-vendor",
    "availability": "blueprint"
  },
  "getLedgerSummary": {
    "method": "GET",
    "path": "/ledger/summary",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "getLedgerEntries": {
    "method": "GET",
    "path": "/ledger/entries",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "getPayouts": {
    "method": "GET",
    "path": "/payouts",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "postPayoutsRequest": {
    "method": "POST",
    "path": "/payouts/request",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "getVendorsBankAccounts": {
    "method": "GET",
    "path": "/vendors/bank-accounts",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "postVendorsBankAccounts": {
    "method": "POST",
    "path": "/vendors/bank-accounts",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "getReviewsVendorByVendorId": {
    "method": "GET",
    "path": "/reviews/vendor/:vendorId",
    "audience": "public",
    "availability": "blueprint"
  },
  "getReviewsServiceByServiceId": {
    "method": "GET",
    "path": "/reviews/service/:serviceId",
    "audience": "public",
    "availability": "blueprint"
  },
  "postReviews": {
    "method": "POST",
    "path": "/reviews",
    "audience": "customer",
    "availability": "blueprint"
  },
  "postReviewsByIdReply": {
    "method": "POST",
    "path": "/reviews/:id/reply",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "postReviewsByIdReport": {
    "method": "POST",
    "path": "/reviews/:id/report",
    "audience": "customer-vendor",
    "availability": "blueprint"
  },
  "getPromotionsActive": {
    "method": "GET",
    "path": "/promotions/active",
    "audience": "public",
    "availability": "blueprint"
  },
  "postCouponsValidate": {
    "method": "POST",
    "path": "/coupons/validate",
    "audience": "customer",
    "availability": "blueprint"
  },
  "postPromotions": {
    "method": "POST",
    "path": "/promotions",
    "audience": "vendor-owner",
    "availability": "blueprint"
  },
  "getPromotions": {
    "method": "GET",
    "path": "/promotions",
    "audience": "vendor",
    "availability": "blueprint"
  },
  "postSupportTickets": {
    "method": "POST",
    "path": "/support/tickets",
    "audience": "customer-vendor",
    "availability": "blueprint"
  },
  "getSupportTickets": {
    "method": "GET",
    "path": "/support/tickets",
    "audience": "customer-vendor",
    "availability": "blueprint"
  },
  "postSupportTicketsByIdMessages": {
    "method": "POST",
    "path": "/support/tickets/:id/messages",
    "audience": "customer-vendor",
    "availability": "blueprint"
  },
  "postDisputes": {
    "method": "POST",
    "path": "/disputes",
    "audience": "customer",
    "availability": "blueprint"
  },
  "getDisputesById": {
    "method": "GET",
    "path": "/disputes/:id",
    "audience": "customer-vendor",
    "availability": "blueprint"
  },
  "getAdminMetrics": {
    "method": "GET",
    "path": "/admin/metrics",
    "audience": "admin",
    "availability": "blueprint"
  },
  "getAdminVendors": {
    "method": "GET",
    "path": "/admin/vendors",
    "audience": "admin",
    "availability": "blueprint"
  },
  "patchAdminVendorsByIdVerify": {
    "method": "PATCH",
    "path": "/admin/vendors/:id/verify",
    "audience": "admin",
    "availability": "blueprint"
  },
  "patchAdminVendorsByIdSuspend": {
    "method": "PATCH",
    "path": "/admin/vendors/:id/suspend",
    "audience": "admin",
    "availability": "blueprint"
  },
  "getAdminPayouts": {
    "method": "GET",
    "path": "/admin/payouts",
    "audience": "admin",
    "availability": "blueprint"
  },
  "postAdminPayoutsByIdApprove": {
    "method": "POST",
    "path": "/admin/payouts/:id/approve",
    "audience": "admin",
    "availability": "blueprint"
  },
  "getAdminCommissionRules": {
    "method": "GET",
    "path": "/admin/commission-rules",
    "audience": "admin",
    "availability": "blueprint"
  },
  "postAdminCommissionRules": {
    "method": "POST",
    "path": "/admin/commission-rules",
    "audience": "admin",
    "availability": "blueprint"
  },
  "getAdminAuditLogs": {
    "method": "GET",
    "path": "/admin/audit-logs",
    "audience": "admin",
    "availability": "blueprint"
  }
} as const satisfies Record<string,EndpointDefinition>;
export type EndpointKey=keyof typeof endpoints;
