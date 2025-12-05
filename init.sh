#!/bin/bash
# init.sh - Run at start of every Claude session
#
# This script ensures the environment is ready for development.
# Run this FIRST before any other work.

set -e

echo ""
echo "========================================"
echo "  INITIALIZING PROJECT ENVIRONMENT"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verify we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}ERROR: Not in project root! package.json not found.${NC}"
  echo "Please cd to the project directory first."
  exit 1
fi

PROJECT_NAME=$(node -p "require('./package.json').name")
echo -e "Project: ${GREEN}${PROJECT_NAME}${NC}"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v)
echo -e "Node.js: ${GREEN}${NODE_VERSION}${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
else
  echo -e "Dependencies: ${GREEN}Installed${NC}"
fi

# Check environment file
if [ ! -f ".env" ] && [ ! -f ".env.local" ]; then
  echo -e "${RED}WARNING: No .env or .env.local file found!${NC}"
  echo "Copy .env.example and configure API keys."
else
  echo -e "Environment: ${GREEN}Configured${NC}"
fi

# Load environment variables
if [ -f ".env.local" ]; then
  export $(grep -v '^#' .env.local | xargs)
elif [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check CRM connection
echo ""
echo "Checking integrations..."

if [ -n "$TWENTY_CRM_API_URL" ] && [ -n "$TWENTY_API_KEY" ]; then
  CRM_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $TWENTY_API_KEY" \
    "${TWENTY_CRM_API_URL}/people?limit=1" 2>/dev/null || echo "000")

  if [ "$CRM_STATUS" = "200" ]; then
    echo -e "  CRM: ${GREEN}Connected${NC}"
  else
    echo -e "  CRM: ${RED}Failed (HTTP $CRM_STATUS)${NC}"
  fi
else
  echo -e "  CRM: ${YELLOW}Not configured${NC}"
fi

# Check Resend (email)
if [ -n "$RESEND_API_KEY" ]; then
  echo -e "  Email: ${GREEN}Configured${NC}"
else
  echo -e "  Email: ${YELLOW}Not configured${NC}"
fi

# Git status summary
echo ""
echo "Git Status:"
BRANCH=$(git branch --show-current)
echo -e "  Branch: ${GREEN}${BRANCH}${NC}"

UNCOMMITTED=$(git status --porcelain | wc -l | tr -d ' ')
if [ "$UNCOMMITTED" -gt 0 ]; then
  echo -e "  Uncommitted changes: ${YELLOW}${UNCOMMITTED} files${NC}"
else
  echo -e "  Working tree: ${GREEN}Clean${NC}"
fi

# Show recent commits
echo ""
echo "Recent commits:"
git log --oneline -5 | while read line; do
  echo "  $line"
done

# Check for progress file
echo ""
if [ -f "claude-progress.md" ]; then
  echo -e "Progress file: ${GREEN}Found${NC}"
  echo ""
  echo "--- Current Status (from claude-progress.md) ---"
  head -30 claude-progress.md
  echo "..."
  echo "-------------------------------------------------"
else
  echo -e "Progress file: ${YELLOW}Not found${NC}"
  echo "Consider creating claude-progress.md to track session progress."
fi

# Start dev server option
echo ""
echo "========================================"
echo -e "${GREEN}  ENVIRONMENT READY${NC}"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Read claude-progress.md for current status"
echo "  2. Run 'npm run dev' to start dev server"
echo "  3. Select ONE task to work on this session"
echo "  4. Update claude-progress.md when done"
echo ""
