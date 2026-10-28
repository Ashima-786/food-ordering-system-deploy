# 🍔 Zestora – Online Food Ordering System

A full-stack food ordering platform built with **React + TypeScript**, **Flask**, and **MongoDB**, containerised with **Docker** and **Docker Compose**, and deployed on a zero-cost single-instance **AWS EC2 architecture**.

🌐 **Live Production Deployment:** [http://54.234.169.116](http://54.234.169.116)

---

## ✨ Key Features

- **Authentic Tamil & South Indian Cuisine:** Ambur Chicken Dum Biryani, Madurai Bun Parotta & Salna, Chicken Kothu Parotta, Dindigul Mutton Biryani, Chettinad Pepper Chicken Fry, Ghee Podi Roast Dosa, and Kumbakonam Degree Filter Coffee.
- **Instant Live Search Dropdown:** Real-time dish matching across names, categories, descriptions, and tags with 1-click cart addition.
- **Promo Coupon System:** Dynamic promo code validation engine (`AWS20` for 20% off, `CLOUD50` for ₹50 off, `FREEDEL` for free delivery).
- **Real-Time 4-Step Order Tracking:** Live order stepper timeline (Confirmed ➔ Kitchen Preparing ➔ Out for Delivery ➔ Delivered) with simulated status advance.
- **Kitchen Display System (KDS):** Real-time admin kitchen dashboard displaying active orders, revenue metrics, and 1-click fulfillment toggles.
- **Customer Reviews & Ratings:** 1–5 star interactive review modal for all dishes.
- **Zero-Cost AWS EC2 Architecture:** Deployed strictly within AWS Free Tier on a single `t3.micro` instance with 2GB swap and a 10-day auto-destruction safety timer.
- **Automated Test Suite:** 12 automated unit and integration tests covering auth, catalog, orders, coupons, tracking, reviews, and admin APIs.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────┐
│           Docker Network (bridge)      │
│                                        │
│  ┌──────────────┐   ┌───────────────┐  │
│  │   Frontend   │   │    Backend    │  │
│  │  React/Nginx │──►│    Flask      │  │
│  │  port: 3000  │   │  port: 5000   │  │
│  └──────────────┘   └──────┬────────┘  │
│                            │           │
│                    ┌───────▼────────┐  │
│                    │    MongoDB     │  │
│                    │  port: 27017   │  │
│                    └────────────────┘  │
└────────────────────────────────────────┘
```

| Service    | Image / Build                 | Port |
|------------|-------------------------------|------|
| `frontend` | Build from `./frontend`       | 3000 |
| `backend`  | Build from `./backend`        | 5000 |
| `mongo`    | `mongo:7.0` (official image)  | —    |

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) (bundled with Docker Desktop)

### 1. Clone & configure

```bash
git clone https://github.com/VenuGopalops/online-food-ordering.git
cd online-food-ordering

# Copy and edit environment variables
cp .env.example .env
# Edit .env and set a strong JWT_SECRET
```

### 2. Build & start all services

```bash
docker compose up --build
```

First run takes ~3–5 minutes to pull images and build.

### 3. Seed the database

```bash
curl -X POST http://localhost:5000/api/seed
```

### 4. Open the app

| URL                              | Description         |
|----------------------------------|---------------------|
| http://localhost:3000            | React frontend      |
| http://localhost:5000/api/health | Backend health check|

---

## 🧪 Test an Order (curl)

### Register a user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
```

### Login and capture token
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}' | \
  python -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo "Token: $TOKEN"
```

### Browse foods
```bash
curl http://localhost:5000/api/foods
curl "http://localhost:5000/api/foods?category=Indian"
```

### Place an order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {"name":"Margherita Pizza","price":249,"quantity":2},
      {"name":"Paneer Butter Masala","price":229,"quantity":1}
    ],
    "address": "42, Baker Street, Mumbai"
  }'
```

