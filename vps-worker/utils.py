"""
utils.py
worker_runs テーブルへの記録共通関数。
sync_products.py / discover_tools.py / check_seo.py から使う。
"""

import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

_db = None

def _client():
    global _db
    if _db is None:
        _db = create_client(
            os.environ["SUPABASE_URL"],
            os.environ["SUPABASE_SERVICE_ROLE_KEY"],
        )
    return _db


def start_worker_run(job_name: str) -> str | None:
    """
    worker_runs に status='running' の行を insert し、run_id を返す。
    失敗しても None を返すだけで例外は出さない（記録失敗でworkerを止めない）。
    """
    try:
        resp = (
            _client()
            .table("worker_runs")
            .insert({
                "job_name":   job_name,
                "status":     "running",
                "started_at": datetime.now(timezone.utc).isoformat(),
            })
            .execute()
        )
        return resp.data[0]["id"]
    except Exception as e:
        print(f"[utils] start_worker_run エラー: {e}")
        return None


def finish_worker_run(
    run_id: str | None,
    status: str,                # 'success' | 'error'
    success_count: int = 0,
    skipped_count: int = 0,
    error_count:   int = 0,
    message:       str | None = None,
) -> None:
    """
    worker_runs の run_id 行を更新する。
    run_id が None（start失敗）の場合は何もしない。
    """
    if run_id is None:
        return
    try:
        _client().table("worker_runs").update({
            "status":        status,
            "success_count": success_count,
            "skipped_count": skipped_count,
            "error_count":   error_count,
            "message":       message,
            "finished_at":   datetime.now(timezone.utc).isoformat(),
        }).eq("id", run_id).execute()
    except Exception as e:
        print(f"[utils] finish_worker_run エラー: {e}")
