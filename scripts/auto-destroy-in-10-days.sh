#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  Auto-destroy AWS resources after 10 days (Linux / macOS)
#  Usage: ./scripts/auto-destroy-in-10-days.sh [number_of_days]
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

DAYS="${1:-10}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
TERRAFORM_DIR="${PROJECT_DIR}/terraform"

echo "=========================================================="
echo " ⏰ AWS AUTO-DESTRUCTION SCHEDULER (Linux/macOS)"
echo " Project Directory: ${PROJECT_DIR}"
echo " Teardown in      : ${DAYS} days"
echo "=========================================================="

# Check if 'at' daemon is available, otherwise use cron
if command -v at &> /dev/null; then
    echo "cd '${TERRAFORM_DIR}' && terraform destroy -auto-approve >> '${PROJECT_DIR}/teardown.log' 2>&1" | at now + "${DAYS}" days
    echo "✅ Scheduled via 'at' command for ${DAYS} days from now."
else
    # Fallback to crontab calculation
    TARGET_DATE=$(date -d "+${DAYS} days" +"%M %H %d %m *")
    (crontab -l 2>/dev/null || true; echo "${TARGET_DATE} cd '${TERRAFORM_DIR}' && terraform destroy -auto-approve >> '${PROJECT_DIR}/teardown.log' 2>&1") | crontab -
    echo "✅ Scheduled via crontab for ${DAYS} days from now."
fi

echo "To destroy everything manually right now:"
echo "  cd terraform && terraform destroy -auto-approve"
echo "=========================================================="

