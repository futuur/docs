---
name: sync-futuur-api-docs
description: Aligns this Mintlify docs repo with the live Futuur Django API OpenAPI schema at api.futuur.com. Downloads the schema, diffs endpoints and fields against local MDX pages, adds missing API reference pages, and updates docs.json. Use when the user invokes this skill, after Django/API changes, or when asked to sync, align, or match docs with https://api.futuur.com/docs/.
---

# Sync Futuur API docs

Keep **Mintlify MDX** in this repo aligned with the **live Django API** spec. The API is the source of truth; this repo documents it.

| Source of truth | URL / file |
|-----------------|------------|
| Live OpenAPI (Django) | https://api.futuur.com/docs/schema/ |
| Interactive docs | https://api.futuur.com/docs/ |
| Local schema copy | `Futuur API Documentation (v2.0).json` |
| Mintlify pages | `api-reference/**/*.mdx`, `concepts/`, `guides/` |
| Navigation | `docs.json` |

## Workflow

Copy this checklist and track progress:

```
- [ ] 1. Fetch live schema
- [ ] 2. Diff live vs local JSON
- [ ] 3. Diff live vs Mintlify (pages + nav)
- [ ] 4. Report gaps to user (brief)
- [ ] 5. Apply fixes
- [ ] 6. Update CHANGELOG.md
- [ ] 7. Verify (compare script + mint broken-links if available)
```

### Step 1 — Fetch live schema

```bash
curl -sS "https://api.futuur.com/docs/schema/" -o "Futuur API Documentation (v2.0).json"
```

Use UTF-8 when reading the JSON in scripts.

### Step 2 — Diff schemas

Run the compare script (or equivalent):

```bash
python .cursor/skills/sync-futuur-api-docs/scripts/compare_openapi.py
```

Report:

- Endpoints in **live only** (need new MDX + `docs.json` entry)
- Endpoints **removed** from live (deprecate or remove pages)
- **Parameter** diffs on shared endpoints
- **Schema** adds/removes/renames (`EventDetail`, `UserPrivate`, paginated wrappers, etc.)

### Step 3 — Diff Mintlify coverage

1. List every `paths` operation in the live schema (`GET`, `POST`, `PATCH`, …).
2. Map each to an MDX page using [reference.md](reference.md).
3. Confirm every mapped page is listed under **API Reference** in `docs.json`.
4. Spot-check **concepts** and **guides** for stale field names (see reference).

### Step 4 — Report

Give a short alignment summary:

- ✅ Aligned
- ❌ Missing pages / nav entries
- ⚠️ Stale fields (wrong names, old pagination shape, wrong auth)

Do not commit unless the user asks.

### Step 5 — Apply fixes

**New endpoint**

1. Add `api-reference/<group>/<slug>.mdx` following existing pages (frontmatter, Endpoint, Authentication, Parameters, Response, Example).
2. Add the page path to `docs.json` in the correct group.
3. Cross-link from related pages (`introduction.mdx`, concepts, guides) when relevant.

**Updated endpoint**

- Match **HTTP method** and path exactly (e.g. cancel order is `PATCH /orders/{id}/cancel/`).
- Match **query/body** params to OpenAPI.
- Match **response** shape to `$ref` schemas — do not invent fields.

**Pagination** — list endpoints use this envelope (not top-level `count` / `next` / `previous`):

```json
{
  "pagination": { "total", "next", "previous", "page_size", "offset" },
  "results": []
}
```

Applies to: `GET /events/`, `GET /orders/`, `GET /wagers/`.

**Events** — prefer live schema names:

- `status`: `open` | `stopped` | `resolved` | `cancelled` | `paused` | `reversed`
- `resolution_mode`: `exclusive` | `non_exclusive` (not `markets_correlation` / linked vs independent)
- Dates: `bet_end_date`, `resolve_date` (not `closes_at` / `created_at` on event objects)
- `category` is an **array** of objects, not a single integer

**Account** — `UserPrivate` uses `wallet` (dict) and `email_confirmed`; balances also on `GET /me/balances/`. Ranking is `{ "ranking": "..." }` only.

**Auth** — copy `security` from OpenAPI per endpoint. These are **public** (no HMAC): `price_history`, `related_events`, `live_data`.

**MDX style** — follow `AGENTS.md`: second person, sentence-case headings, `<ParamField>` / `<ResponseField>`.

### Step 6 — CHANGELOG

Add a dated section at the top of `CHANGELOG.md` (new pages, nav, schema fixes). Mirror the 2026-05-29 entry style.

### Step 7 — Verify

```bash
python .cursor/skills/sync-futuur-api-docs/scripts/compare_openapi.py
mint broken-links
```

Fix any real mismatches the script reports; ignore Mintlify false positives on internal `/api-reference/...` links if the dev server is not running.

## When the user says “I changed the API”

Ask which area changed if unclear (events, orders, wagers, account). Then run the full workflow focused on that tag/path prefix.

## Additional resources

- Endpoint → MDX map and stale-field checklist: [reference.md](reference.md)
