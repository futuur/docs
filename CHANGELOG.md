# Changelog

## 2026-05-29 — Sync with live API schema

Refreshed `Futuur API Documentation (v2.0).json` from [https://api.futuur.com/docs/schema/](https://api.futuur.com/docs/schema/) and aligned Mintlify pages with the current v2.0 spec.

### Added — new endpoint pages

- `api-reference/events/live-data.mdx` — `GET /events/{id}/live_data/`. Returns up-to-date `EventDetail` for live markets. No authentication required.
- `api-reference/me/balances.mdx` — `GET /me/balances/`. Returns per-currency ledger balances with optional `?currency=` filter.

### Changed — navigation

`docs.json` now lists the new pages:

- **Events**: added `live-data` after `retrieve`.
- **Account**: added `balances` after `information`.

### Changed — event schema alignment

- `api-reference/events/list.mdx`: response now documents the `pagination` wrapper and `EventList` fields (`status`, `resolution_mode`, `bet_end_date`, `category` array, `markets`, volume fields).
- `api-reference/events/retrieve.mdx`: response updated to match `EventDetail` and `MarketList` shapes; links to the new live-data endpoint.
- `concepts/events-and-markets.mdx`: replaced `linked_prices` / `independent` correlation docs with `resolution_mode` (`exclusive` / `non_exclusive`); updated status enum and field names.

### Changed — account schema alignment

- `api-reference/me/information.mdx`: documents `wallet` (currency-keyed dict) and `email_confirmed` instead of flat `*_balance` fields and `is_email_confirmed`; links to the new balances endpoint.

### Changed — cross-links

- `introduction.mdx`: mentions live data and balances; adds a My balances card.
- `guides/mcp.mdx`: `get_user_profile` description links to the balances endpoint.

### Changed — pagination and ranking alignment

- `api-reference/orders/list.mdx`: response now uses the `pagination` object (`total`, `next`, `previous`, `page_size`, `offset`) plus `results`, matching `PaginatedLimitOrderList`.
- `api-reference/wagers/list.mdx`: same pagination shape, matching `PaginatedWagerListList`.
- `api-reference/me/ranking.mdx`: response updated to the `UserPrivateRanking` schema — a single `ranking` string field.

## 2026-05-13 — Sync with API v2.0 OpenAPI spec

Aligned the Mintlify documentation with `Futuur API Documentation (v2.0).json`.

### Added — new endpoint pages

- `api-reference/events/related-events.mdx` — `GET /events/{id}/related_events/`. Returns a list of events related to the source event by topic, category, and recent activity. No authentication required.
- `api-reference/me/safe.mdx` — `POST /me/safe/`. Registers a Safe smart account address for the authenticated user. Now documents the correct request body (`safe_address` + `chain_id`) and links back to the full `UserPrivate` response shape.
- `api-reference/orders/batch-create.mdx` — `POST /orders/batch/`. Submits 1–20 limit orders in a single request, supports the `Idempotency-Key` header, and documents the new per-item result envelope plus `cancelled_existing_order_ids`.
- `api-reference/orders/batch-cancel.mdx` — `POST /orders/batch-cancel/`. Cancels a list of orders by ID and returns per-item success/error results.
- `api-reference/orders/cancel-all.mdx` — `POST /orders/cancel-all/`. Cancels every active order on the account, optionally scoped by `event` or `market`, and returns `canceled_order_ids` and `processing_order_ids`.

### Changed — navigation

`docs.json` now lists the new pages under their respective groups:

- **Events**: added `related-events` after `price-history`.
- **Orders**: added `batch-create`, `batch-cancel`, and `cancel-all` alongside the existing list/create/cancel pages.
- **Account**: added `safe` after `ranking`.

### Changed — `position` enum normalized to `long` / `short`

The API now exposes the full enum names `long` and `short` (it previously used `l` / `s`). All affected pages were updated:

- `api-reference/orders/create.mdx`, `api-reference/orders/list.mdx`
- `api-reference/wagers/list.mdx`, `api-reference/wagers/retrieve.mdx`
- `api-reference/events/order-book.mdx`
- `concepts/orders.mdx`, `concepts/currencies.mdx`
- `guides/placing-a-bet.mdx`, `guides/selling-a-position.mdx`, `guides/reading-the-order-book.mdx`

Code examples, response samples, parameter tables, and prose now use the full `long` / `short` values.

### Changed — existing pages

- `api-reference/orders/create.mdx`: added the optional `Idempotency-Key` header section so repeat POSTs with the same body return the stored response instead of creating a duplicate order.
- `api-reference/events/actions.mdx`: added the `aggregate_by_orders` query parameter (default `true`).
- `api-reference/events/order-book.mdx`: response-shape correction — the top-level arrays are `bid` and `ask` (singular) per the OpenAPI spec, not `bids` / `asks`. Each level now also documents `total_fees` and `cumulative_fees`. The same fix was applied to `guides/reading-the-order-book.mdx`, including the example JSON, field reference, and Python snippets.
- `api-reference/events/retrieve.mdx`: the inline mention of related events now links to the dedicated `related-events` page.
- `api-reference/me/information.mdx`: replaced the inline Safe registration section (which previously documented an incorrect `{"address": ...}` body) with a link to the new `me/safe` page.
- `concepts/orders.mdx`: the intro paragraph now mentions the batch-create, batch-cancel, and cancel-all helpers.

### Not changed

- `authentication.mdx`, `rate-limits.mdx`, `concepts/events-and-markets.mdx`, `concepts/wagers.mdx`, `introduction.mdx`, and `index.mdx` did not contain stale enum values or references to the new endpoints and were left as-is.