### List my orders
```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 Project Structure

```
online-food-ordering/
├── backend/
│   ├── app.py              # Flask application (all API routes)
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Multi-stage Flask Docker image
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main app component
│   │   ├── App.css         # Styles
│   │   ├── main.tsx        # React entry point
│   │   └── pages/
│   │       ├── SignIn.tsx
│   │       ├── SignUp.tsx
│   │       └── SignIn.css
│   ├── Dockerfile          # Multi-stage React/Nginx image
│   ├── nginx.conf          # Nginx config with SPA + API proxy
│   ├── vite.config.ts
│   └── .dockerignore
│
├── database/
│   └── init-mongo.js       # MongoDB init script
│
├── docker-compose.yml      # Orchestrates all three services
├── .env.example            # Environment variable template
└── README.md
```

---

## 🔌 API Reference

### Authentication

| Method | Endpoint               | Auth | Description        |
|--------|------------------------|------|--------------------|
| POST   | `/api/auth/register`   | No   | Create account     |
| POST   | `/api/auth/login`      | No   | Login → JWT token  |
| GET    | `/api/auth/me`         | Yes  | Current user info  |

### Foods

| Method | Endpoint               | Auth | Description              |
|--------|------------------------|------|--------------------------|
| GET    | `/api/foods`           | No   | List all foods           |
| GET    | `/api/foods?category=` | No   | Filter by category       |
| GET    | `/api/foods/:id`       | No   | Get single food item     |
| POST   | `/api/foods`           | No   | Add food item (admin)    |

### Orders

| Method | Endpoint                    | Auth | Description        |
|--------|-----------------------------|------|--------------------|
| POST   | `/api/orders`               | Yes  | Place new order    |
| GET    | `/api/orders`               | Yes  | My order history   |
| GET    | `/api/orders/:id`           | Yes  | Order detail       |
| PATCH  | `/api/orders/:id/cancel`    | Yes  | Cancel an order    |

### Utility

| Method | Endpoint                    | Description                                  |
|--------|-----------------------------|----------------------------------------------|
| GET    | `/api/health`               | Service health check                         |
| POST   | `/api/seed?force=true`      | Seed DB with authentic Tamil & Indian foods  |

### Promo Coupons

| Method | Endpoint                | Description                                  |
|--------|-------------------------|----------------------------------------------|
| POST   | `/api/coupons/validate` | Validate promo codes (`AWS20`, `CLOUD50`, `FREEDEL`) |

### Live Order Tracking & Management

| Method | Endpoint                     | Description                                  |
|--------|------------------------------|----------------------------------------------|
| GET    | `/api/orders/:id/track`      | 4-step live order tracking timeline & ETA    |
| PATCH  | `/api/orders/:id/status`     | Advance order status (`preparing`, `delivered`) |

### Customer Reviews & Ratings

| Method | Endpoint                     | Description                                  |
|--------|------------------------------|----------------------------------------------|
| GET    | `/api/foods/:id/reviews`     | Get all customer reviews for a food item     |
| POST   | `/api/foods/:id/reviews`     | Submit a new review and 1–5 star rating      |

### Kitchen Display System (KDS / Admin)

| Method | Endpoint                     | Description                                  |
|--------|------------------------------|----------------------------------------------|
| GET    | `/api/admin/stats`           | Get total revenue, orders, and fulfillment   |
| GET    | `/api/admin/orders`          | List active kitchen orders for fulfillment   |

---

## 🐳 Individual Docker Builds

```bash
# Build Flask backend only
docker build -t zestora-backend ./backend

# Build React frontend only
docker build -t zestora-frontend ./frontend

# Run just MongoDB
docker run -d -p 27017:27017 --name mongo mongo:7.0
```

---

## 🔧 Development Mode (without Docker)

### Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
MONGO_URI=mongodb://localhost:27017/zestora python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

> API calls from `localhost:5173` are automatically proxied to `localhost:5000` via `vite.config.ts`.

---

## ⚙️ Useful Commands

```bash
# Start in detached mode
docker compose up -d --build

# View logs
docker compose logs -f
docker compose logs -f backend

# Stop everything
docker compose down

# Stop and remove volumes (wipes MongoDB data)
docker compose down -v

# Restart a single service
docker compose restart backend

# Open a shell in the backend container
docker compose exec backend sh

# Open MongoDB shell
docker compose exec mongo mongosh zestora
```

---

## ☁️ AWS EC2 & DevOps Architecture

The repository includes a complete production-grade DevOps setup for AWS EC2:

* **Direct Secure Deployment (`scripts/update-live-ec2.sh`)**: Direct, secure deployment over SSH without external runner dependencies.
* **Infrastructure as Code (`terraform/`)**: Automated provisioning of VPC, Subnet, Security Groups, IAM, S3 backup bucket, and EC2 with Elastic IP.
* **Production Docker Compose (`docker-compose.prod.yml`)**: Binds port 80/443 to Nginx edge proxy, enforces container CPU & memory limits, and configures Docker log rotation.
* **Automated S3 Backups (`scripts/backup-mongo-s3.sh`)**: Dumps MongoDB and uploads compressed archives directly to Amazon S3.
* **Auto-recovery on Reboot (`scripts/zestora.service`)**: Systemd unit to bring up the Docker Compose stack upon server start/reboot.

📖 **For full deployment instructions, see [DEPLOYMENT_EC2.md](file:///d:/Projects/AWS_Project/DEPLOYMENT_EC2.md)**.

---

## 🔒 Security Notes

- Change `JWT_SECRET` in `.env` before deploying to production
- MongoDB port is **not** exposed externally in the default config
- Use HTTPS (reverse proxy like Traefik/Nginx) in production
- Rotate secrets and use Docker secrets for sensitive values in production
