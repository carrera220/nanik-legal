#!/usr/bin/env python3
"""Scrape Hans Christian Andersen fairy-tale articles from Armenian Wikipedia."""
from __future__ import annotations

import json
import re
import subprocess
import time
import urllib.parse
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "andersen-hy"
STORIES = OUT / "stories"
SOURCE = (
    "https://hy.wikipedia.org/wiki/"
    "%D4%BF%D5%A1%D5%BF%D5%A5%D5%A3%D5%B8%D6%80%D5%AB%D5%A1:"
    "%D5%80%D5%A1%D5%B6%D5%BD_%D5%94%D6%80%D5%AB%D5%BD%D5%BF%D5%AB%D5%A1%D5%B6_"
    "%D4%B1%D5%B6%D5%A4%D5%A5%D6%80%D5%BD%D5%A5%D5%B6%D5%AB_%D5%B0%D5%A5%D6%84%D5%AB%D5%A1%D5%A9%D5%B6%D5%A5%D6%80"
)
AUTHOR = "Հանս Քրիստիան Անդերսեն"
CATEGORY = "Կատեգորիա:Հանս Քրիստիան Անդերսենի հեքիաթներ"


def api(params: dict, retries: int = 8) -> dict:
    params = dict(params)
    params["format"] = "json"
    url = "https://hy.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
    last_err: Exception | None = None
    for i in range(retries):
        try:
            out = subprocess.check_output(
                [
                    "curl",
                    "-sL",
                    "-A",
                    "NanikStoriesBot/1.0 (nanik.app; fair use archive)",
                    "--max-time",
                    "90",
                    "--retry",
                    "3",
                    "--retry-delay",
                    "2",
                    url,
                ]
            )
            if not out.strip():
                time.sleep(1.5 * (i + 1))
                continue
            return json.loads(out)
        except Exception as e:  # noqa: BLE001
            last_err = e
            time.sleep(1.5 * (i + 1))
    raise RuntimeError(f"API failed for {params}: {last_err}")


class TextExtract(HTMLParser):
    STOP_FRAGMENTS = (
        "տես նաև",
        "աղբյուր",
        "ծանոթագր",
        "գրականություն",
        "արտաքին հղում",
        "հղումներ",
        "էկրանավոր",
        "կինոնկար",
        "մշակութային",
        "կենցաղային",
        "ինքնակենսագր",
        "կերպարներ",
        "see also",
        "references",
        "external",
    )

    def __init__(self) -> None:
        super().__init__()
        self.skip = 0
        self.in_p = False
        self.in_heading = False
        self.paras: list[str] = []
        self.cur: list[str] = []
        self.stop = False

    def handle_starttag(self, tag: str, attrs: list) -> None:
        if self.stop:
            return
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
                "authority-control",
                "catlinks",
                "reflist",
                "sistersitebox",
                "metadata",
                "noprint",
                "mw-jump",
                "sidebar",
            )
        ):
            self.skip += 1
            return
        if tag in ("ol", "ul") and ("references" in cls or "gallery" in cls):
            self.skip += 1
            return
        if tag in ("h2", "h3") and not self.skip:
            self.in_heading = True
            self.cur = []
        if tag == "p" and not self.skip:
            self.in_p = True
            self.cur = []

    def handle_endtag(self, tag: str) -> None:
        if self.stop:
            return
        if tag in ("script", "style", "table", "sup", "noscript", "div", "ol", "ul") and self.skip:
            self.skip = max(0, self.skip - 1)
            return
        if tag in ("h2", "h3") and self.in_heading:
            h = re.sub(r"\s+", " ", "".join(self.cur)).strip()
            h = re.sub(r"\[խմբագրել.*?\]", "", h).strip()
            low = h.lower()
            if any(w in low for w in self.STOP_FRAGMENTS):
                self.stop = True
            self.in_heading = False
            self.cur = []
        if tag == "p" and self.in_p and not self.skip:
            text = re.sub(r"\s+", " ", "".join(self.cur)).strip()
            text = re.sub(r"\[\d+\]", "", text).strip()
            if text and len(text) > 25:
                self.paras.append(text)
            self.in_p = False
            self.cur = []

    def handle_data(self, data: str) -> None:
        if self.stop or self.skip:
            return
        if self.in_p or self.in_heading:
            self.cur.append(data)


def slugify(title: str, nr: int) -> str:
    t = re.sub(r"\s*\(հեքիաթ\)\s*$", "", title).strip()
    t = t.replace(" ", "_").replace("/", "_")
    t = re.sub(r"[^\w\-Ա-Ֆա-ֆև]", "", t, flags=re.UNICODE)
    return f"andersen-hy-{nr:02d}-{t}"


def display_title(title: str) -> str:
    return re.sub(r"\s*\(հեքիաթ\)\s*$", "", title).strip()


def page_url(title: str) -> str:
    return "https://hy.wikipedia.org/wiki/" + urllib.parse.quote(title.replace(" ", "_"))


def list_members() -> list[dict]:
    cm: list[dict] = []
    cont: dict = {}
    while True:
        p = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": CATEGORY,
            "cmlimit": "500",
            "cmnamespace": "0",
        }
        p.update(cont)
        d = api(p)
        cm.extend(d["query"]["categorymembers"])
        if "continue" in d:
            cont = d["continue"]
        else:
            break
    return sorted(cm, key=lambda m: m["title"])


def main() -> None:
    STORIES.mkdir(parents=True, exist_ok=True)
    members = list_members()
    print(f"scraping {len(members)} stories")
    index_stories = []
    skipped = []
    for i, m in enumerate(members, 1):
        title = m["title"]
        slug = slugify(title, i)
        out_path = STORIES / f"{slug}.json"
        if out_path.exists():
            existing = json.loads(out_path.read_text(encoding="utf-8"))
            index_stories.append(
                {"nr": i, "slug": slug, "title": existing.get("title") or display_title(title)}
            )
            print(f"{i:02d} SKIP existing {display_title(title)}")
            continue
        d = api({"action": "parse", "page": title, "prop": "text", "disableeditsection": 1})
        if "error" in d:
            skipped.append((title, d["error"]))
            print(f"{i:02d} ERROR {title}")
            continue
        ex = TextExtract()
        ex.feed(d["parse"]["text"]["*"])
        paras = ex.paras
        if not paras:
            skipped.append((title, "no paras"))
            print(f"{i:02d} EMPTY {title}")
            continue
        story = {
            "nr": i,
            "slug": slug,
            "title": display_title(title),
            "author": AUTHOR,
            "sourceUrl": page_url(title),
            "paragraphs": paras,
        }
        out_path.write_text(json.dumps(story, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        index_stories.append({"nr": i, "slug": slug, "title": display_title(title)})
        chars = sum(len(p) for p in paras)
        print(f"{i:02d} {display_title(title)} paras={len(paras)} chars={chars}")
        time.sleep(0.4)

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
