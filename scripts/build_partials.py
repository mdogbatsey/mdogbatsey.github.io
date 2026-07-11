#!/usr/bin/env python3
"""
build_partials.py — keep the site nav/footer in sync across all pages.

This site is plain static HTML (no Jekyll/build step at deploy time), so the
header (nav) and footer are kept as single-source-of-truth files in
partials/header.html and partials/footer.html. This script copies that
content into every page between the BEGIN/END marker comments.

Usage:
    python3 scripts/build_partials.py          # apply partials, write changed files
    python3 scripts/build_partials.py --check  # exit 1 if any file is out of sync (CI-friendly)

Do NOT hand-edit the nav or footer markup inside individual .html files —
edit partials/header.html or partials/footer.html and re-run this script.

Note: 404.html intentionally has a different nav (no "Matthias Dogbatsey"
brand link separate from the nav-links, since it's a noindex error page), so
it is footer-only. It is not in HEADER_FILES.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PARTIALS = ROOT / "partials"

HEADER_FILES = [
    "index.html", "about.html", "research.html", "publications.html",
    "talk.html", "teaching.html", "service.html", "cv.html", "news.html",
]
FOOTER_FILES = HEADER_FILES + ["404.html"]

BEGIN_HEADER = "  <!-- BEGIN HEADER: managed by scripts/build_partials.py — edit partials/header.html instead -->"
END_HEADER = "  <!-- END HEADER -->"
BEGIN_FOOTER = "  <!-- BEGIN FOOTER: managed by scripts/build_partials.py — edit partials/footer.html instead -->"
END_FOOTER = "  <!-- END FOOTER -->"


def indent(block: str, prefix: str = "  ") -> str:
    return "\n".join(prefix + line if line else line for line in block.split("\n"))


def apply_marker(text: str, begin: str, end: str, partial: str) -> str:
    i = text.index(begin)
    j = text.index(end, i) + len(end)
    replacement = begin + "\n" + partial.rstrip("\n") + "\n" + end
    return text[:i] + replacement + text[j:]


def main() -> int:
    check_only = "--check" in sys.argv

    header_partial = (PARTIALS / "header.html").read_text(encoding="utf-8")
    footer_partial = (PARTIALS / "footer.html").read_text(encoding="utf-8")
    header_partial = indent(header_partial.rstrip("\n"))
    footer_partial = indent(footer_partial.rstrip("\n"))

    changed = []
    for name in FOOTER_FILES:
        path = ROOT / name
        text = path.read_text(encoding="utf-8")
        original = text

        if name in HEADER_FILES:
            text = apply_marker(text, BEGIN_HEADER, END_HEADER, header_partial)

        text = apply_marker(text, BEGIN_FOOTER, END_FOOTER, footer_partial)

        if text != original:
            changed.append(name)
            if not check_only:
                path.write_text(text, encoding="utf-8")

    if changed:
        verb = "out of sync" if check_only else "updated"
        print(f"{verb}: {', '.join(changed)}")
    else:
        print("All pages already in sync with partials/.")

    if check_only and changed:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
