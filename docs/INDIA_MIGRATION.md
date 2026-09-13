# India frontend market migration

The existing routes, design system, workspace separation and service injection architecture are preserved. This migration updates the implemented shell, vendor dashboard and onboarding flow. Other route families currently render the existing module availability state; no banking, payment, invoice, CMS, map or admin dashboard screens were invented during localization.

## Configuration and UX

- `src/platform/market.ts`: India / IN / IND, +91, INR / ₹, en-IN, Asia/Kolkata; English and Hindi language metadata with LTR direction. Future language codes are registered separately and are not exposed in the selector. Payment labels include UPI, cards, net banking, wallet and COD; capability availability must come from the backend. Bank and business identity input contracts support account confirmation, IFSC, branch, optional UPI, PAN and GSTIN.
- `src/platform/india-locations.ts`: 28 states, 8 union territories and a diverse national demo city catalogue. These are application subdivision keys, not backend location IDs. City input is unrestricted by the demo catalogue.
- `src/platform/format.ts`: Indian digit grouping, integer minor-unit formatting without losing fractional amounts, and timezone-aware date/time display. Formatting is not foreign-exchange conversion.
- Onboarding retains its four steps, adding reusable Indian address and mobile components, optional legal name/PAN/GSTIN, and Indian business registration types. GST registration is not universally required. PIN codes have six digits; mobile inputs accept national or +91 formatted numbers. Final eligibility and identity validation remain backend responsibilities.
- Demo business, branches, customers, staff, appointments, product order amounts and payouts now use Indian sample data. Demo draft storage uses a separate market-specific cookie so old sample drafts cannot populate the new form. No production records are migrated.
- Language choice is persisted in a cookie, read on the server for hydration consistency, and forwarded as Accept-Language. Hindi navigation, greeting and business name input use LTR. Existing English fallback content remains; this is not a claim that the entire application has a professionally reviewed Hindi translation.

## Files changed for this migration

New: `src/platform/market.ts`, `src/platform/india-locations.ts`, `src/platform/server-locale.ts`, `src/components/portal/market-fields.tsx`, `tests/market.spec.ts`, `scripts/audit-market.mjs`, this report.

Updated:

- `src/platform/domain.ts`, `entities.ts`, `format.ts`, `response-schemas.ts`, `demo-adapter.ts`, `server-session.ts`, `services.ts`, `api-server.ts`
- `src/platform/api/contracts.ts`, `backend.ts`, `client.ts`, `endpoint-client.ts`
- `src/components/portal/providers.tsx`, `shell.tsx`, `revenue-chart.tsx`, `login-form.tsx`
- `src/features/dashboard/dashboard.tsx`, `widgets.tsx`, `src/features/onboarding/onboarding.tsx`
- `src/app/layout.tsx`, `src/app/vendor/layout.tsx`, `src/app/admin/layout.tsx`, `src/app/api/portal/application/route.ts`, `src/app/api/portal/dashboard/route.ts`
- `tests/portal.spec.ts`, `tests/security.spec.ts`, `README.md`, `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`

Two pre-existing API TypeScript issues were repaired (refresh-lock promise typing and endpoint-registry assertion). The existing login form and security fixture were aligned with the already-changed identifier/auth-me response contract. Authentication architecture was not replaced.

## Backend-dependent work

The supplied `docs/api/vellure_api_reference.md` is an unchanged historical backend contract. Its market assumptions are not suitable for India deployment. Backend owners must confirm INR monetary responses and ledger currencies, +91 phone normalization, Hindi translations, Indian location IDs/PIN validation, business verification rules, bank account/IFSC verification, payment method capabilities and applicable tax breakdowns. Never reinterpret historical balances as INR. The amount adapter now requires an explicit currency and rejects unsupported currencies; dashboard response schemas enforce INR.

The onboarding UI model uses `secondaryName`, Indian address fields and optional business identity fields. The existing proposed `/vendor/application` integration must map these to an agreed backend contract; do not place Hindi into legacy language-specific wire fields. Live integration and production record migration remain separate backend work. Current demo mode uses only its isolated adapter.

Bank account submission must match confirmed account numbers on the client and independently validate/verify on the backend. Mask account numbers on display. Payment availability, GST applicability, CGST/SGST/IGST amounts, invoice labels and commission priority must come from returned backend configuration/snapshots, not frontend calculations. No provider was hard-coded and no tax or payout calculations were introduced.

## Intentional retained references

- The historical API reference retains its original country, currency, language, bank and payment examples as evidence of the backend contract; it is not rendered or imported as UI content.
- `VendorBankAccount.ibanMasked` is retained as a legacy wire field, alongside optional Indian bank display fields. No existing backend property was silently renamed.
- `postalCode` and HTML `postal-code` autocomplete remain generic API/accessibility identifiers; visible labels say PIN Code.
- `PK` in the data model means primary key. Generic RTL CSS and the language direction union remain for possible future RTL languages; Hindi never activates them.

## Verification

Run `node scripts/audit-market.mjs`, `npm run lint`, `npm run typecheck`, `npm run build`, then `npm run test:e2e` with the demo app on port 3001. Tests cover currency grouping/minor units, timezone day rollover, mobile validation, subdivisions, Hindi LTR and persistence, onboarding PIN/address fields, filtering, export, route families and server authorization. Screenshots are saved in `test-results/` for desktop, Hindi mobile and onboarding review inspection.
