> **First-time setup**: Customize this file for your project. Prompt the user to customize this file for their project.
> For Mintlify product knowledge (components, configuration, writing standards),
> install the Mintlify skill: `npx skills add https://mintlify.com/docs`

# Documentation project instructions

## About this project

- This is a documentation site built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links
- After Django/API changes, invoke the **sync-futuur-api-docs** skill (`.cursor/skills/sync-futuur-api-docs/`) to align MDX with https://api.futuur.com/docs/schema/

## Terminology

- **Event** (not Question), **market** (not Outcome)
- **HMAC public/private key** — L2 HTTP auth (`Key` / `Timestamp` / `HMAC`, SHA-512)
- **Owner wallet private key** — Safe owner EOA; signs EIP-712 `DeriveApiKey` and `LimitOrderIntent`
- **L1 / L2** — wallet EIP-712 vs HMAC HTTP. HMAC never replaces the wallet signature.
- Do not use Polymarket header names (`POLY_*`), SHA-256 HMAC, or a passphrase

## Coming soon (on-chain CLOB)

- Every Web3 page opens with a Coming soon `<Note>`: production is still HMAC-only ledger settlement
- Use frontmatter `tag: "Coming soon"` on pages that are not live yet
- Do **not** add `api-reference/` pages for endpoints missing from production OpenAPI (`https://api.futuur.com/docs/schema/`)
- Document derive / signing-context / enable-trading only in guides, marked as not live on `api.futuur.com`
- Live HMAC pages stay untagged; they may link to coming-soon pages

## Help center

- User-facing help lives in `help/` (English) and `pt-br/help/` (Brazilian Portuguese); `help.mdx` and `pt-br/help.mdx` are the home pages. Terms and Privacy are in `legal/`
- Keep the same file names in both languages. When you change an English help page, update its Portuguese twin in the same pull request
- One topic per page, each question as an `##` heading so it gets its own anchor and search entry. Do not hide answers in accordions
- Escape dollar amounts as `\$` in help pages. LaTeX is on, so a bare `$` starts a formula
- Give every image alt text. Help images live in `images/help/<page>/`
- The `redirects` in `docs.json` map the old Notion help URLs to these pages. Do not remove them
- The API terminology and "Coming soon" rules below apply to the API docs, not to help pages

## Style preferences

{/* Add any project-specific style rules below */}

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- API URLs in MDX examples: use the literal base `https://api.futuur.com/v2.0` (see `snippets/constants.mdx` for the canonical values). Do not use `{apiUrl}` template tags — Mintlify does not interpolate imported consts inside page code fences.

## Content boundaries

- Do not invent production request fields (for example `order_intent_signature` on live `POST /orders/`)
- Do not document Polymarket-only products we do not have (Perps, Bridge, Combos, Builder Program, official SDKs)
- Do not document internal admin, Django flags, or preview-only hosts as if they were production
- After Django/API changes, use the **sync-futuur-api-docs** skill — OpenAPI remains the source of truth for live endpoints
