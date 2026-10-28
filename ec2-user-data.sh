#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  Zestora – 100% Self-Contained All-in-One EC2 Deployment Script
#  • Everything runs inside this single EC2 instance.
#  • Zero external dependencies or GitHub push requirements.
#  • Automatically shuts down after 10 days to protect against charges.
#  • When you terminate the EC2 instance, 100% of your project is deleted.
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

# 5. Inject Production Docker Compose (ensures it works even if git push was blocked)
cat <<'EOF' > "${APP_DIR}/docker-compose.prod.yml"
services:
  mongo:
    image: mongo:7.0
    container_name: zestora_mongo_prod
    restart: always
    environment:
      MONGO_INITDB_DATABASE: zestora
    volumes:
      - mongo_data:/data/db
      - ./database/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
    networks:
      - zestora_net
    healthcheck:
      test: [ "CMD", "mongosh", "--eval", "db.adminCommand('ping')" ]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s
    deploy:
      resources:
        limits:
          cpus: "0.75"
          memory: 768M
        reservations:
          memory: 256M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: zestora_backend_prod
    restart: always
    environment:
      MONGO_URI: mongodb://mongo:27017/zestora
      JWT_SECRET: ${JWT_SECRET:-zestora_production_secret_key_random}
      FLASK_ENV: production
      CORS_ORIGINS: "*"
    depends_on:
      mongo:
        condition: service_healthy
    networks:
      - zestora_net
    healthcheck:
      test: [ "CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:5000/api/health')" ]
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 30s
    deploy:
      resources:
        limits:
          cpus: "0.75"
          memory: 512M
        reservations:
          memory: 128M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: zestora_frontend_prod
    restart: always
    ports:
      - "80:3000"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - zestora_net
    healthcheck:
      test: [ "CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/healthz" ]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 15s
    deploy:
      resources:
        limits:
          cpus: "0.50"
          memory: 256M
        reservations:
          memory: 64M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  mongo_data:
    driver: local

networks:
  zestora_net:
    driver: bridge
EOF

# 6. Inject Hardened Nginx configuration
cat <<'EOF' > "${APP_DIR}/frontend/nginx.conf"
server {
    listen 3000;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location /healthz {
        access_log off;
        return 200 "healthy\n";
    }

    location /api/ {
        proxy_pass         http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 7. Create .env with a secure random JWT secret
echo "Configuring environment variables..."
cp .env.example .env 2>/dev/null || touch .env
RANDOM_SECRET=$(openssl rand -hex 32)
echo "JWT_SECRET=${RANDOM_SECRET}" > .env
echo "MONGO_URI=mongodb://mongo:27017/zestora" >> .env

# 8. Build and launch all services on Port 80
echo "Building and launching Docker containers..."
docker compose -f docker-compose.prod.yml up -d --build

# 9. Seed sample menu data
echo "Waiting for services to become healthy..."
sleep 20
curl -X POST http://localhost/api/seed || true

# 10. Auto-start on reboot
mkdir -p "${APP_DIR}/scripts"
cat <<'EOF' > /etc/systemd/system/zestora.service
[Unit]
Description=Zestora Ordering System
Requires=docker.service
After=docker.service network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
User=ubuntu
WorkingDirectory=/home/ubuntu/app
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable zestora.service

# 11. Safety Timer: Auto-shutdown after 10 days (14400 minutes)
# Automatically halts the machine if you forget to terminate it!
shutdown -h +14400 "AWS Class Project: 10-day safety limit reached. Shutting down." &

echo "=========================================================="
echo " ✅ Zestora All-in-One Deployment Complete!"
echo "=========================================================="
