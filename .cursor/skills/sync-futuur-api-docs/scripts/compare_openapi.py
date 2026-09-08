#!/usr/bin/env python3
"""Compare local Futuur OpenAPI JSON with the live schema. Run from repo root."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[4]
LOCAL_PATH = REPO_ROOT / "Futuur API Documentation (v2.0).json"

ENVIRONMENTS: dict[str, dict[str, str]] = {
    "production": {
        "base_url": "https://api.futuur.com",
        "schema_url": "https://api.futuur.com/docs/schema/",
        "docs_url": "https://api.futuur.com/docs/",
    },
    "staging": {
        "base_url": "https://api-staging.futuur.com",
        "schema_url": "https://api-staging.futuur.com/docs/schema/",
        "docs_url": "https://api-staging.futuur.com/docs/",
    },
    "local": {
        "base_url": "http://127.0.0.1:8000",
        "schema_url": "http://127.0.0.1:8000/docs/schema/",
        "docs_url": "http://127.0.0.1:8000/docs/",
    },
}
DEFAULT_ENV = "production"


def load_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def resolve_environment(name: str) -> dict[str, str]:
    key = name.strip().lower()
    if key not in ENVIRONMENTS:
        known = ", ".join(sorted(ENVIRONMENTS))
        raise SystemExit(f"Unknown environment {name!r}. Choose one of: {known}")
    return ENVIRONMENTS[key]


def fetch_live(schema_url: str) -> dict:
    with urllib.request.urlopen(schema_url, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def operations(spec: dict) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for path, methods in spec.get("paths", {}).items():
        for method, op in methods.items():
            if method in ("get", "post", "put", "patch", "delete"):
                key = f"{method.upper()} {path}"
                out[key] = op
    return out


def param_names(op: dict) -> set[str]:
    return {p["name"] for p in op.get("parameters", [])}


def schema_props(spec: dict, name: str) -> set[str]:
    s = spec.get("components", {}).get("schemas", {}).get(name, {})
    return set(s.get("properties", {}).keys())


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Compare local Futuur OpenAPI JSON with a live schema."
    )
    parser.add_argument(
        "--env",
        default=DEFAULT_ENV,
        choices=sorted(ENVIRONMENTS),
        help=f"API environment to compare against (default: {DEFAULT_ENV})",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    env = resolve_environment(args.env)

    if not LOCAL_PATH.exists():
        print(f"Missing local schema: {LOCAL_PATH}", file=sys.stderr)
        return 1

    local = load_json(LOCAL_PATH)
    schema_url = env["schema_url"]
    print(f"Environment: {args.env}")
    print(f"Fetching live schema from {schema_url} ...")
    live = fetch_live(schema_url)

    local_ops = operations(local)
    live_ops = operations(live)

    print("\n=== Endpoints in LIVE only (add MDX + docs.json) ===")
    missing_pages = sorted(set(live_ops) - set(local_ops))
    if missing_pages:
        for k in missing_pages:
            print(f"  {k}  ({live_ops[k].get('operationId', '')})")
    else:
        print("  (none)")

    print("\n=== Endpoints removed from LIVE ===")
    removed = sorted(set(local_ops) - set(live_ops))
    if removed:
        for k in removed:
            print(f"  {k}")
    else:
        print("  (none)")

    print("\n=== Parameter diffs (shared endpoints) ===")
    any_param_diff = False
    for k in sorted(set(local_ops) & set(live_ops)):
        lp, lvp = param_names(local_ops[k]), param_names(live_ops[k])
        if lp != lvp:
            any_param_diff = True
            print(f"  {k}")
            print(f"    local-only: {sorted(lp - lvp)}")
            print(f"    live-only:  {sorted(lvp - lp)}")
    if not any_param_diff:
        print("  (none)")

    local_schemas = set(local.get("components", {}).get("schemas", {}))
    live_schemas = set(live.get("components", {}).get("schemas", {}))
    print("\n=== New schemas in LIVE ===")
    for s in sorted(live_schemas - local_schemas):
        print(f"  {s}")
    if not (live_schemas - local_schemas):
        print("  (none)")

    print("\n=== Key schema property diffs ===")
    for name in (
        "EventDetail",
        "EventList",
        "UserPrivate",
        "UserPrivateRanking",
        "LimitOrder",
    ):
        lp, lvp = schema_props(local, name), schema_props(live, name)
        if lp != lvp:
            print(f"  {name}:")
            print(f"    live-only:  {sorted(lvp - lp)}")
            print(f"    local-only: {sorted(lp - lvp)}")

    print(f"\nLocal file: {LOCAL_PATH}")
    print(f"Live URL:   {schema_url}")
    print(f"Base URL:   {env['base_url']}")
    print(
        "\nTip: curl the live schema into the local file before re-running "
        "to refresh the baseline."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
