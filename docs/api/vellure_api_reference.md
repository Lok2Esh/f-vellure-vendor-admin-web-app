# Vellure Platform — Complete API Reference for Frontend Applications

This reference document is designed for the frontend development teams building the **Customer Mobile Application**, **Vendor Web Portal**, and **Vellure Admin Console**.

---

## 1. Global API Standards

### Base URLs & Environments
| Environment | Base URL | Swagger UI Docs |
|---|---|---|
| **Local Development** | `http://localhost:3000/api/v1` | `http://localhost:3000/api/docs` |
| **Staging / Neon** | `https://api-staging.vellure.pk/api/v1` | `https://api-staging.vellure.pk/api/docs` |
| **Production** | `https://api.vellure.pk/api/v1` | `https://api.vellure.pk/api/docs` |

> [!NOTE]
> Health check probes (`/health`, `/health/liveness`, `/health/readiness`) are served directly from the root without the `/api/v1` prefix.

---

### Standard Request Headers
```http
Content-Type: application/json
Authorization: Bearer <access_token>        # (Omit on @Public endpoints)
Accept-Language: en                         # 'en' for English, 'ur' for Urdu
X-Correlation-ID: <uuid>                    # Optional: client trace ID (auto-generated if omitted)
X-Vendor-ID: <vendor-uuid>                  # Required on multi-tenant vendor routes
Idempotency-Key: <unique-key>               # Recommended for checkout, booking, and payment operations
```

---

### Standard Response Envelope

#### 1. Single Entity / Object Response
```json
{
  "data": {
    "id": "c1f7b0f2-e25b-4395-812a-360699042b36",
    "name": "Bridal Hair & Makeup",
    "regularPrice": "15000.00",
    "currency": "PKR"
  }
}
```

#### 2. Paginated List Response
```json
{
  "data": [
    { "id": "1", "name": "Item A" },
    { "id": "2", "name": "Item B" }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 54,
    "totalPages": 3
  }
}
```

#### 3. Standard Error Envelope
HTTP status codes `400`, `401`, `403`, `404`, `409`, `422`, `500` will always return:
```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email/phone or password",
    "details": {}
  }
}
```
Validation error example (`422 Unprocessable Entity`):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "phone": [
        "Invalid Pakistani mobile phone number: 12345. Expected format: +923XXXXXXXXX"
      ],
      "password": [
        "Password must contain uppercase, lowercase, and a number or symbol"
      ]
    }
  }
}
```

---

## 2. Currently Live & Testable Endpoints (Phase 1 Foundation)

These endpoints are currently active, tested against the live Neon PostgreSQL database, and ready for frontend integration right now.

### System Health
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/health` | Public | System status, uptime, DB connectivity |
| `GET` | `/health/liveness` | Public | Process liveness probe |
| `GET` | `/health/readiness` | Public | Neon DB readiness probe |

---

### Authentication (`/auth`)

#### 1. `POST /api/v1/auth/register`
- **Access**: Public
- **Description**: Registers a new Customer or Vendor Owner.
- **Request Body**:
```json
{
  "firstName": "Fatima",
  "lastName": "Ahmed",
  "email": "fatima.ahmed@example.com",
  "phone": "03001234567",
  "password": "SecurePassword123!",
  "role": "CUSTOMER"
}
```
> Note: `phone` accepts `03001234567`, `0300 1234567`, `+923001234567`. Role can be `CUSTOMER` or `VENDOR_OWNER`.

