#!/usr/bin/env python3
"""Scrape Ghazaros Aghayan fairy tales listed on the 2004 Wikisource book TOC."""
from __future__ import annotations

import html as htmlmod
import json
import re
import subprocess
import time
import urllib.parse
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "aghayan"
STORIES = OUT / "stories"
SOURCE = (
    "https://hy.wikisource.org/wiki/"
    "%D5%80%D5%A5%D6%84%D5%AB%D5%A1%D5%A9%D5%B6%D5%A5%D6%80,_"
    "%D5%82%D5%A1%D5%A6%D5%A1%D6%80%D5%B8%D5%BD_%D4%B1%D5%B2%D5%A1%D5%B5%D5%A1%D5%B6_(2004)"
)
AUTHOR = "Ղազարոս Աղայան"
SKIP_TITLES = {
    "Հեղինակ:Ղազարոս Աղայան",
    "Պատանի ընթերցող",
    "Բառարան",
}


def curl_json(url: str, retries: int = 6) -> dict:
    last = None
    for i in range(retries):
        try:
            out = subprocess.check_output(
                [
                    "curl",
                    "-sL",
                    "-A",
                    "NanikStoriesBot/1.0 (nanik.app)",
                    "--max-time",
                    "90",
                    url,
                ]
            )
            if not out.strip():
                time.sleep(1.2 * (i + 1))
                continue
            return json.loads(out)
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1.2 * (i + 1))
    raise RuntimeError(f"failed {url}: {last}")


def api(params: dict) -> dict:
    params = dict(params)
    params["format"] = "json"
    url = "https://hy.wikisource.org/w/api.php?" + urllib.parse.urlencode(params)
    return curl_json(url)


