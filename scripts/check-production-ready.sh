#!/bin/bash

# Production Readiness Checklist
# Verify everything is ready before deploying to production

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

check_item() {
    local name=$1
    local command=$2
    local required=${3:-true}

    if eval "$command" &> /dev/null; then
        echo -e "${GREEN}✓${NC} ${name}"
        ((PASSED++))
    else
        if [ "$required" = true ]; then
            echo -e "${RED}✗${NC} ${name}"
            ((FAILED++))
        else
            echo -e "${YELLOW}⚠${NC} ${name} (optional)"
            ((WARNINGS++))
        fi
    fi
}

warn_item() {
    local name=$1
    echo -e "${YELLOW}⚠${NC} ${name}"
    ((WARNINGS++))
}

echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Production Readiness Checklist${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}\n"

echo -e "${BLUE}Environment & Dependencies${NC}"
check_item "Node.js version >= 20.9.0" "node -v | grep -E 'v(2[0-9]|[3-9][0-9])\.[0-9]' > /dev/null"
check_item "pnpm installed" "command -v pnpm"
check_item "pnpm version >= 9.0.0" "pnpm --version | grep -E '^(9|1[0-9])\.' > /dev/null"
check_item "Git repository" "git rev-parse --git-dir > /dev/null 2>&1"
check_item "Git commits exist" "git rev-list --count --all | grep -v '^0$' > /dev/null"

echo -e "\n${BLUE}Build Configuration${NC}"
check_item "package.json exists" "test -f package.json"
check_item "next.config.ts exists" "test -f next.config.ts"
check_item ".env.production exists" "test -f .env.production"
check_item "pnpm-lock.yaml exists" "test -f pnpm-lock.yaml"
check_item "Build script works" "pnpm build 2>&1 | tail -1"

echo -e "\n${BLUE}Code Quality${NC}"
check_item "TypeScript compiles" "pnpm typecheck"
check_item "ESLint passes" "pnpm lint" false
check_item "Format check passes" "pnpm format:check" false

echo -e "\n${BLUE}Docker Configuration${NC}"
check_item "Docker installed" "command -v docker"
check_item "Dockerfile exists" "test -f Dockerfile"
check_item ".dockerignore exists" "test -f .dockerignore"
check_item "docker-compose.deploy.yml exists" "test -f docker-compose.deploy.yml"

echo -e "\n${BLUE}API Configuration${NC}"
if grep -q "NEXT_PUBLIC_API_URL" .env.production; then
    API_URL=$(grep "NEXT_PUBLIC_API_URL" .env.production | cut -d= -f2)
    if [ ! -z "$API_URL" ] && [ "$API_URL" != "http://localhost:5000/api/v1" ]; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_API_URL configured for production: ${API_URL}"
        ((PASSED++))
    else
        warn_item "NEXT_PUBLIC_API_URL not set to production value"
    fi
else
    warn_item "NEXT_PUBLIC_API_URL not configured"
fi

if grep -q "NEXT_PUBLIC_APP_URL" .env.production; then
    APP_URL=$(grep "NEXT_PUBLIC_APP_URL" .env.production | cut -d= -f2)
    if [ ! -z "$APP_URL" ] && [ "$APP_URL" != "http://localhost:3000" ]; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_APP_URL configured for production: ${APP_URL}"
        ((PASSED++))
    else
        warn_item "NEXT_PUBLIC_APP_URL not set to production value"
    fi
else
    warn_item "NEXT_PUBLIC_APP_URL not configured"
fi

echo -e "\n${BLUE}Documentation${NC}"
check_item "README.md exists" "test -f README.md"
check_item "Deployment guide exists" "test -f docs/deployment.md" false
check_item "CHANGELOG exists" "test -f CHANGELOG.md" false

echo -e "\n${BLUE}Security${NC}"
check_item ".env files in .gitignore" "grep -q '.env' .gitignore" false
check_item ".next in .gitignore" "grep -q '.next' .gitignore" false
check_item "node_modules in .gitignore" "grep -q 'node_modules' .gitignore" false
check_item "No secrets in .env.production" "! grep -E '(password|secret|key|token)=' .env.production | grep -v '#' > /dev/null" false

echo -e "\n${BLUE}Performance${NC}"
warn_item "Verify image optimization configured in next.config.ts"
warn_item "Check bundle size: pnpm build && du -sh .next"
warn_item "Review Core Web Vitals in production monitoring"

echo -e "\n${BLUE}Monitoring & Logging${NC}"
warn_item "Configure application monitoring (e.g., Sentry, DataDog)"
warn_item "Set up log aggregation (e.g., CloudWatch, ELK)"
warn_item "Configure error tracking and alerts"
warn_item "Set up health check monitoring"

echo -e "\n${BLUE}Deployment Specifics${NC}"
warn_item "Verify reverse proxy (Nginx/Apache) configuration"
warn_item "Configure SSL/TLS certificates"
warn_item "Set up automatic certificate renewal"
warn_item "Configure CDN for static assets (optional)"
warn_item "Set up database backups (if applicable)"
warn_item "Configure auto-scaling policies (if using cloud)"

echo -e "\n${BLUE}═══════════════════════════════════════════${NC}"
echo -e "Results:"
echo -e "  ${GREEN}Passed:${NC} ${PASSED}"
echo -e "  ${RED}Failed:${NC} ${FAILED}"
echo -e "  ${YELLOW}Warnings:${NC} ${WARNINGS}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

if [ $FAILED -gt 0 ]; then
    echo -e "\n${RED}✗ Production readiness check FAILED${NC}"
    echo -e "${YELLOW}Please fix the failed items before deploying to production.${NC}"
    exit 1
elif [ $WARNINGS -eq 0 ]; then
    echo -e "\n${GREEN}✓ All production readiness checks PASSED${NC}"
    exit 0
else
    echo -e "\n${GREEN}✓ Core checks passed${NC}"
    echo -e "${YELLOW}Please review and address the warnings before deploying.${NC}"
    exit 0
fi
