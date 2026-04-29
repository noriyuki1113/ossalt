#!/usr/bin/env python3
"""
check_seo.py
ossalt.jp の重要ページを毎日チェックし、SEO事故を検知する。
Search Console API連携なし版（HTMLクローラー + Supabase記録）。

Usage:
    python check_seo.py
    DRY_RUN=true python check_seo.py   # 書き込みなし

cron:
    0 5 * * * cd /opt/ossalt-worker && .venv/bin/python check_seo.py >> logs/check_seo.log 2>&1
"""

import os
import sys
import time
import logging
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from supabase import create_client, Client
from utils import start_worker_run, finish_worker_run

# ---------------------------------------------------------------------------
# 設定
# ---------------------------------------------------------------------------

load_dotenv()

SUPABASE_URL              = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
OSSALT_BASE_URL           = os.environ.get("OSSALT_BASE_URL", "https://ossalt.jp").rstrip("/")
DRY_RUN                   = os.environ.get("DRY_RUN", "false").lower() == "true"

REQUEST_TIMEOUT = 15
SLEEP_SEC       = 1.0   # URL間のsleep

USER_AGENT = "ossalt-seo-checker/1.0 (https://ossalt.jp)"

# ---------------------------------------------------------------------------
# チェック対象 URL
# ---------------------------------------------------------------------------

CHECK_URLS: list[str] = [
    f"{OSSALT_BASE_URL}/",
    f"{OSSALT_BASE_URL}/sitemap.xml",
    f"{OSSALT_BASE_URL}/robots.txt",
    f"{OSSALT_BASE_URL}/tools/appflowy",
    f"{OSSALT_BASE_URL}/alternatives/notion",
]

# SPAの「まだ描画されていない」を示すテキスト
LOADING_PATTERNS = ["読み込み中", "Loading...", "loading..."]

# ---------------------------------------------------------------------------
# ログ設定
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    stream=sys.stdout,
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# HTTPフェッチ
# ---------------------------------------------------------------------------

def fetch_url(url: str) -> tuple[requests.Response | None, int, str | None]:
    """
    Returns: (response, response_ms, error_message)
    """
    headers = {"User-Agent": USER_AGENT}
    start = time.monotonic()
    try:
        resp = requests.get(
            url,
            headers=headers,
            timeout=REQUEST_TIMEOUT,
            allow_redirects=True,
        )
        ms = int((time.monotonic() - start) * 1000)
        return resp, ms, None
    except requests.Timeout:
        ms = int((time.monotonic() - start) * 1000)
        return None, ms, f"Timeout after {REQUEST_TIMEOUT}s"
    except requests.RequestException as e:
        ms = int((time.monotonic() - start) * 1000)
        return None, ms, str(e)


# ---------------------------------------------------------------------------
# URL種別判定
# ---------------------------------------------------------------------------

def url_type(url: str) -> str:
    path = url.split("?")[0].rstrip("/")
    if path.endswith("sitemap.xml"):
        return "sitemap"
    if path.endswith("robots.txt"):
        return "robots"
    return "html"


# ---------------------------------------------------------------------------
# HTMLページチェック
# ---------------------------------------------------------------------------

