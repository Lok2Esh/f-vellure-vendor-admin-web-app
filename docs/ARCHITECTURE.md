# Vellure portal architecture

## Delivery boundary

This delivery implements the foundation, Vendor Dashboard and initial Vendor Onboarding application, in the order requested. All requested vendor/admin route families are registered. Later routes intentionally render an explicit module-availability state; they do not claim to perform bookings, payments, refunds, moderation or stock adjustments. The admin shell is separate; the admin dashboard itself is a later phase.

The previous wedding marketplace prototype, client-writable authentication cookies, login failure bypass and local-storage business database are retired. No existing marketplace database was migrated or modified.

## SOLID boundaries

- **Single responsibility:** domain contracts describe data; route handlers authorize/validate; adapters transport requests; feature components coordinate queries; widgets render individual dashboard sections; shared primitives implement HTML/accessibility/styling.
- **Open/closed:** new providers implement existing narrow interfaces. New modules are added to the route registry and their own feature folder.
- **Liskov substitution:** mock and live paths expose the same `VendorService` return contracts and error behavior; mocks are explicitly selected, never used after live failures.
- **Interface segregation:** availability, inventory, appointments, payments, messaging, storage, geocoding, search, analytics and monitoring expose independent contracts, not a universal CRUD client.
- **Dependency inversion:** features use `useVendorService`, which resolves a `VendorService` interface. `VendorServiceProvider` is the composition root and supports injection in tests. Feature views compose reusable UI components rather than raw HTML. Semantic HTML and accessibility behavior live in `components/portal`.

## Code map

| Location                                | Responsibility                                                 |
| --------------------------------------- | -------------------------------------------------------------- |
| `src/platform/domain.ts`, `entities.ts` | Shared DTOs, money, enums, permissions and schemas             |
| `src/platform/services.ts`              | Narrow backend/provider contracts and same-origin HTTP adapter |
| `src/platform/demo-adapter.ts`          | Isolated, deterministic sample dashboard                       |
| `src/platform/server-session.ts`        | Server session verification and workspace boundary             |
| `src/platform/api-server.ts`            | Server authorization, origin checks and upstream transport     |
| `src/platform/routes.ts`                | Navigation, granular access requirements and phase registry    |
| `src/components/portal`                 | Tokens, primitives, shell, table, chart, dialog, providers     |
| `src/features/dashboard`                | Dashboard query orchestration and independent widgets          |
| `src/features/onboarding`               | Schema-driven wizard, draft and submission                     |
| `src/app/api`                           | Backend-for-frontend endpoints; no marketplace business engine |

## Runtime and authentication

Observed adjacent backend contracts (read-only inspection): `src/api/users/users.router.ts` provides `/users/login` and `/users/me` in an API response envelope; `src/middleware/rbac.ts` enforces role labels; `/vendors/profile` uses the previous wedding vendor model. The portal's `/auth/session` effective-permission contract and beauty/wellness application/dashboard DTOs are proposed integration contracts and are not available in that backend yet. Do not enable live mode until a backend adapter/contract update supplies them. No neighboring backend files were changed.

`VELLURE_DEMO_MODE=true` is an explicit local preview. It supplies sample sessions to either workspace and must only be used with sample data. It is disabled when omitted. `.env.local` enables it for this working copy; `.env.example` documents it. Demo onboarding is stored in a bounded HttpOnly browser cookie for 24 hours; this is an isolated preview adapter, not production storage.

For live use, set `VELLURE_DEMO_MODE=false` and `VELLURE_API_URL` to the existing Vellure API. Align the login/session DTO and endpoint paths with that API before launch. An upstream error never activates demo mode. Login forwards credentials to the backend and stores the returned opaque token in a Secure (production), HttpOnly, SameSite cookie. No token is returned to client JavaScript. Password hashing, MFA, session rotation/revocation and distributed authentication rate limits belong to the identity module. Logout clears the portal cookie; backend session revocation still needs the backend logout contract.

The Next.js 16 proxy performs only optimistic cookie-presence redirects. Dynamic server layouts verify the token with `/auth/session`; the backend returns workspace and effective permissions. Mutation handlers recheck authorization independently, validate schemas and reject cross-origin writes. The upstream must enforce tenant ownership and permissions on every request. Frontend permission gates are only a UX aid. Never accept vendor IDs or role cookies as proof of authorization. API handlers never expose upstream error payloads containing private data.

| Portal endpoint                | Backend contract                            | Access                                    |
| ------------------------------ | ------------------------------------------- | ----------------------------------------- |
| `POST /api/auth/login`         | `POST /auth/login` → `{token, workspace}`   | Public, same origin; backend rate limited |
| Session verification           | `GET /auth/session` → validated Session DTO | Bearer token, no cache                    |
| `GET /api/portal/dashboard`    | `GET /vendor/dashboard?period&branchId`     | `dashboard.view`, tenant-scoped           |
| `GET /api/portal/application`  | `GET /vendor/application`                   | `vendor.view`                             |
| `POST /api/portal/application` | `POST /vendor/application` `{data, submit}` | `vendor.edit`, schema + origin checks     |

