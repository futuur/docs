# Websocket (Pusher) Changelog

This changelog tracks changes to the realtime (Pusher) **contract**: channel  
names, event names, and payload shapes. If you consume our realtime feed, read  
the **Action required** items below and update your integration.

Terminology: **event** = a `Question`, **market** = an `Outcome`.

## Unreleased

### Market-maker / quoting support

#### Breaking: `order-book-update` is now top-of-book per market (action required)

The legacy refetch ping (`{ endpoint, question, currency }`) is **removed**.
`order-book-update` on `event-{event_id}` now carries absolute **top-N** bid/ask
levels for the affected market (one message per market). The separate
`order-book-delta` event name was dropped — use `order-book-update` only.

```diff
  channel.bind("order-book-update", function (data) {
-   // data = { endpoint: "book", question: <id>, currency: "USDC" }
-   refetchOrderBook(data.question, data.currency);
+   // data = { market_id, event_id, currency, currency_mode, top_n, ask[], bid[], timestamp }
+   applyTopOfBook(data.market_id, data.bid, data.ask);
  });
- channel.bind("order-book-delta", ...); // removed
```

Example payload:

```json
{
  "market_id": 1,
  "event_id": 1234,
  "currency": "USDC",
  "currency_mode": "real_money",
  "top_n": 5,
  "ask": [{"price": 0.55, "total_shares": 10, "total_amount": 5.5}],
  "bid": [{"price": 0.52, "total_shares": 8, "total_amount": 4.16}],
  "timestamp": "..."
}
```

Full-book snapshots remain disabled (Pusher size limits). For depth beyond
top-N, call the REST order-book API.

#### Additive (no action required unless you want them)

1. **`best-prices-change` also on `event-{event_id}`** — same payload as the
   global `event` channel (BBO = best bid / best ask).
2. **`market-status-change`** on `event` and `event-{event_id}` — tradability
   flips (`status`, bet window, market `disabled`).
3. **`order-update` create / open acks** — `pending` / `open` on create and
   PROCESSING → OPEN, in addition to fill / cancel / expire.
4. **`position-update`** on `private-user-{id}` — inventory when wager shares
   change.

### Migration checklist

- [ ] Update `order-book-update` handlers to the top-of-book payload (drop ping
  refetch-only flow, or keep REST only when you need full depth).
- [ ] Remove any `order-book-delta` bindings.
- [ ] (Optional) Subscribe to `best-prices-change` on `event-{eventId}`.
- [ ] (Optional) Bind `market-status-change` to gate quoting.
- [ ] (Optional) Handle `order-update` with `status: pending|open` as create acks.
- [ ] (Optional) Bind `position-update` for inventory sync.



### Reference: channel/event map after this change


| Channel                  | Events                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `event`                  | `best-prices-change`, `price-change`, `new-market`, `live-data-update`, `market-status-change`, `market-comment` |
| `event-{event_id}`       | `order-book-update` (top-N per market), `best-prices-change`, `market-status-change`                             |
| `private-user-{user_id}` | `balance-changed`, `deposit-success`, `order-update`, `position-update`                                          |
| `test-channel`           | `test-event`                                                                                                      |


## Previous: event-centric rename

Realtime messaging was reorganized around **events** (a question) instead of
**markets** (an outcome). The public channel was renamed and the order-book
channel is now per-event. **Private user channels are unchanged.**

### Breaking changes (action required)



#### 1. Public channel renamed: `market` → `event`

All public broadcasts now publish to the `event` channel instead of `market`.
The event names are unchanged: `best-prices-change`, `price-change`,
`new-market`, `live-data-update`, `market-comment`. Their payloads are unchanged.

```diff
- var channel = pusher.subscribe("market");
+ var channel = pusher.subscribe("event");
```



#### 2. Order-book channel is now per-event: `order-book-{question_id}-{currency_mode}` → `event-{event_id}`

The `order-book-update` event now publishes to a per-event channel keyed by the
event (question) id. Subscribe once per event.

```diff
- // one channel per (question, currency mode)
- pusher.subscribe("order-book-" + questionId + "-" + currencyMode);
+ // one channel per event
+ pusher.subscribe("event-" + eventId);
```

See **Unreleased** above for the current `order-book-update` payload (top-N
per market). The old ping and full-depth streams are gone.

### Removed (action required)



#### Full-depth order-book streaming / refetch ping

- Per-side depth deltas on the old `market` channel — removed.
- `order-book-snapshot` (full-book payload) — **not** emitted (size limits).
- Refetch-only ping `{ endpoint, question, currency }` — **removed**; replaced
  by top-N `order-book-update` (see Unreleased).

### Unchanged (no action needed)

- Private channel `private-user-{user_id}` base events (`balance-changed`,
  `deposit-success`) — unchanged; see Unreleased for additive order/position
  updates.
- Authorization endpoints `POST /pusher/user-auth/` and `POST /pusher/auth/` are
  unchanged.
- The `test-channel` / `test-event` pair (connectivity testing) is unchanged.
