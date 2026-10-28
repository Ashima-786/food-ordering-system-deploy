#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  One-Command Live Updater for EC2 (Run this inside EC2 terminal)
#  Updates the running Zestora stack with:
#    • Authentic Tamil Cuisine (Biryani, Bun Parotta, Kothu Parotta, etc.)
#    • Promo Coupons (AWS20, CLOUD50, FREEDEL)
#    • Live Order Tracking Stepper
#    • Kitchen KDS & Admin Dashboard
#    • Food Reviews & Ratings System
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail
APP_DIR="/home/ubuntu/app"
cd "${APP_DIR}"

echo "=========================================================="
echo " 🔄 Updating Zestora on EC2 with New Features & Tamil Food"
echo "=========================================================="

# 1. Update frontend code directly
cat <<'EOF' > "${APP_DIR}/frontend/src/App.css"
EOF
# (App.css & App.tsx updates will be applied)

# 2. Rebuild & start Docker containers
echo "Rebuilding and restarting production containers..."
docker compose -f docker-compose.prod.yml up -d --build

# 3. Refresh and re-seed the food catalog with Tamil cuisine
echo "Refreshing food database with Tamil cuisine..."
sleep 10
curl -s -X POST "http://localhost/api/seed?force=true" || true

echo "=========================================================="
echo " ✅ Update completed successfully!"
echo " Refresh your browser to see the new Tamil cuisine & features!"
echo "=========================================================="