def check_html(resp: requests.Response) -> dict:
    """HTMLページのSEO要素を抽出して返す。"""
    result: dict = {
        "title":               None,
        "meta_description":    None,
        "has_canonical":       False,
        "has_og_title":        False,
        "has_og_description":  False,
        "has_json_ld":         False,
        "contains_loading_text": False,
        "issues":              [],
    }

    try:
        soup = BeautifulSoup(resp.text, "lxml")
    except Exception:
        soup = BeautifulSoup(resp.text, "html.parser")

    # title
    title_tag = soup.find("title")
    result["title"] = title_tag.get_text(strip=True) if title_tag else None
    if not result["title"]:
        result["issues"].append("title タグが空または存在しない")

    # meta description
    desc_tag = soup.find("meta", attrs={"name": "description"})
    if desc_tag and desc_tag.get("content"):
        result["meta_description"] = desc_tag["content"][:300]
    else:
        result["issues"].append("meta description が存在しない")

    # canonical
    canonical_tag = soup.find("link", attrs={"rel": "canonical"})
    result["has_canonical"] = bool(canonical_tag and canonical_tag.get("href"))
    if not result["has_canonical"]:
        result["issues"].append("canonical リンクが存在しない")

    # og:title
    og_title = soup.find("meta", attrs={"property": "og:title"})
    result["has_og_title"] = bool(og_title and og_title.get("content"))

    # og:description
    og_desc = soup.find("meta", attrs={"property": "og:description"})
    result["has_og_description"] = bool(og_desc and og_desc.get("content"))

    # JSON-LD
    json_ld_tags = soup.find_all("script", attrs={"type": "application/ld+json"})
    result["has_json_ld"] = len(json_ld_tags) > 0

    # ローディングテキスト（SPAが描画されていないサイン）
    body_text = soup.get_text()
    for pattern in LOADING_PATTERNS:
        if pattern in body_text:
            result["contains_loading_text"] = True
            result["issues"].append(f"ローディングテキスト検出: {pattern!r}")
            break

    return result


# ---------------------------------------------------------------------------
# sitemap.xml チェック
# ---------------------------------------------------------------------------

def check_sitemap(resp: requests.Response) -> dict:
    result: dict = {
        "title": None,
        "meta_description": None,
        "has_canonical": False,
        "has_og_title": False,
        "has_og_description": False,
        "has_json_ld": False,
        "contains_loading_text": False,
        "issues": [],
    }
    body = resp.text

    has_urlset   = "<urlset"  in body
    has_sitemapindex = "<sitemapindex" in body

    if not (has_urlset or has_sitemapindex):
        result["issues"].append("sitemap.xml に <urlset> も <sitemapindex> も存在しない")
    else:
        # URL件数を概算
        url_count = body.count("<loc>")
        log.info(f"  sitemap URL件数: {url_count}")
        result["title"] = f"sitemap ({url_count} URLs)"

    return result


# ---------------------------------------------------------------------------
# robots.txt チェック
# ---------------------------------------------------------------------------

def check_robots(resp: requests.Response) -> dict:
    result: dict = {
        "title": None,
        "meta_description": None,
        "has_canonical": False,
        "has_og_title": False,
        "has_og_description": False,
        "has_json_ld": False,
        "contains_loading_text": False,
        "issues": [],
    }
    body = resp.text

    if "User-agent" not in body and "User-Agent" not in body:
        result["issues"].append("robots.txt に User-agent ディレクティブが存在しない")

    # 全クロール禁止チェック
    for line in body.splitlines():
        stripped = line.strip()
        if stripped.lower().startswith("disallow:"):
            path = stripped.split(":", 1)[1].strip()
            if path == "/":
                result["issues"].append("Disallow: / が設定されている — サイト全体がクロール禁止")
                break

    result["title"] = "robots.txt"
    return result


# ---------------------------------------------------------------------------
# ステータス判定
# ---------------------------------------------------------------------------

def determine_status(http_status: int | None, issues: list[str]) -> str:
    if http_status is None or http_status >= 500:
        return "error"
    if http_status >= 400:
        return "error"
    if issues:
        return "warn"
    return "ok"


# ---------------------------------------------------------------------------
# Supabase insert
# ---------------------------------------------------------------------------

def insert_result(client: Client, row: dict) -> None:
    if DRY_RUN:
        status_icon = {"ok": "✓", "warn": "△", "error": "✗"}.get(row["status"], "?")
        log.info(
            f"  [DRY_RUN] {status_icon} {row['url']} | "
            f"HTTP={row['http_status']} {row['response_ms']}ms "
            f"status={row['status']}"
        )
        if row.get("error_message"):
            log.info(f"           error: {row['error_message']}")
        return

    try:
        client.table("seo_checks").insert(row).execute()
    except Exception as e:
        log.error(f"  Supabase insert エラー ({row['url']}): {e}")


# ---------------------------------------------------------------------------
# 1 URL をチェックして行データを返す
# ---------------------------------------------------------------------------

