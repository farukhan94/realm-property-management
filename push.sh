#!/usr/bin/env bash
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}→${NC} $*"; }
success() { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}!${NC} $*"; }
error() { echo -e "${RED}✗${NC} $*" >&2; }

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  error "Not inside a git repository."
  exit 1
fi

BRANCH="$(git branch --show-current)"
if [[ -z "$BRANCH" ]]; then
  error "Could not determine current branch."
  exit 1
fi

REMOTE="origin"
REMOTE_URL="$(git remote get-url "$REMOTE" 2>/dev/null || true)"
if [[ -z "$REMOTE_URL" ]]; then
  error "Remote '$REMOTE' is not configured."
  exit 1
fi

echo ""
info "Repository: $(basename "$(git rev-parse --show-toplevel)")"
info "Branch:     $BRANCH"
info "Remote:     $REMOTE ($REMOTE_URL)"
echo ""

if git diff --quiet && git diff --cached --quiet && [[ -z "$(git ls-files --others --exclude-standard)" ]]; then
  warn "No changes to commit."
  read -r -p "Push anyway? [y/N] " push_anyway
  if [[ ! "$push_anyway" =~ ^[Yy]$ ]]; then
    info "Aborted."
    exit 0
  fi
  info "Pushing to $REMOTE/$BRANCH..."
  git push "$REMOTE" "$BRANCH"
  success "Pushed to $REMOTE/$BRANCH"
  exit 0
fi

echo -e "${YELLOW}Current changes:${NC}"
git status --short
echo ""

read -r -p "Stage all changes? [Y/n] " stage_confirm
stage_confirm="${stage_confirm:-Y}"
if [[ ! "$stage_confirm" =~ ^[Yy]$ ]]; then
  info "Aborted."
  exit 0
fi

read -r -p "Commit message: " commit_message
if [[ -z "$commit_message" ]]; then
  commit_message="Update $(date '+%Y-%m-%d %H:%M')"
  warn "Using default commit message: $commit_message"
fi

info "Staging changes..."
git add -A

if git diff --cached --quiet; then
  warn "Nothing staged after git add."
  exit 0
fi

info "Committing..."
git commit -m "$commit_message"
success "Committed on $BRANCH"

info "Pushing to $REMOTE/$BRANCH..."
git push "$REMOTE" "$BRANCH"
success "Pushed to $REMOTE/$BRANCH"