- **Success Response (`201 Created`)**:
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "8bf17de5e505888e223cfeb864ecf3d9943486338...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "76d8b2ff-ff0a-4286-9040-5fa5fe3f8a00",
      "email": "fatima.ahmed@example.com",
      "phone": "+923001234567",
      "firstName": "Fatima",
      "lastName": "Ahmed",
      "status": "ACTIVE",
      "roles": ["CUSTOMER"],
      "permissions": ["vendor.view", "branch.view", "service.view", "product.view"],
      "vendorIds": []
    }
  }
}
```

---

#### 2. `POST /api/v1/auth/login`
- **Access**: Public
- **Description**: Authenticates with either **email** OR **Pakistani mobile number** and returns tokens with user roles.
- **Request Body**:
```json
{
  "identifier": "admin@vellure.pk",
  "password": "VellureAdmin2026!#",
  "device": "Chrome Web",
  "platform": "macOS"
}
```
*(Or mobile login)*:
```json
{
  "identifier": "03001234567",
  "password": "SecurePassword123!"
}
```

- **Success Response (`200 OK`)**:
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "48bf17de5e505888e223cfeb864ecf3d9943486338...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "e422ec22-0d19-4828-98e6-e17fca13f9c6",
      "email": "admin@vellure.pk",
      "phone": "+923000000000",
      "firstName": "Vellure",
      "lastName": "Super Admin",
      "status": "ACTIVE",
      "roles": ["SUPER_ADMIN"],
      "permissions": [
        "vendor.view", "vendor.create", "vendor.edit", "vendor.approve", "vendor.suspend",
        "branch.view", "branch.create", "branch.edit",
        "staff.view", "staff.manage",
        "service.view", "service.create", "service.edit", "service.approve",
        "product.view", "product.create", "product.edit", "product.approve", "inventory.manage",
        "appointment.view", "appointment.create", "appointment.manage", "appointment.cancel",
        "order.view", "order.manage", "order.cancel",
        "finance.view", "payout.request", "payout.view", "payout.process",
        "review.view", "review.reply", "review.moderate",
        "promotion.create", "promotion.manage",
        "dispute.view", "dispute.resolve",
        "refund.create", "refund.approve"
      ],
      "vendorIds": []
    }
  }
}
```

---

