#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  EC2 Bootstrap & Initialization Script (Ubuntu 22.04 / 24.04 LTS)
#  Automates:
#    1. 2GB Swap setup (critical for MongoDB on t2/t3 instances)
#    2. Docker Engine & Docker Compose v2 installation
#    3. Docker log rotation policy (prevents 100% disk filling)
#    4. AWS CLI v2, jq, and Git installation
#    5. Project directory & permissions setup
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

echo "======================================================"
echo " Starting EC2 Instance Provisioning for Zestora..."
echo "======================================================"

# 1. Update and install base packages
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    jq \
    unzip

# 2. Configure 2GB Swapfile (prevents MongoDB OOM kills on t2.micro/t3.small)
if ! swapon --show | grep -q "/swapfile"; then
    echo "Creating 2GB swapfile..."
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
    echo "vm.swappiness=10" >> /etc/sysctl.conf
    sysctl vm.swappiness=10
    echo "Swapfile successfully created and activated."
else
    echo "Swapfile already exists."
fi

# 3. Install Docker official repository and engine
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Enable and start Docker
    systemctl enable docker
    systemctl start docker
    echo "Docker installed successfully."
fi

# 4. Configure Docker daemon log rotation (max 10MB x 3 files per container)
echo "Configuring Docker daemon log limits..."
cat <<'EOF' > /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
systemctl restart docker

# 5. Add default ubuntu user to docker group
if id "ubuntu" &>/dev/null; then
    usermod -aG docker ubuntu
fi

# 6. Install AWS CLI v2 (for S3 backups & ECR auth)
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI v2..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip -q awscliv2.zip
    ./aws/install
    rm -rf aws awscliv2.zip
    echo "AWS CLI v2 installed successfully."
fi

# 7. Create app directory structure
APP_DIR="/home/ubuntu/app"
mkdir -p "${APP_DIR}"
chown -R ubuntu:ubuntu "${APP_DIR}"

# 8. Failsafe auto-shutdown in 10 days (14400 minutes = 10 days * 24 hours * 60 mins)
# Guarantees the EC2 instance stops automatically even if you forget to terminate it
echo "Setting 10-day failsafe shutdown timer..."
shutdown -h +14400 "AWS Class Project: 10-day safety limit reached. Shutting down." &

echo "======================================================"
echo " EC2 Bootstrap Complete!"
echo " Docker: $(docker --version)"
echo " Compose: $(docker compose version)"
echo " AWS CLI: $(aws --version)"
echo " Swap: $(free -h | grep -i swap)"
echo " 10-Day Auto-Shutdown: Scheduled (+14400 minutes)"
echo "======================================================"

