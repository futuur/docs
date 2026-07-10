"""Replace Mintlify snippet template tags with literal values from constants.mdx.

Mintlify only interpolates imported consts in prose, not in page-level code fences.
Hardcoding keeps examples copy-pasteable while constants.mdx remains the canonical list.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("{pusherAuthUrl}", "https://api.futuur.com/v2.0/pusher/auth/"),
    ("{schemaUrl}", "https://api.futuur.com/docs/schema/"),
    ("{docsUrl}", "https://api.futuur.com/docs/"),
    ("{apiUrl}", "https://api.futuur.com/v2.0"),
    ("{baseUrl}", "https://api.futuur.com"),
    ("{apiVersion}", "v2.0"),
    ("{pusherKey}", "0bc4bea57c1381a89b96"),
    ("{pusherCluster}", "us2"),
    ("{pathId}", "{id}"),
]

IMPORT_RE = re.compile(
    r'^import \{[^}]+\}\s+from\s+"/snippets/constants\.mdx";\r?\n?',
    re.M,
)
API_URL_CODE_IMPORT_RE = re.compile(
    r'^import \{ ApiUrlCode \}\s+from\s+"/snippets/api-url-code\.mdx";\r?\n?',
    re.M,
)
API_URL_CODE_USAGE_RE = re.compile(r"<ApiUrlCode apiUrl=\{apiUrl\} />\r?\n?")

SKIP_DIRS = {".cursor", "node_modules", ".git"}


def main() -> None:
    changed: list[str] = []

    for path in ROOT.rglob("*.mdx"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.name in {"constants.mdx", "api-url-code.mdx"} and "snippets" in path.parts:
            continue

        text = path.read_text(encoding="utf-8")
        original = text

        for old, new in REPLACEMENTS:
            text = text.replace(old, new)

        text = IMPORT_RE.sub("", text)
        text = API_URL_CODE_IMPORT_RE.sub("", text)
        text = API_URL_CODE_USAGE_RE.sub(
            "```\nhttps://api.futuur.com/v2.0\n```\n",
            text,
        )

        text = re.sub(r"\n{3,}", "\n\n", text)
        text = re.sub(r"(---\n(?:.*\n)*?---)\n+", r"\1\n\n", text, count=1)

        if text != original:
            path.write_text(text, encoding="utf-8", newline="\n")
            changed.append(str(path.relative_to(ROOT)))

    print(f"Updated {len(changed)} files:")
    for rel in sorted(changed):
        print(f"  {rel}")


if __name__ == "__main__":
    main()