#### 3. `POST /api/v1/auth/refresh`
- **Access**: Public
- **Description**: Rotates refresh token, invalidating the old token and returning a brand new token pair.
- **Request Body**:
```json
{
  "refreshToken": "48bf17de5e505888e223cfeb864ecf3d9943486338..."
}
```
- **Success Response (`200 OK`)**:
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "9cae7284b1257fae13028cba67839211cde048...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": { ... }
  }
}
```

---

#### 4. `POST /api/v1/auth/logout`
- **Access**: Bearer Token required
- **Description**: Revokes the current session immediately.
- **Headers**: `Authorization: Bearer <access_token>`
- **Success Response (`200 OK`)**:
```json
{
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

#### 5. `GET /api/v1/auth/me`
- **Access**: Bearer Token required
- **Description**: Returns current authenticated user profile, active roles, and granted permissions.
- **Headers**: `Authorization: Bearer <access_token>`
- **Success Response (`200 OK`)**:
```json
{
  "data": {
    "id": "e422ec22-0d19-4828-98e6-e17fca13f9c6",
    "email": "admin@vellure.pk",
    "phone": "+923000000000",
    "firstName": "Vellure",
    "lastName": "Super Admin",
    "status": "ACTIVE",
    "roles": ["SUPER_ADMIN"],
    "permissions": ["..."],
    "vendorIds": []
  }
}
```

---

## 3. Full Platform API Blueprint (By Domain)

The following tables define the API specification across all modules of the platform.

### Customer Profile & Addresses (`/customers`, `/addresses`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/customers/profile` | Customer | Get customer profile & loyalty points |
| `PATCH` | `/customers/profile` | Customer | Update name, birth date, gender, language |
| `GET` | `/addresses` | Customer | List customer saved addresses |
| `POST` | `/addresses` | Customer | Add new delivery address (with lat/long) |
| `PATCH` | `/addresses/:id` | Customer | Update saved address |
| `DELETE` | `/addresses/:id` | Customer | Remove saved address |
| `POST` | `/addresses/:id/set-default` | Customer | Set address as default |

---

### Vendor & Branch Management (`/vendors`, `/branches`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/vendors` | Public | Browse/search active approved vendors |
| `GET` | `/vendors/:slug` | Public | Get vendor public profile, branches & ratings |
| `POST` | `/vendors/register` | Vendor Owner | Submit new vendor onboarding application |
| `GET` | `/vendors/me` | Vendor Staff | Get vendor portal dashboard profile |
| `PATCH` | `/vendors/me` | Vendor Owner | Update business details, cover, logo, bio |
| `POST` | `/vendors/me/documents` | Vendor Owner | Upload CNIC and Business registration docs |
| `GET` | `/branches` | Vendor Staff | List all branches for vendor |
| `POST` | `/branches` | Vendor Owner | Create new branch location |
| `PATCH` | `/branches/:id` | Vendor Owner | Update branch address, contact, geo-coordinates |
| `GET` | `/branches/:id/hours` | Public | Get weekly branch operating hours |
| `PUT` | `/branches/:id/hours` | Vendor Staff | Update operating schedule & breaks |

---

### Staff & Specialist Scheduling (`/staff`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/staff` | Vendor Staff | List staff members with branch assignments |
| `POST` | `/staff` | Vendor Owner | Add specialist/beautician profile |
| `PATCH` | `/staff/:id` | Vendor Owner | Update staff information, active status |
| `GET` | `/staff/:id/schedule` | Vendor Staff | View regular working hours & shift slots |
| `PUT` | `/staff/:id/schedule` | Vendor Staff | Set working days, shift start/end times |
| `GET` | `/staff/:id/time-off` | Vendor Staff | View approved/pending leaves & time-off |
| `POST` | `/staff/:id/time-off` | Vendor Staff | Request/record time off (sick, annual leave) |

---

### Service Catalog & Categories (`/services`, `/categories`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/categories` | Public | List categories (tree hierarchy, Urdu labels) |
| `GET` | `/services` | Public | Search services by category, price, gender, branch |
| `GET` | `/services/:id` | Public | Service details with variants and staff assigned |
| `POST` | `/services` | Vendor Staff | Create service with duration, price, buffer time |
| `PATCH` | `/services/:id` | Vendor Staff | Edit service pricing, description, variants |
| `DELETE` | `/services/:id` | Vendor Staff | Archive/deactivate service |
| `PUT` | `/services/:id/staff` | Vendor Staff | Assign specialists capable of performing service |
| `PUT` | `/services/:id/branches` | Vendor Staff | Enable/disable service at specific branches |

---

### Product Catalog & Inventory (`/products`, `/inventory`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/products` | Public | Search/filter beauty products (SKU, brand, price) |
| `GET` | `/products/:slug` | Public | Get product details, variants, gallery images |
| `POST` | `/products` | Vendor Staff | Create product with variants, SKU, barcode |
| `PATCH` | `/products/:id` | Vendor Staff | Update product title, pricing, specs |
| `GET` | `/inventory` | Vendor Staff | View current stock levels per branch |
| `POST` | `/inventory/adjust` | Vendor Staff | Stock-in, manual adjustment, damage write-off |
| `GET` | `/inventory/transactions` | Vendor Staff | Audit history of stock movements |

---

### Appointments & Booking Engine (`/appointments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/appointments/slots` | Public / Customer | Available booking slots (specialist + branch) |
| `POST` | `/appointments` | Customer | Book appointment (creates PENDING reservation) |
| `GET` | `/appointments/my` | Customer | Customer appointment history & upcoming |
| `GET` | `/appointments/:id` | Customer / Vendor | Appointment details, breakdown, status |
| `PATCH` | `/appointments/:id/confirm` | Vendor Staff | Confirm pending appointment |
| `PATCH` | `/appointments/:id/start` | Vendor Staff | Mark specialist started service |
| `PATCH` | `/appointments/:id/complete` | Vendor Staff | Mark service completed (triggers ledger payout) |
| `PATCH` | `/appointments/:id/cancel` | Customer / Vendor | Cancel appointment with reason |
| `PATCH` | `/appointments/:id/reschedule`| Customer / Vendor | Reschedule time slot |

---

### Cart & Orders (`/carts`, `/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/carts` | Customer | View active cart per vendor |
| `POST` | `/carts/items` | Customer | Add product to cart (quantity validation) |
| `PATCH` | `/carts/items/:id` | Customer | Update item quantity |
| `DELETE` | `/carts/items/:id` | Customer | Remove item from cart |
| `POST` | `/orders` | Customer | Checkout: convert cart to order (stock reserved) |
| `GET` | `/orders/my` | Customer | Customer order history |
| `GET` | `/orders/vendor` | Vendor Staff | Vendor incoming orders queue |
| `GET` | `/orders/:id` | Customer / Vendor | Detailed order status & line items |
| `PATCH` | `/orders/:id/accept` | Vendor Staff | Vendor accepts order for preparation |
| `PATCH` | `/orders/:id/dispatch`| Vendor Staff | Dispatch with delivery tracking code |
| `PATCH` | `/orders/:id/deliver` | Vendor Staff | Mark order delivered (triggers ledger settlement)|
| `PATCH` | `/orders/:id/cancel` | Customer / Vendor | Cancel order & release reserved stock |

---

### Payments & Webhooks (`/payments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/payments/initialize` | Customer | Initiate payment gateway session (JazzCash / Card)|
| `POST` | `/payments/webhooks/:gateway`| Public (Webhook) | Secure webhook receiver for payment verification|
| `GET` | `/payments/:id/status` | Customer / Vendor | Query verified transaction status |
| `POST` | `/payments/:id/refund` | Admin / Vendor | Request refund for cancelled appointment/order |

---

### Vendor Financials & Payouts (`/payouts`, `/ledger`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/ledger/summary` | Vendor Owner | Available, pending, and settled balance in PKR |
| `GET` | `/ledger/entries` | Vendor Owner | Itemized credit/debit transaction log |
| `GET` | `/payouts` | Vendor Owner | Payout history and bank withdrawal requests |
| `POST` | `/payouts/request` | Vendor Owner | Submit withdrawal request to bank account |
| `GET` | `/vendors/bank-accounts` | Vendor Owner | List linked bank accounts |
| `POST` | `/vendors/bank-accounts` | Vendor Owner | Add new IBAN / Pakistani bank account |

---

### Reviews & Ratings (`/reviews`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/reviews/vendor/:vendorId` | Public | List verified reviews for salon/spa |
| `GET` | `/reviews/service/:serviceId` | Public | List reviews for specific service |
| `POST` | `/reviews` | Customer | Post review after completed appointment/order |
| `POST` | `/reviews/:id/reply` | Vendor Staff | Vendor response to customer review |
| `POST` | `/reviews/:id/report` | Customer / Vendor | Report inappropriate review for moderation |

---

### Promotions & Coupons (`/promotions`, `/coupons`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/promotions/active` | Public | Active discounts and banner deals |
| `POST` | `/coupons/validate` | Customer | Verify coupon code before checkout |
| `POST` | `/promotions` | Vendor Owner | Create vendor discount campaign |
| `GET` | `/promotions` | Vendor Staff | Manage vendor promotions & coupon codes |

---

### Support & Disputes (`/support`, `/disputes`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/support/tickets` | Customer / Vendor | Open customer support ticket |
| `GET` | `/support/tickets` | Customer / Vendor | List user tickets with status |
| `POST` | `/support/tickets/:id/messages`| Customer / Vendor | Send message / reply in ticket |
| `POST` | `/disputes` | Customer | File formal dispute for booking or order |
| `GET` | `/disputes/:id` | Customer / Vendor | View dispute status and admin resolution |

---

### Admin Console Platform Control (`/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/metrics` | Admin | GMV, total bookings, active users, orders |
| `GET` | `/admin/vendors` | Admin | Vendor verification queue & status audit |
| `PATCH` | `/admin/vendors/:id/verify` | Admin | Approve or reject vendor CNIC/registration |
| `PATCH` | `/admin/vendors/:id/suspend`| Admin | Suspend or reactivate vendor account |
| `GET` | `/admin/payouts` | Admin | Pending vendor payout queue |
| `POST` | `/admin/payouts/:id/approve`| Admin | Approve bank payout transfer |
| `GET` | `/admin/commission-rules` | Admin | View platform commission rate hierarchy |
| `POST` | `/admin/commission-rules` | Admin | Set commission rules (Global, Category, Vendor) |
| `GET` | `/admin/audit-logs` | Admin | Search immutable system audit trail |

---

## 4. Frontend Integration Tips

1. **Pakistani Phone Formats**: Frontend input forms can accept `0300 1234567` or `+923001234567`. The backend automatically standardizes to `+923XXXXXXXXX`.
2. **Prices & Currency**: All monetary amounts are formatted as strings with two decimal places (e.g., `"1500.00"`). The platform currency is `PKR`.
3. **Urdu / RTL Rendering**:
   - Every category, brand, service, and vendor includes both English fields (`name`, `description`) and Urdu fields (`nameUrdu`, `descriptionUrdu`).
   - When the user selects Urdu in the frontend UI, send header `Accept-Language: ur` and prioritize `*Urdu` fields for display.
4. **Token Refresh Interceptor**: Set up an Axios/Fetch response interceptor on `401 Unauthorized` that triggers `POST /api/v1/auth/refresh` with the stored `refreshToken`, updates the stored tokens, and retries the original request.
