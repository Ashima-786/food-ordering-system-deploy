#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  Zero-Downtime Deployment Script for EC2
#  Usage: ./scripts/deploy.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/app}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

echo "======================================================"
echo " Starting Zestora Deployment on EC2"
echo " Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo " Working Directory: ${APP_DIR}"
echo "======================================================"

cd "${APP_DIR}"

# 1. Verify .env file exists
if [ ! -f .env ]; then
    echo "ERROR: .env file missing in ${APP_DIR}!"
    echo "Please copy .env.example to .env and configure JWT_SECRET."
    exit 1
fi

# 2. Pull latest container images (if using registry) or build locally
echo "Pulling / building latest container images..."
docker compose -f "${COMPOSE_FILE}" pull --ignore-pull-failures || true
docker compose -f "${COMPOSE_FILE}" build

# 3. Start or update containers
echo "Starting containers..."
docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans

# 4. Wait for services to become healthy
echo "Waiting for health checks to pass..."
MAX_RETRIES=20
COUNT=0
HEALTHY=false

while [ $COUNT -lt $MAX_RETRIES ]; do
    COUNT=$((COUNT + 1))
    echo "Health check attempt ${COUNT}/${MAX_RETRIES}..."

    # Check backend health
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health || true)

    if [ "${HTTP_STATUS}" = "200" ]; then
        echo "✅ Backend and Database are healthy (HTTP 200)!"
        HEALTHY=true
        break
    fi

    sleep 3
done

if [ "${HEALTHY}" = "false" ]; then
    echo "❌ Deployment health check timed out. Dumping container logs:"
    docker compose -f "${COMPOSE_FILE}" logs --tail 50
    exit 1
fi

# 5. Clean up dangling images and old build cache
echo "Cleaning up dangling images..."
docker image prune -f

echo "======================================================"
echo " ✅ Deployment completed successfully!"
echo " Containers running:"
docker compose -f "${COMPOSE_FILE}" ps
echo "======================================================"

