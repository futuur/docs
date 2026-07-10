---
name: sync-futuur-api-docs
description: Aligns this Mintlify docs repo with the live Futuur Django API OpenAPI schema. Downloads the schema, diffs endpoints and fields against local MDX pages, adds missing API reference pages, and updates docs.json. Use when the user invokes this skill, after Django/API changes, or when asked to sync, align, or match docs with the Futuur API. Supports an optional environment argument (production, local).
metadata:
  default-environment: production
---

# Sync Futuur API docs

Keep **Mintlify MDX** in this repo aligned with the **live Django API** spec. The API is the source of truth; this repo documents it.

## Environment argument

When invoked as `/sync-futuur-api-docs <environment>`, read `<environment>` from the user's message (text after the skill name). If omitted, use **`production`**.

| Environment | Base URL | Schema URL | Interactive docs |
|-------------|----------|------------|------------------|
| `production` (default) | `https://api.futuur.com` | `https://api.futuur.com/docs/schema/` | `https://api.futuur.com/docs/` |
| `staging` (default) | `https://api-staging.futuur.com` | `https://api-staging.futuur.com/docs/schema/` | `https://api-staging.futuur.com/docs/` |
| `local` | `http://127.0.0.1:8000` | `http://127.0.0.1:8000/docs/schema/` | `http://127.0.0.1:8000/docs/` |

Use the selected environment for **all** fetch, diff, and verify steps in this workflow. Pass `--env <environment>` to the compare script.

To add another environment (e.g. staging), extend `ENVIRONMENTS` in [scripts/compare_openapi.py](scripts/compare_openapi.py) and update this table.

**Examples**

- `/sync-futuur-api-docs` → production
- `/sync-futuur-api-docs production` → production
- `/sync-futuur-api-docs local` → local Django dev server

| Source of truth | URL / file |
|-----------------|------------|
| Live OpenAPI (Django) | `<schema URL for selected environment>` |
| Interactive docs | `<docs URL for selected environment>` |
| Local schema copy | `Futuur API Documentation (v2.0).json` |
| Mintlify pages | `api-reference/**/*.mdx`, `concepts/`, `guides/` |
| Navigation | `docs.json` |

## Workflow

Copy this checklist and track progress:

```
- [ ] 0. Resolve environment from invocation (default: production)
- [ ] 1. Fetch live schema
- [ ] 2. Diff live vs local JSON
- [ ] 3. Diff live vs Mintlify (pages + nav)
- [ ] 4. Report gaps to user (brief)
- [ ] 5. Apply fixes
- [ ] 6. Update CHANGELOG.md
- [ ] 7. Verify (compare script + mint broken-links if available)
```

### Step 0 — Resolve environment

Parse the environment from the slash invocation or user message. Default to `production` when not specified.

### Step 1 — Fetch live schema

Replace `<SCHEMA_URL>` with the schema URL for the selected environment (see table above).

```bash
curl -sS "<SCHEMA_URL>" -o "Futuur API Documentation (v2.0).json"
```

Use UTF-8 when reading the JSON in scripts.

### Step 2 — Diff schemas

Run the compare script with the same environment:

```bash
python .cursor/skills/sync-futuur-api-docs/scripts/compare_openapi.py --env <environment>
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

Give a short alignment summary (include the environment used):

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

**Auth** — copy `security` from OpenAPI per endpoint. These are **public** (no HMAC): `price_history`, `related_events`, `get_tax`, `markets/{id}/book`.

**MDX style** — follow `AGENTS.md`: second person, sentence-case headings, `<ParamField>` / `<ResponseField>`.

### Step 6 — CHANGELOG

Add a dated section at the top of `CHANGELOG.md` (new pages, nav, schema fixes). Mirror the 2026-05-29 entry style. Note the environment if not production.

### Step 7 — Verify

```bash
python .cursor/skills/sync-futuur-api-docs/scripts/compare_openapi.py --env <environment>
mint broken-links
```

Fix any real mismatches the script reports; ignore Mintlify false positives on internal `/api-reference/...` links if the dev server is not running.

## When the user says “I changed the API”

Ask which area changed if unclear (events, orders, wagers, account). If they are testing locally, suggest `/sync-futuur-api-docs local`. Then run the full workflow focused on that tag/path prefix.

## Additional resources

- Endpoint → MDX map and stale-field checklist: [reference.md](reference.md)
- Environment URLs and `--env` flag: [scripts/compare_openapi.py](scripts/compare_openapi.py)
