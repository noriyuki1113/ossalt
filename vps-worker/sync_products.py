#!/usr/bin/env python3
"""
sync_products.py
Supabaseのtoolsテーブル内のGitHub URLを持つOSSツールを取得し、
GitHub APIで最新メトリクスを取得してSupabaseへ更新する。

Usage:
    python sync_products.py
    DRY_RUN=true python sync_products.py   # 書き込みなし

cron:
    0 3 * * * cd /opt/ossalt-worker && .venv/bin/python sync_products.py >> logs/sync_products.log 2>&1
"""

import os
import re
import sys
import time
import logging
from datetime import datetime, timezone

import requests
from dotenv import load_dotenv
from supabase import create_client, Client
from utils import start_worker_run, finish_worker_run

# ---------------------------------------------------------------------------
# 設定
# ---------------------------------------------------------------------------

load_dotenv()

SUPABASE_URL             = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
GITHUB_TOKEN             = os.environ.get("GITHUB_TOKEN", "")
OSSALT_BASE_URL          = os.environ.get("OSSALT_BASE_URL", "https://ossalt.jp")
DRY_RUN                  = os.environ.get("DRY_RUN", "false").lower() == "true"

GITHUB_API = "https://api.github.com"
SLEEP_SEC  = 0.5   # 1件ごとのsleep（rate limit対策）
PAGE_SIZE  = 1000  # Supabase 1回のfetch上限

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
# GitHub APIセッション
# ---------------------------------------------------------------------------

def make_github_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({
        "User-Agent": "ossalt-sync-worker/1.0 (https://ossalt.jp)",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    })
    if GITHUB_TOKEN:
        session.headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    else:
        log.warning("GITHUB_TOKEN が未設定です。Rate limitが低くなります（60 req/h）")
    return session


# ---------------------------------------------------------------------------
# GitHub URL → owner/repo 抽出
# ---------------------------------------------------------------------------

_GITHUB_RE = re.compile(
    r"github\.com[/:]([a-zA-Z0-9_.-]+)/([a-zA-Z0-9_.-]+?)(?:\.git)?/?$"
)

def parse_github_repo(url: str) -> tuple[str, str] | None:
    """'https://github.com/owner/repo' → ('owner', 'repo')"""
    if not url:
        return None
    m = _GITHUB_RE.search(url)
    if not m:
        return None
    owner, repo = m.group(1), m.group(2)
    # サブパス（wiki, tree, issues等）は除外
    if owner in ("orgs", "topics", "sponsors") or "/" in repo:
        return None
    return owner, repo


# ---------------------------------------------------------------------------
# GitHub APIから情報取得
# ---------------------------------------------------------------------------

def fetch_repo(session: requests.Session, owner: str, repo: str) -> dict | None:
    url = f"{GITHUB_API}/repos/{owner}/{repo}"
    try:
        resp = session.get(url, timeout=15)
        if resp.status_code == 404:
            log.warning(f"  repo not found: {owner}/{repo}")
            return None
        if resp.status_code == 403:
            log.error(f"  GitHub rate limit exceeded. Remaining: {resp.headers.get('X-RateLimit-Remaining')}")
            reset_at = int(resp.headers.get("X-RateLimit-Reset", 0))
            wait = max(0, reset_at - int(time.time())) + 5
            log.info(f"  rate limit reset まで {wait}秒 待機します")
            time.sleep(wait)
            return None
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        log.error(f"  repo fetch error ({owner}/{repo}): {e}")
        return None


def fetch_latest_release(session: requests.Session, owner: str, repo: str) -> dict | None:
    url = f"{GITHUB_API}/repos/{owner}/{repo}/releases/latest"
    try:
        resp = session.get(url, timeout=15)
        if resp.status_code == 404:
            return None   # リリースなし — 正常
        if resp.status_code == 403:
            return None
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        log.warning(f"  release fetch error ({owner}/{repo}): {e}")
        return None


# ---------------------------------------------------------------------------
# Supabaseからツール一覧を取得
# ---------------------------------------------------------------------------

def fetch_tools(client: Client) -> list[dict]:
    log.info("Supabaseからtools一覧を取得中...")
    rows = []
    offset = 0
    while True:
        resp = (
            client.table("tools")
            .select("id, name, github_url")
            .not_.is_("github_url", "null")
            .range(offset, offset + PAGE_SIZE - 1)
            .execute()
        )
        batch = resp.data or []
        rows.extend(batch)
        if len(batch) < PAGE_SIZE:
            break
        offset += PAGE_SIZE
    log.info(f"  取得: {len(rows)} 件（github_url あり）")
    return rows


