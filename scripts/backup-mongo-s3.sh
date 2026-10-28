#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  Automated MongoDB to AWS S3 Backup Script
#  Usage:
#    ./scripts/backup-mongo-s3.sh <S3_BUCKET_NAME>
#  Example:
#    ./scripts/backup-mongo-s3.sh my-zestora-backups-bucket
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

S3_BUCKET="${1:-${S3_BACKUP_BUCKET:-}}"

if [ -z "${S3_BUCKET}" ]; then
    echo "Usage: $0 <s3-bucket-name>"
    echo "Or export S3_BACKUP_BUCKET=<s3-bucket-name>"
    exit 1
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/zestora_backups"
ARCHIVE_NAME="zestora_db_${TIMESTAMP}.gz"
ARCHIVE_PATH="${BACKUP_DIR}/${ARCHIVE_NAME}"
CONTAINER_NAME="zestora_mongo_prod"

mkdir -p "${BACKUP_DIR}"

echo "Starting MongoDB backup for database 'zestora'..."

# Execute mongodump inside the container and stream to compressed archive
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker exec "${CONTAINER_NAME}" mongodump --db zestora --archive --gzip > "${ARCHIVE_PATH}"
else
    echo "ERROR: Container ${CONTAINER_NAME} is not running!"
    exit 1
fi

FILE_SIZE=$(du -h "${ARCHIVE_PATH}" | cut -f1)
echo "Backup archive created: ${ARCHIVE_NAME} (${FILE_SIZE})"

# Upload to Amazon S3
echo "Uploading backup to s3://${S3_BUCKET}/backups/${ARCHIVE_NAME}..."
aws s3 cp "${ARCHIVE_PATH}" "s3://${S3_BUCKET}/backups/${ARCHIVE_NAME}"

# Clean up local archive
rm -f "${ARCHIVE_PATH}"
echo "Local temporary archive cleaned up."

# Remove S3 backups older than 30 days (optional safety cleanup)
echo "Backup successfully uploaded to S3!"

