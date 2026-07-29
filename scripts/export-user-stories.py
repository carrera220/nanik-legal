#!/usr/bin/env python3
"""Export synced Nanik user_stories into static Stories collections by language.

Reads a JSON dump from the Supabase SQL API (or /tmp/user-stories-full.json)
and writes:
  data/nanik-{lang}/index.json
  data/nanik-{lang}/stories/{slug}.json
  images/stories/nanik-{lang}/{slug}.jpg  (when cover URL downloads)

Usage:
  SUPABASE_ACCESS_TOKEN=… python3 scripts/export-user-stories.py
  python3 scripts/export-user-stories.py --from /tmp/user-stories-full.json
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import unicodedata
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
PROJECT_REF = os.environ.get("SUPABASE_PROJECT_REF", "zljowsxavbpqfdskekwd")


def fetch_rows() -> list[dict]:
    token = os.environ.get("SUPABASE_ACCESS_TOKEN", "").strip()
    if not token:
        raise SystemExit("Missing SUPABASE_ACCESS_TOKEN")
    query = (
        "select story_id, fal_cover_url, generated_at, updated_at, story_payload "
        "from public.user_stories "
        "order by coalesce(generated_at, updated_at) desc"
    )
    payload = json.dumps({"query": query})
    proc = subprocess.run(
        [
            "curl",
            "-sS",
            "--max-time",
            "120",
            f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query",
            "-H",
            f"Authorization: Bearer {token}",
            "-H",
            "Content-Type: application/json",
            "--data-binary",
            "@-",
        ],
        input=payload.encode(),
        capture_output=True,
        check=False,
    )
    if proc.returncode != 0:
        raise SystemExit(proc.stderr.decode() or "curl failed")
    data = json.loads(proc.stdout.decode())
    if isinstance(data, dict) and data.get("message"):
        raise SystemExit(data["message"])
    if not isinstance(data, list):
        raise SystemExit(f"Unexpected response: {type(data)}")
    return data


def slugify(title: str, story_id: str, lang: str) -> str:
    base = unicodedata.normalize("NFKC", title or "").strip().lower()
    base = re.sub(r"\s+", "_", base)
    base = re.sub(r"[^\w\-]+", "", base, flags=re.UNICODE)
    base = base.strip("_")[:48] or "story"
    short = re.sub(r"^story_", "", story_id or "")[-10:]
    return f"nanik-{lang}-{base}-{short}"


def split_paragraphs(body: str) -> list[str]:
    text = (body or "").replace("\r\n", "\n").strip()
    if not text:
        return []
    parts = [p.strip() for p in re.split(r"\n\s*\n+", text) if p.strip()]
    if len(parts) > 1:
        return parts
    # Single block — soft-split on sentence ends for readability.
    sentences = re.split(r"(?<=[.!?։…])\s+", text)
    chunks: list[str] = []
    buf = ""
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        if not buf:
            buf = s
        elif len(buf) + 1 + len(s) < 420:
            buf = f"{buf} {s}"
        else:
            chunks.append(buf)
            buf = s
    if buf:
        chunks.append(buf)
    return chunks or [text]


def detect_lang(payload: dict, body: str, title: str) -> str:
    code = (payload.get("storyLanguageCode") or payload.get("language") or "").strip().lower()
    if code in ("hy", "en", "ru"):
        return code
    sample = f"{title} {body}"
    armenian = len(re.findall(r"[\u0530-\u058F]", sample))
    cyrillic = len(re.findall(r"[\u0400-\u04FF]", sample))
    latin = len(re.findall(r"[A-Za-z]", sample))
    total = armenian + cyrillic + latin or 1
    if armenian / total > 0.2:
        return "hy"
    if cyrillic / total > 0.2:
        return "ru"
    return "en"


def download_cover(url: str, dest: Path) -> bool:
    if not url or not url.startswith("http"):
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    # Prefer jpg extension regardless of source.
    tmp = dest.with_suffix(dest.suffix + ".part")
    proc = subprocess.run(
        ["curl", "-sSL", "--max-time", "60", "-o", str(tmp), url],
        capture_output=True,
    )
    if proc.returncode != 0 or not tmp.exists() or tmp.stat().st_size < 800:
        if tmp.exists():
            tmp.unlink()
        return False
    tmp.replace(dest)
    return True


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="from_path", help="Existing JSON dump path")
    ap.add_argument("--skip-download", action="store_true")
    args = ap.parse_args()

    if args.from_path:
        rows = json.loads(Path(args.from_path).read_text())
        if not isinstance(rows, list):
            raise SystemExit("Dump must be a JSON array")
    else:
        rows = fetch_rows()

    by_lang: dict[str, list[dict]] = {"hy": [], "en": [], "ru": []}
    seen_titles: set[tuple[str, str]] = set()

    for row in rows:
        payload = row.get("story_payload") or {}
        if isinstance(payload, str):
            payload = json.loads(payload)
        body = (payload.get("bodyText") or "").strip()
        if len(body) < 40:
            continue
        title = (
            (payload.get("titleArmenian") or "").strip()
            or (payload.get("title") or "").strip()
            or "Untitled story"
        )
        lang = detect_lang(payload, body, title)
        key = (lang, title.casefold())
        if key in seen_titles:
            continue
        seen_titles.add(key)

        story_id = str(row.get("story_id") or "")
        slug = slugify(title, story_id, lang)
        cover_url = (row.get("fal_cover_url") or "").strip()
        # Prefer http illustration already on payload.
        for ill in payload.get("illustrations") or []:
            if not isinstance(ill, dict):
                continue
            u = (ill.get("url") or ill.get("remoteUrl") or "").strip()
            if u.startswith("http"):
                cover_url = cover_url or u
                break

        rel_cover = None
        if cover_url and not args.skip_download:
            ext = ".jpg"
            path = urlparse(cover_url).path.lower()
            if path.endswith(".png"):
                ext = ".png"
            elif path.endswith(".webp"):
                ext = ".webp"
            dest = ROOT / "images" / "stories" / f"nanik-{lang}" / f"{slug}{ext}"
            if download_cover(cover_url, dest):
                rel_cover = f"images/stories/nanik-{lang}/{slug}{ext}"

        story = {
            "nr": 0,
            "slug": slug,
            "title": title,
            "author": "Made with Nanik",
            "sourceUrl": "https://nanik.app",
            "language": lang,
            "coverImage": rel_cover,
            "coverImageRemote": cover_url or None,
            "paragraphs": split_paragraphs(body),
        }
        by_lang.setdefault(lang, []).append(story)

    for lang, stories in by_lang.items():
        if not stories:
            # Keep empty dirs clean — skip writing empty collections.
            continue
        for i, story in enumerate(stories, start=1):
            story["nr"] = i
        col_dir = ROOT / "data" / f"nanik-{lang}"
        stories_dir = col_dir / "stories"
        stories_dir.mkdir(parents=True, exist_ok=True)
        # Clear previous generated story JSON for this collection.
        for old in stories_dir.glob("nanik-*.json"):
            old.unlink()
        index = {
            "author": "Made with Nanik",
            "source": "Nanik app library (synced user stories)",
            "language": lang,
            "stories": [
                {
                    "nr": s["nr"],
                    "slug": s["slug"],
                    "title": s["title"],
                    "coverImage": s.get("coverImage"),
                }
                for s in stories
            ],
        }
        (col_dir / "index.json").write_text(
            json.dumps(index, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        for s in stories:
            out = {k: v for k, v in s.items() if k != "coverImageRemote"}
            # Keep remote fallback for CDN if local download failed.
            if not out.get("coverImage") and s.get("coverImageRemote"):
                out["coverImage"] = s["coverImageRemote"]
            (stories_dir / f"{s['slug']}.json").write_text(
                json.dumps(out, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
        print(f"nanik-{lang}: {len(stories)} stories")


if __name__ == "__main__":
    main()