# ---------------------------------------------------------------------------
# Supabaseへ更新
# ---------------------------------------------------------------------------

def update_tool(client: Client, tool_id: int, payload: dict) -> bool:
    if DRY_RUN:
        log.info(f"  [DRY_RUN] id={tool_id} payload={payload}")
        return True
    try:
        client.table("tools").update(payload).eq("id", tool_id).execute()
        return True
    except Exception as e:
        log.error(f"  Supabase update error (id={tool_id}): {e}")
        return False


# ---------------------------------------------------------------------------
# メイン処理
# ---------------------------------------------------------------------------

def main() -> None:
    started_at = datetime.now(timezone.utc)
    log.info("=" * 60)
    log.info(f"sync_products.py 開始 {started_at.isoformat()}")
    log.info(f"DRY_RUN={DRY_RUN}")
    log.info("=" * 60)

    run_id = start_worker_run("sync_products")

    client  = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    session = make_github_session()

    total   = 0
    success = 0
    skipped = 0
    failed  = 0

    try:
        tools = fetch_tools(client)
        if not tools:
            log.info("更新対象ツールなし。終了します。")
            msg = "[DRY_RUN] " if DRY_RUN else ""
            finish_worker_run(run_id, "success", 0, 0, 0, f"{msg}対象ツールなし")
            return

        total = len(tools)

        for i, tool in enumerate(tools, 1):
            tool_id    = tool["id"]
            tool_name  = tool["name"] or f"id={tool_id}"
            github_url = tool.get("github_url", "")

            log.info(f"[{i}/{total}] {tool_name}")

            # --- owner/repo 抽出 ---
            parsed = parse_github_repo(github_url)
            if not parsed:
                log.warning(f"  GitHub URL を解析できません: {github_url!r}")
                skipped += 1
                continue

            owner, repo = parsed

            # --- リポジトリ情報 ---
            repo_data = fetch_repo(session, owner, repo)
            if repo_data is None:
                failed += 1
                time.sleep(SLEEP_SEC)
                continue

            # --- 最新リリース情報 ---
            release_data = fetch_latest_release(session, owner, repo)

            # --- 更新ペイロード組み立て ---
            license_spdx = None
            if isinstance(repo_data.get("license"), dict):
                license_spdx = repo_data["license"].get("spdx_id") or None
                if license_spdx == "NOASSERTION":
                    license_spdx = None

            payload: dict = {
                "github_stars":    repo_data.get("stargazers_count"),
                "github_forks":    repo_data.get("forks_count"),
                "github_issues":   repo_data.get("open_issues_count"),
                "github_watchers": repo_data.get("watchers_count"),
                "github_language": repo_data.get("language"),
                "github_license":  license_spdx,
                "github_archived": repo_data.get("archived", False),
                "last_commit_at":  repo_data.get("pushed_at"),
                "latest_release_name":         None,
                "latest_release_published_at": None,
                "checked_at": datetime.now(timezone.utc).isoformat(),
            }

            if release_data:
                payload["latest_release_name"]         = release_data.get("name") or release_data.get("tag_name")
                payload["latest_release_published_at"] = release_data.get("published_at")

            log.info(
                f"  stars={payload['github_stars']} "
                f"forks={payload['github_forks']} "
                f"lang={payload['github_language']} "
                f"archived={payload['github_archived']}"
            )

            # --- Supabase更新 ---
            if update_tool(client, tool_id, payload):
                success += 1
            else:
                failed += 1

            time.sleep(SLEEP_SEC)

        elapsed = (datetime.now(timezone.utc) - started_at).total_seconds()
        log.info("=" * 60)
        log.info(f"完了  経過時間: {elapsed:.1f}s")
        log.info(f"  成功: {success}")
        log.info(f"  スキップ: {skipped}")
        log.info(f"  失敗: {failed}")
        log.info(f"  合計: {total}")
        log.info("=" * 60)

        msg = f"total={total}"
        if DRY_RUN:
            msg = f"[DRY_RUN] {msg}"
        finish_worker_run(run_id, "success", success, skipped, failed, msg)

    except Exception as e:
        log.exception(f"予期しない例外: {e}")
        finish_worker_run(run_id, "error", success, skipped, failed, str(e))
        sys.exit(1)


if __name__ == "__main__":
    main()
