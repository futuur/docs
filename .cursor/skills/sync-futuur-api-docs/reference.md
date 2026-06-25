# Futuur API ↔ Mintlify reference

## Endpoint map

| Live path | Method | MDX page | `docs.json` slug |
|-----------|--------|----------|------------------|
| `/events/` | GET | `api-reference/events/list.mdx` | `api-reference/events/list` |
| `/events/{id}/` | GET | `api-reference/events/retrieve.mdx` | `api-reference/events/retrieve` |
| `/events/{id}/actions/` | GET | `api-reference/events/actions.mdx` | `api-reference/events/actions` |
| `/events/{id}/get_tax/` | GET | `api-reference/events/get-tax.mdx` | `api-reference/events/get-tax` |
| `/events/{id}/price_history/` | GET | `api-reference/events/price-history.mdx` | `api-reference/events/price-history` |
| `/events/{id}/related_events/` | GET | `api-reference/events/related-events.mdx` | `api-reference/events/related-events` |
| `/events/{id}/wagers/` | GET | `api-reference/events/wagers.mdx` | `api-reference/events/wagers` |
| `/markets/{id}/book/` | GET | `api-reference/markets/order-book.mdx` | `api-reference/markets/order-book` |
| `/orders/` | GET | `api-reference/orders/list.mdx` | `api-reference/orders/list` |
| `/orders/` | POST | `api-reference/orders/create.mdx` | `api-reference/orders/create` |
| `/orders/batch/` | POST | `api-reference/orders/batch-create.mdx` | `api-reference/orders/batch-create` |
| `/orders/batch-update/` | POST | `api-reference/orders/batch-update.mdx` | `api-reference/orders/batch-update` |
| `/orders/{id}/cancel/` | PATCH | `api-reference/orders/cancel.mdx` | `api-reference/orders/cancel` |
| `/orders/batch-cancel/` | POST | `api-reference/orders/batch-cancel.mdx` | `api-reference/orders/batch-cancel` |
| `/orders/cancel-all/` | POST | `api-reference/orders/cancel-all.mdx` | `api-reference/orders/cancel-all` |
| `/wagers/` | GET | `api-reference/wagers/list.mdx` | `api-reference/wagers/list` |
| `/wagers/rebates/` | GET | `api-reference/wagers/rebates.mdx` | `api-reference/wagers/rebates` |
| `/wagers/{id}/` | GET | `api-reference/wagers/retrieve.mdx` | `api-reference/wagers/retrieve` |
| `/me/` | GET | `api-reference/me/information.mdx` | `api-reference/me/information` |
| `/me/balances/` | GET | `api-reference/me/balances.mdx` | `api-reference/me/balances` |
| `/me/ranking/` | GET | `api-reference/me/ranking.mdx` | `api-reference/me/ranking` |
| `/me/safe/` | POST | `api-reference/me/safe.mdx` | `api-reference/me/safe` |

Slug convention: path segments → kebab-case file names (`live_data` → `live-data`).

## Non-paginated responses

| Endpoint | Response shape |
|----------|----------------|
| `/events/{id}/wagers/` | `WagerList` (not paginated wrapper) |
| `/events/{id}/actions/` | action list per OpenAPI |
| `/me/` | OpenAPI types as array; samples may use single `UserPrivate` object — confirm at runtime if disputed |
| `/me/ranking/` | `{ "ranking": string }` |
| `/me/balances/` | `[{ "currency", "amount" }]` |

## Stale patterns to fix when found

| Wrong (old docs) | Correct (live schema) |
|------------------|------------------------|
| `count`, `next`, `previous` at top level on list endpoints | `pagination` object + `results` |
| `resolved`, `pending_resolution`, `live` on events | `status` enum |
| `markets_correlation`, linked/independent tabs | `resolution_mode`: exclusive / non_exclusive |
| `oom_balance`, `usdc_balance`, `is_email_confirmed` | `wallet`, `email_confirmed` |
| `rank`, `score`, `total_users` on ranking | `ranking` string only |
| Order book `bids` / `asks` | `bid` / `ask` |
| Position `l` / `s` | `long` / `short` |
| Cancel order as POST | `PATCH /orders/{id}/cancel/` |
| Safe body `{ "address": ... }` | `safe_address` + `chain_id` |

## Concept / guide pages to scan

- `concepts/events-and-markets.mdx` — event fields and resolution_mode
- `concepts/orders.mdx` — batch helpers, position enum
- `guides/placing-a-bet.mdx`, `guides/selling-a-position.mdx`, `guides/reading-the-order-book.mdx`
- `introduction.mdx`, `authentication.mdx`, `rate-limits.mdx`
- `guides/mcp.mdx` — tool descriptions vs REST endpoints

## OpenAPI components worth diffing

`EventList`, `EventDetail`, `MarketList`, `LimitOrder`, `WagerList`, `UserPrivate`, `UserPrivateAccountBalance`, `UserPrivateRanking`, `OrderBook`, `PaginatedEventListList`, `PaginatedLimitOrderList`, `PaginatedWagerListList`