def check_one(url: str, client: Client, now_iso: str) -> str:
    """チェック実行 → insert → status文字列を返す。"""
    log.info(f"チェック: {url}")
    resp, ms, err_msg = fetch_url(url)

    http_status = resp.status_code if resp is not None else None
    kind        = url_type(url)

    if resp is None or http_status is None:
        row = {
            "url":                  url,
            "status":               "error",
            "http_status":          None,
            "title":                None,
            "meta_description":     None,
            "has_canonical":        False,
            "has_og_title":         False,
            "has_og_description":   False,
            "has_json_ld":          False,
            "contains_loading_text":False,
            "response_ms":          ms,
            "error_message":        err_msg,
            "checked_at":           now_iso,
        }
        log.warning(f"  ERROR: {err_msg} ({ms}ms)")
        insert_result(client, row)
        return "error"

    # --- コンテンツチェック ---
    if kind == "html":
        detail = check_html(resp)
    elif kind == "sitemap":
        detail = check_sitemap(resp)
    else:  # robots
        detail = check_robots(resp)

    issues = detail.pop("issues", [])
    status = determine_status(http_status, issues)

    row = {
        "url":                  url,
        "status":               status,
        "http_status":          http_status,
        "title":                detail.get("title"),
        "meta_description":     detail.get("meta_description"),
        "has_canonical":        detail.get("has_canonical", False),
        "has_og_title":         detail.get("has_og_title", False),
        "has_og_description":   detail.get("has_og_description", False),
        "has_json_ld":          detail.get("has_json_ld", False),
        "contains_loading_text":detail.get("contains_loading_text", False),
        "response_ms":          ms,
        "error_message":        "; ".join(issues) if issues else None,
        "checked_at":           now_iso,
    }

    # ログ出力
    icon = {"ok": "✓", "warn": "△", "error": "✗"}[status]
    log.info(f"  {icon} HTTP={http_status} {ms}ms status={status}")
    for issue in issues:
        log.warning(f"    └ {issue}")

    insert_result(client, row)
    return status


# ---------------------------------------------------------------------------
# メイン
# ---------------------------------------------------------------------------

def main() -> None:
    started_at = datetime.now(timezone.utc)
    log.info("=" * 60)
    log.info(f"check_seo.py 開始 {started_at.isoformat()}")
    log.info(f"DRY_RUN={DRY_RUN}  対象={len(CHECK_URLS)} URL")
    log.info("=" * 60)

    run_id = start_worker_run("check_seo")

    client  = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    now_iso = started_at.isoformat()
    counts  = {"ok": 0, "warn": 0, "error": 0}

    try:
        for url in CHECK_URLS:
            try:
                status = check_one(url, client, now_iso)
                counts[status] = counts.get(status, 0) + 1
            except Exception as e:
                log.error(f"予期しないエラー ({url}): {e}")
                counts["error"] += 1

            time.sleep(SLEEP_SEC)

        elapsed = (datetime.now(timezone.utc) - started_at).total_seconds()
        log.info("=" * 60)
        log.info(f"完了  経過時間: {elapsed:.1f}s")
        log.info(f"  OK:    {counts['ok']}")
        log.info(f"  WARN:  {counts['warn']}")
        log.info(f"  ERROR: {counts['error']}")
        log.info("=" * 60)

        final_status = "error" if counts["error"] > 0 else "success"
        msg = f"ok={counts['ok']} warn={counts['warn']} error={counts['error']}"
        if DRY_RUN:
            msg = f"[DRY_RUN] {msg}"
        finish_worker_run(
            run_id, final_status,
            success_count=counts["ok"],
            skipped_count=counts["warn"],
            error_count=counts["error"],
            message=msg,
        )

        if counts["error"] > 0:
            sys.exit(1)

    except Exception as e:
        log.exception(f"予期しない例外: {e}")
        finish_worker_run(run_id, "error", counts["ok"], counts["warn"], counts["error"], str(e))
        sys.exit(1)


if __name__ == "__main__":
    main()
