# Vellure Vendor Portal & Administration Console

Next.js 16.3, React 19 and TypeScript. Beauty/wellness workspace for India, with INR formatting and an English/Hindi LTR foundation.

## Run locally

Run `npm ci`, copy `.env.example` to `.env.local`, then `npm run dev`.

Open http://localhost:3001/vendor/dashboard. Onboarding is at `/vendor/onboarding`; the independent admin shell is at `/admin/dashboard`.

`VELLURE_DEMO_MODE=true` explicitly enables isolated sample sessions/data. This working copy has demo mode enabled. Never enter real identity or bank data in demo mode. A sample application draft/submission persists in a temporary HttpOnly cookie for 24 hours. There is no fallback from failed live authentication to demo access.

## Implemented in this first delivery

- Independent server-protected workspace layouts and permission-aware navigation.
- Central design tokens and reusable semantic UI primitives; features compose components rather than raw elements.
- SOLID domain/service/provider boundaries, injectable vendor service, typed DTOs and runtime response validation.
- Vendor Dashboard: branch/time-period filters, separated revenue chart, operational widgets, appointment search/sort/filter/pagination/columns/CSV and detail drawer.
- Vendor Onboarding: four steps, client/server schemas, editable drafts, review and submission state.
- Query caching, loading/error/empty states, dialogs, toast messages, responsive layout, Hindi navigation and LTR language switching.
- All requested route families registered; later modules show explicit availability states.
- Entity/relationship/index/constraint specification and platform-provider interfaces.

The full calendar, catalog, orders, inventory commands, finance, admin workflows and CMS are subsequent phases. This is not a completed nine-phase marketplace or a production backend.

## Live backend integration

Disable demo mode and configure `VELLURE_API_URL`. Align the contracts in `src/platform/services.ts` and `src/platform/server-session.ts` with the backend. The adjacent `vellure-backend` currently exposes `/users/login`, `/users/me` and wedding-oriented `/vendors/profile` endpoints, with role-only authorization. The new portal requires effective granular permissions plus beauty/wellness dashboard/application DTOs. Those differences are deliberately not bridged by granting permissions in the browser.

See [Architecture](docs/ARCHITECTURE.md) for endpoint contracts, SOLID boundaries, security requirements and phase plan. See [Data model](docs/DATA_MODEL.md) for relationships, indexes, immutable histories, inventory invariants and ledger/commission rules.

## Verify

```sh
npm run lint
npm run typecheck
npm run build
# Keep the demo development server running on 3001; tests use installed Chrome.
npm run test:e2e
npm audit
```

Browser tests cover dashboard interaction, responsive Hindi LTR, onboarding persistence, route coverage and validation. Security tests start an isolated production server on port 3101 and an identity fixture on 3102, with demo disabled, to verify session/workspace/RBAC enforcement. A production build is required before running those tests. Screenshots are saved under `test-results/`.

Full Hindi translation, real backend integration, secure document uploads, backend session revocation/MFA/rate limits and deployment hardening remain launch requirements. Financial balances always come from the backend ledger; the frontend does not implement settlement logic.