Use backend response projection to hide finance widgets and customer information from roles without those permissions. Mask email, phone, address and identity details by default. Vendor customer access requires a business interaction, not simply possession of a customer ID. Configure a trusted proxy/origin allowlist for production deployments; never trust arbitrary forwarded headers.

## Backend ownership: modular monolith

Keep the existing backend as the source of truth. Suggested module boundaries: Identity (authentication, users, RBAC); Partners (vendors, branches, staff, verification); Catalog (categories, brands, services, products, media); Scheduling (availability, appointments); Commerce (cart, orders, inventory); Pricing (promotions, coupons, commission); Money (payments, refunds, ledger, payouts); Engagement (reviews, notifications, support, disputes); Discovery (search, location); Publishing (CMS); Insights (analytics); Governance (audit).

Internal module APIs and a transactional outbox are sufficient initially. Notifications, payment webhooks and search indexing consume idempotent outbox events. Do not create microservices solely to mirror these modules.

### Transactional invariants

- Availability intersects service eligibility, branch service membership/opening hours, staff qualification and staff schedules/breaks/time off. Revalidate and reserve atomically when booking; a displayed slot is not a reservation. Use unique/exclusion constraints to prevent overlapping active staff bookings.
- Appointment/order state transitions belong to backend state machines. Require expected version and idempotency key; append status history and audit in the same transaction. Cancellation/refund policy and authorization are backend decisions.
- Inventory writes are commands producing an immutable inventory transaction. Lock branch/variant inventory, validate available stock, append transaction, update projection atomically. Transfer uses linked opposite transactions. Reserved and physical stock are distinct.
- Ledger entries are append-only, integer paisa, balanced per journal. Refunds and corrections use reversal journals. Never derive balances from frontend sales totals. Payouts reserve available ledger funds atomically; reconciliation is append-only.
- Commission priority: item-specific PRODUCT or SERVICE → VENDOR → CATEGORY → GLOBAL. Scope hierarchy wins before rule priority. Within a scope, greatest explicit priority wins; reject overlapping active rules with equal priority. Freeze rule ID/version, basis, rate, fixed fee, rounding policy and computed amount at settlement. Future rule edits cannot change a historical snapshot. Backend owns rounding and calculation.
- Sensitive moderation and vendor status changes require reason, expected version, status history and immutable audit event. Vendors can reply/report reviews; never edit or delete customer reviews.
- Promotions validate dates, caps, eligibility and usage atomically. Unique coupon redemption/idempotency keys prevent duplicate use.

## Localization and UX

Default locale is English/India. Domain content supports English and Hindi. The shell supports Hindi navigation and keeps LTR layout; direction metadata and logical CSS properties support future RTL languages. Dates format in `Asia/Kolkata`; backend timestamps are UTC ISO 8601. Money uses integer paisa and `Intl.NumberFormat` for INR. The complete English/Hindi translation catalogue, native-language review remain follow-up work; Hindi navigation does not mean every string is translated.

The dashboard uses query caching keyed by tenant, branch and period; shared loading/error/empty states; a sortable, searchable, paginated table with column visibility and CSV export; accessible native dialogs with Escape/focus behavior; detail drawers; status badges; toast feedback; responsive navigation and an accessible chart data table. Saved views, bulk selection, broad list filters and server-side pagination will be added with the full module lists, rather than pretending the six-row dashboard preview needs backend list operations.

## Security and operational launch gates

Before live launch: agree backend DTOs and error envelopes; validate dashboard responses at the boundary; integrate backend logout, MFA and rate limiting; use a shared rate limiter at API gateway/backend; enforce request size limits; configure HTTPS and trusted origins; add deployment CSP with nonces; connect structured logs/error monitoring; confirm tenant/RBAC integration tests against the real backend; conduct accessibility and Hindi review; resolve dependency audit findings.

Uploads must use short-lived presigned URLs, MIME/magic-byte validation, size limits, quarantine/virus scanning, private object ACLs and authorized download URLs. Document upload is intentionally not faked in onboarding. No real identity or bank document should enter demo cookies. App deep links must be allowlisted. React escaping is retained; no raw customer HTML is rendered.

## Next delivery phases

1. Connect real identity and vendor application contracts; secure verification and bank onboarding.
2. Branches → staff → services: typed services, detail/form workflows, branch map selection and eligible-staff relationships.
3. Appointments, professional calendar and atomic availability.
4. Product variants, inventory transaction commands and orders.
5. Ledger-backed vendor finance, promotions, reviews and analytics comparisons.
6. Admin dashboard, vendor approval and moderation queues.
7. Admin bookings/orders/customers with privacy projection.
8. Commission rules/snapshots, refunds, payouts and reconciliation.
9. Localized CMS, notifications, support/disputes, analytics and immutable audit browsing.

For every module: define DTO/schema/service/state rules, then shared components, list, detail, create/edit, loading/error/empty states, permission gates and responsive verification.
