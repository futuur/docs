# Changelog

## 2026-09-08 — On-chain trading (coming soon)

Documented the coming-soon CLOB / on-chain builder flow. Production remains HMAC-only ledger settlement. No unpublished endpoints were added to API Reference.

### Added

- `guides/get-api-keys.mdx` — two credentials (HMAC pair vs owner EOA); Settings UI path (live) and wallet-signed `POST /v2.0/api-keys/derive/` (coming soon)
- `concepts/on-chain-trading.mdx` — CLOB matching, complementary both-buy, on-chain settlement
- `guides/on-chain-first-order.mdx` — enable trading → signing-context → `LimitOrderIntent` → create

### Changed — navigation

`docs.json` updates:

- **Get Started**: added `guides/get-api-keys` after Introduction
- **On-chain trading**: new Documentation group (`concepts/on-chain-trading`, `guides/on-chain-first-order`)
- **Guides**: added `guides/get-api-keys`

### Changed — cross-links

- `index.mdx`, `introduction.mdx`, `authentication.mdx`: keys guide + Coming soon on-chain notes
- `authentication.mdx`: case-sensitive HMAC sort warning
- `concepts/orders.mdx`, `concepts/currencies.mdx`, `guides/placing-a-bet.mdx`, `api-reference/orders/create.mdx`, `api-reference/me/safe.mdx`: Coming soon notes (no new live request fields)
- `AGENTS.md`: Coming soon convention and Web3 terminology
- `guides/mcp.mdx`: Settings path now **API keys**, with a link to the keys guide

## 2026-06-25 — Sync with live API schema

Refreshed `Futuur API Documentation (v2.0).json` from [https://api.futuur.com/docs/schema/](https://api.futuur.com/docs/schema/).

### Added — new endpoint pages

- `api-reference/events/get-tax.mdx` — `GET /events/{id}/get_tax/`. Returns play money and real money tax rates for an event. No authentication required.
- `api-reference/markets/order-book.mdx` — `GET /markets/{id}/book/`. Replaces the removed event-scoped order book endpoint. No authentication required.
- `api-reference/orders/batch-update.mdx` — `POST /orders/batch-update/`. Updates 1–20 open limit orders in one request, with optional `Idempotency-Key`.
- `api-reference/wagers/rebates.mdx` — `GET /wagers/rebates/`. Returns current rebated maker fees, with optional `date` and `event` filters.

### Removed — deprecated endpoint pages

- `api-reference/events/live-data.mdx` — `GET /events/{id}/live_data/` removed from the live API.
- `api-reference/events/order-book.mdx` — `GET /events/{id}/order_book/` replaced by `GET /markets/{id}/book/`.

### Changed — navigation

`docs.json` updates:

- **Events**: removed `live-data` and `order-book`; added `get-tax`.
- **Markets**: new group with `order-book`.
- **Orders**: added `batch-update` after `batch-create`.
- **Wagers**: added `rebates`.

### Changed — cross-links and guides

- `api-reference/events/retrieve.mdx`, `concepts/events-and-markets.mdx`, and `introduction.mdx`: removed `live_data` references; live events use `live=true` on list plus retrieve polling.
- `guides/placing-a-bet.mdx`, `guides/selling-a-position.mdx`, and `guides/reading-the-order-book.mdx`: order book examples now call `GET /markets/{id}/book/`.
- `concepts/orders.mdx`: documents batch update alongside batch create and cancel.

## 2026-06-02 — Sync with live API schema

Refreshed `Futuur API Documentation (v2.0).json` from [https://api.futuur.com/docs/schema/](https://api.futuur.com/docs/schema/). The compare script reported no endpoint, parameter, or tracked schema diffs against the previous baseline.

### Changed — wager schema alignment

- `api-reference/wagers/list.mdx` and `api-reference/wagers/retrieve.mdx`: response fields now match `WagerList` / `WagerDetail` (removed invented fields such as `avg_price`, `current_value`, `market_detail`, and `event_detail`).
- `api-reference/events/wagers.mdx`: sample and field reference aligned with `WagerList`; documents a non-paginated array response.
- `concepts/wagers.mdx`: added `cancelled` to the status table.

### Changed — guide fixes

- `guides/selling-a-position.mdx`: `position` values use `long` / `short`; order book array key is `bid`.
- `guides/placing-a-bet.mdx`: order book keys use `bid` / `ask` per `OrderBook` schema.

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
