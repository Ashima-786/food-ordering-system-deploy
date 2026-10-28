#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  Zestora – 100% All-in-One EC2 Deployment Script
#  Everything runs inside this single EC2 instance.
#  When you terminate the EC2 instance, 100% of your project is deleted.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail
exec > >(tee -a /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "=========================================================="
echo " 🍔 Starting All-In-One EC2 Deployment for Zestora..."
echo "=========================================================="

# 1. Setup 2GB Swap (allows MongoDB to run on Free Tier t2.micro)
if ! swapon --show | grep -q "/swapfile"; then
    echo "Creating 2GB swapfile..."
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
fi

# 2. Install Git and Docker Engine
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl gnupg git

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

systemctl enable docker
systemctl start docker
usermod -aG docker ubuntu || true

# 3. Configure Docker log limit (prevents disk filling)
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

# 4. Clone repository into /home/ubuntu/app
APP_DIR="/home/ubuntu/app"
mkdir -p "${APP_DIR}"
cd "${APP_DIR}"

echo "Cloning repository..."
git clone https://github.com/VenuGopalops/online-food-ordering.git .
git checkout project || git checkout main || true

# 5. Create .env with a secure random JWT secret
echo "Configuring environment variables..."
cp .env.example .env
RANDOM_SECRET=$(openssl rand -hex 32)
sed -i "s|zestora_change_me_in_production_please|${RANDOM_SECRET}|g" .env

# 6. Build and launch all services on Port 80
echo "Building and launching Docker containers..."
docker compose -f docker-compose.prod.yml up -d --build

# 7. Seed sample menu data
echo "Waiting for services to become healthy..."
sleep 15
curl -X POST http://localhost/api/seed || true

# 8. Configure auto-start on reboot
cp scripts/zestora.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable zestora.service

# 9. Safety Timer: Auto-shutdown after 10 days (14400 minutes)
# Automatically halts the machine if you forget to terminate it!
shutdown -h +14400 "AWS Class Project: 10-day safety limit reached. Shutting down." &

echo "=========================================================="
echo " ✅ Zestora All-in-One Deployment Complete!"
echo " Access the app at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo 'YOUR_EC2_IP')"
echo "=========================================================="

