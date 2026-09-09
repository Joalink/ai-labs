#!/usr/bin/env bash
set -e

# FastAPI
cd /workspace/apps/api
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &

# Next.js
cd /workspace/apps/web
pnpm dev --hostname 0.0.0.0 &

wait