class TextExtract(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.skip = 0
        self.in_p = False
        self.paras: list[str] = []
        self.cur: list[str] = []

    def handle_starttag(self, tag: str, attrs: list) -> None:
        d = dict(attrs)
        cls = d.get("class", "")
        if isinstance(cls, list):
            cls = " ".join(cls)
        if tag in ("script", "style", "table", "sup", "noscript"):
            self.skip += 1
            return
        if tag == "div" and any(
            x in cls
            for x in (
                "infobox",
                "navbox",
                "mw-references",
                "hatnote",
                "thumb",
                "toc",
                "catlinks",
                "reflist",
                "noprint",
                "ws-header",
                "ws-noexport",
                "authority-control",
                "mw-jump",
            )
        ):
            self.skip += 1
            return
        if tag == "p" and not self.skip:
            self.in_p = True
            self.cur = []
        if tag == "br" and self.in_p and not self.skip:
            self.cur.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in ("script", "style", "table", "sup", "noscript", "div") and self.skip:
            self.skip = max(0, self.skip - 1)
            return
        if tag == "p" and self.in_p and not self.skip:
            text = "".join(self.cur)
            text = text.replace("\u200b", "").replace("\ufeff", "")
            text = re.sub(r"[ \t]+", " ", text)
            text = re.sub(r"\n{2,}", "\n", text).strip()
            text = re.sub(r"\[\d+\]", "", text).strip()
            if text and len(text) > 12:
                # Keep verse line-breaks as single paragraph with spaces if short lines
                if text.count("\n") >= 2 and max(len(x) for x in text.split("\n")) < 80:
                    text = re.sub(r"\s*\n\s*", " ", text).strip()
                else:
                    text = re.sub(r"\s*\n\s*", " ", text).strip()
                self.paras.append(text)
            self.in_p = False
            self.cur = []

    def handle_data(self, data: str) -> None:
        if self.skip or not self.in_p:
            return
        self.cur.append(data)


def slugify(title: str, nr: int) -> str:
    t = title.strip().lower()
    t = t.replace(" ", "_").replace("/", "_").replace("՝", "_").replace("՜", "")
    t = re.sub(r"[^\w\-Ա-Ֆա-ֆև_]", "", t, flags=re.UNICODE)
    t = re.sub(r"_+", "_", t).strip("_")
    return f"aghayan-{nr:02d}-{t}"


def page_url(title: str) -> str:
    return "https://hy.wikisource.org/wiki/" + urllib.parse.quote(title.replace(" ", "_"))


def toc_stories() -> list[tuple[str, str]]:
    """Return [(title, display_title), ...] from the book page TOC links."""
    raw = subprocess.check_output(
        ["curl", "-sL", "-A", "NanikStoriesBot/1.0", "--max-time", "60", SOURCE]
    ).decode("utf-8", "replace")
    m = re.search(
        r'id="mw-content-text"(.*?)(?:id="catlinks"|class="printfooter")', raw, re.S
    )
    chunk = m.group(1) if m else raw
    items: list[tuple[str, str]] = []
    seen: set[str] = set()
    for href, title_attr, text in re.findall(
        r'<a[^>]+href="(/wiki/[^"]+)"[^>]*(?:title="([^"]*)")?[^>]*>(.*?)</a>',
        chunk,
        flags=re.S,
    ):
        if "action=" in href or "Special:" in href or "Հատուկ:" in href:
            continue
        if "Կատեգորիա:" in href or "Category:" in href or "Հեղինակ:" in href:
            continue
        if "Ինդեքս:" in href or "Index:" in href or "Էջ:" in href or "Page:" in href:
            continue
        title = htmlmod.unescape(title_attr or "").strip()
        label = re.sub(r"<[^>]+>", "", text)
        label = htmlmod.unescape(label).strip()
        label = re.sub(r"\s+\d+$", "", label).strip()  # strip page numbers if in text
        if not title:
            # decode from href
            path = href.split("/wiki/", 1)[-1]
            title = urllib.parse.unquote(path).replace("_", " ")
        if title in SKIP_TITLES or label in SKIP_TITLES:
            continue
        if title.startswith("Հեղինակ:"):
            continue
        # Prefer TOC story links (Armenian titles, not meta)
        if title in seen:
            continue
        # Skip empty / tiny labels that aren't stories
        if len(label) < 2 and len(title) < 2:
            continue
        seen.add(title)
        display = label if label and len(label) >= 2 else title
        items.append((title, display))
    return items


def clean_paras(paras: list[str], title: str) -> list[str]:
    out = []
    for p in paras:
        t = p.strip()
        if not t:
            continue
        if t in (title, AUTHOR, title.upper(), AUTHOR.upper()):
            continue
        if t.replace(" ", "") == title.replace(" ", "").upper():
            continue
        if len(t) < 40 and "Աղայան" in t:
            continue
        out.append(t)
    return out


def main() -> None:
    STORIES.mkdir(parents=True, exist_ok=True)
    toc = toc_stories()
    print(f"TOC stories: {len(toc)}")
    for i, (t, d) in enumerate(toc, 1):
        print(f"  {i:02d} {d}  [{t}]")

    index_stories = []
    skipped = []
    for i, (page_title, display) in enumerate(toc, 1):
        slug = slugify(display, i)
        out_path = STORIES / f"{slug}.json"
        if out_path.exists():
            existing = json.loads(out_path.read_text(encoding="utf-8"))
            index_stories.append(
                {"nr": i, "slug": slug, "title": existing.get("title") or display}
            )
            print(f"{i:02d} SKIP existing {display}")
            continue
        d = api({"action": "parse", "page": page_title, "prop": "text", "disableeditsection": 1})
        if "error" in d:
            skipped.append((page_title, d["error"]))
            print(f"{i:02d} ERROR {page_title}: {d['error']}")
            continue
        ex = TextExtract()
        ex.feed(d["parse"]["text"]["*"])
        paras = clean_paras(ex.paras, display)
        if not paras:
            skipped.append((page_title, "empty"))
            print(f"{i:02d} EMPTY {page_title}")
            continue
        story = {
            "nr": i,
            "slug": slug,
            "title": display,
            "author": AUTHOR,
            "sourceUrl": page_url(page_title),
            "paragraphs": paras,
        }
        out_path.write_text(
            json.dumps(story, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        index_stories.append({"nr": i, "slug": slug, "title": display})
        chars = sum(len(p) for p in paras)
        print(f"{i:02d} {display} paras={len(paras)} chars={chars}")
        time.sleep(0.35)

    index = {
        "author": AUTHOR,
        "source": SOURCE,
        "lang": "hy",
        "stories": index_stories,
    }
    (OUT / "index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("DONE", len(index_stories), "skipped", skipped)


if __name__ == "__main__":
    main()
