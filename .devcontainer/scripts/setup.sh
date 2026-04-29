#!/usr/bin/env bash
set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${BLUE}[setup]${NC} $1"; }
ok()   { echo -e "${GREEN}[ok]${NC} $1"; }
warn() { echo -e "${YELLOW}[warn]${NC} $1"; }

log "Starting setup..."

# ── Backend ─────────────────────────────────────────
cd /workspace/apps/api

if [ ! -d ".venv" ]; then
  log "Creating Python venv..."
  uv venv .venv
  source .venv/bin/activate
  uv pip install -r requirements.txt
  ok "Backend installed"
else
  ok "Backend already exists (skipped)"
fi

# ── Frontend ────────────────────────────────────────
cd /workspace/apps/web

if [ ! -d "node_modules" ]; then
  log "Installing frontend deps..."
  pnpm install
  ok "Frontend installed"
else
  ok "Frontend already exists (skipped)"
fi

# ── Root deps (Turborepo) ───────────────────────────
cd /workspace

if [ ! -d "node_modules" ]; then
  log "Installing monorepo deps..."
  pnpm install
  ok "Monorepo ready"
else
  ok "Monorepo already installed"
fi

# ── .env files ──────────────────────────────────────
log "Checking .env files..."

[ -f ".env" ] || cp .env.example .env 2>/dev/null || warn "Missing .env.example"
[ -f "apps/api/.env" ] || cp apps/api/.env.example apps/api/.env 2>/dev/null || true
[ -f "apps/web/.env.local" ] || cp apps/web/.env.local.example apps/web/.env.local 2>/dev/null || true

ok ".env checked"

# ── DB check ────────────────────────────────────────
log "Checking PostgreSQL..."

until pg_isready -h db -U postgres -d app 2>/dev/null; do
  sleep 1
done

ok "Postgres ready"

# ── Migraciones ─────────────
cd /workspace/apps/api

if [ -f "alembic.ini" ]; then
  log "Running migrations..."
  .venv/bin/python -m alembic upgrade head || warn "Migration issue"
  ok "Migrations done"
else
  warn "Alembic not configured"
fi

# ── Git hooks ───────────────────────────────────────
cd /workspace

if command -v pre-commit &>/dev/null; then
  pre-commit install
  ok "Git hooks ready"
else
  warn "pre-commit not installed"
fi

# ── Done ────────────────────────────────────────────
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Environment ready${NC}"

echo -e "  Frontend → http://localhost:3000"
echo -e "  Backend  → http://localhost:8000"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
