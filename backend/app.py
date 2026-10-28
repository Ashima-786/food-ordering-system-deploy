"""
Zestora – Flask Backend
Online Food Ordering API backed by MongoDB
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient, ASCENDING
from bson import ObjectId
from datetime import datetime, timezone
import bcrypt
import jwt
import os
import logging

# ─── App & Config ────────────────────────────────────────────────────────────

app = Flask(__name__)

cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    allowed_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
else:
    allowed_origins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://frontend:3000", "*"]

CORS(app, origins=allowed_origins)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URI  = os.getenv("MONGO_URI", "mongodb://mongo:27017/zestora")
JWT_SECRET = os.getenv("JWT_SECRET", "zestora_super_secret_key_change_in_production")

client = MongoClient(MONGO_URI)
db     = client.get_database()

# Collections
users_col  = db["users"]
foods_col  = db["foods"]
orders_col = db["orders"]

# Indexes
users_col.create_index([("email", ASCENDING)], unique=True)
orders_col.create_index([("user_id", ASCENDING)])

# ─── Helpers ─────────────────────────────────────────────────────────────────

def serial(doc: dict) -> dict:
    """Convert MongoDB ObjectId to string."""
    doc["_id"] = str(doc["_id"])
    return doc


def decode_token(auth_header):
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, "Missing or invalid Authorization header"
    token = auth_header.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, "Token expired"
    except jwt.InvalidTokenError:
        return None, "Invalid token"


def require_auth():
    """Return (user_id, error_response) tuple."""
    payload, err = decode_token(request.headers.get("Authorization"))
    if err:
        return None, (jsonify({"error": err}), 401)
    return payload["sub"], None


# ─── Auth endpoints ───────────────────────────────────────────────────────────

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    name     = (data.get("name") or "").strip()
    email    = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not name or not email or not password:
        return jsonify({"error": "name, email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if users_col.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    user = {
        "name":       name,
        "email":      email,
        "password":   hashed,
        "created_at": datetime.now(timezone.utc),
    }
    result = users_col.insert_one(user)
    user_id = str(result.inserted_id)

    token = jwt.encode({"sub": user_id, "email": email}, JWT_SECRET, algorithm="HS256")
    return jsonify({"token": token, "user": {"id": user_id, "name": name, "email": email}}), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email    = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = users_col.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode(), user["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    user_id = str(user["_id"])
    token = jwt.encode({"sub": user_id, "email": email}, JWT_SECRET, algorithm="HS256")
    return jsonify({
        "token": token,
        "user": {"id": user_id, "name": user["name"], "email": email},
    }), 200


@app.route("/api/auth/me", methods=["GET"])
def me():
    user_id, err = require_auth()
    if err:
        return err
    user = users_col.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"id": user_id, "name": user["name"], "email": user["email"]}), 200


# ─── Food / Menu endpoints ───────────────────────────────────────────────────

@app.route("/api/foods", methods=["GET"])
def list_foods():
    category = request.args.get("category", "")
    query = {}
    if category and category.lower() != "all":
        query["category"] = category
    items = [serial(f) for f in foods_col.find(query)]
    return jsonify(items), 200


@app.route("/api/foods/<food_id>", methods=["GET"])
def get_food(food_id):
    try:
        food = foods_col.find_one({"_id": ObjectId(food_id)})
    except Exception:
        return jsonify({"error": "Invalid food id"}), 400
    if not food:
        return jsonify({"error": "Food not found"}), 404
    return jsonify(serial(food)), 200


@app.route("/api/foods", methods=["POST"])
def create_food():
    """Admin endpoint – no auth check for demo simplicity."""
    data = request.get_json(silent=True) or {}
    required = ["name", "category", "price"]
    if not all(k in data for k in required):
        return jsonify({"error": "Required fields: name, category, price"}), 400
    data.setdefault("rating", "4.5")
    data.setdefault("tag", "New")
    data.setdefault("description", "")
    data.setdefault("image", "")
    data.setdefault("color", "#e9f1df")
    result = foods_col.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify(data), 201


# ─── Cart endpoints ───────────────────────────────────────────────────────────

@app.route("/api/cart", methods=["GET"])
def get_cart():
    """Returns the current user's last active (pending) order as a cart."""
    user_id, err = require_auth()
    if err:
        return err
    order = orders_col.find_one({"user_id": user_id, "status": "pending"}, sort=[("created_at", -1)])
    if not order:
        return jsonify({"items": [], "total": 0}), 200
    return jsonify(serial(order)), 200


# ─── Order endpoints ──────────────────────────────────────────────────────────

@app.route("/api/orders", methods=["POST"])
def place_order():
    user_id, err = require_auth()
    if err:
        return err

    data  = request.get_json(silent=True) or {}
    items = data.get("items", [])
    address = data.get("address", "")

    if not items:
        return jsonify({"error": "Order must contain at least one item"}), 400

    enriched = []
    total = 0.0
    for item in items:
        food_id  = item.get("food_id") or item.get("_id")
        quantity = int(item.get("quantity", 1))
        name     = item.get("name", "Unknown")
        price    = float(item.get("price", 0))

        if food_id:
            try:
                db_food = foods_col.find_one({"_id": ObjectId(str(food_id))})
                if db_food:
                    name  = db_food["name"]
                    price = float(db_food["price"])
            except Exception:
                pass

        subtotal = price * quantity
        total   += subtotal
        enriched.append({
            "food_id":  str(food_id) if food_id else None,
            "name":     name,
            "price":    price,
            "quantity": quantity,
            "subtotal": subtotal,
        })

    order = {
        "user_id":    user_id,
        "items":      enriched,
        "total":      round(total, 2),
        "address":    address,
        "status":     "confirmed",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = orders_col.insert_one(order)
    order["_id"] = str(result.inserted_id)

    logger.info("Order placed: %s by user %s — Rs.%.2f", order["_id"], user_id, total)
    return jsonify(order), 201


@app.route("/api/orders", methods=["GET"])
def list_orders():
    user_id, err = require_auth()
    if err:
        return err
    orders = [serial(o) for o in orders_col.find(
        {"user_id": user_id},
        sort=[("created_at", -1)]
    )]
    return jsonify(orders), 200


@app.route("/api/orders/<order_id>", methods=["GET"])
def get_order(order_id):
    user_id, err = require_auth()
    if err:
        return err
    try:
        order = orders_col.find_one({"_id": ObjectId(order_id), "user_id": user_id})
    except Exception:
        return jsonify({"error": "Invalid order id"}), 400
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(serial(order)), 200


@app.route("/api/orders/<order_id>/cancel", methods=["PATCH"])
def cancel_order(order_id):
    user_id, err = require_auth()
    if err:
        return err
    try:
        res = orders_col.update_one(
            {"_id": ObjectId(order_id), "user_id": user_id, "status": "confirmed"},
            {"$set": {"status": "cancelled", "updated_at": datetime.now(timezone.utc)}},
        )
    except Exception:
        return jsonify({"error": "Invalid order id"}), 400
    if res.matched_count == 0:
        return jsonify({"error": "Order not found or cannot be cancelled"}), 404
    return jsonify({"message": "Order cancelled"}), 200


# ─── Health ───────────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    try:
        client.admin.command("ping")
        db_status = "ok"
    except Exception as exc:
        db_status = str(exc)
    return jsonify({"status": "ok", "db": db_status}), 200


# ─── Seed helper (development) ────────────────────────────────────────────────

@app.route("/api/seed", methods=["POST"])
def seed():
    """Seed the DB with sample food items -- call once after first launch."""
    if foods_col.count_documents({}) > 0:
        return jsonify({"message": "DB already seeded"}), 200

    sample_foods = [
        {
            "name": "Grilled Chicken with Veggies",
            "category": "Healthy",
            "price": 299,
            "image": "/images/grilled chicken.jpg",
            "description": "Grilled chicken with fresh garden vegetables",
            "rating": "4.8",
            "tag": "Bestseller",
            "color": "#e9f1df",
        },
        {
            "name": "Margherita Pizza",
            "category": "Italian",
            "price": 249,
            "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85",
            "description": "Classic tomato, mozzarella and basil",
            "rating": "4.7",
            "tag": "10% OFF",
            "color": "#fff0dc",
        },
        {
            "name": "Paneer Butter Masala",
            "category": "Indian",
            "price": 229,
            "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85",
            "description": "Creamy paneer curry with rich spices",
            "rating": "4.9",
            "tag": "Bestseller",
            "color": "#f8e9d7",
        },
        {
            "name": "Sushi Platter",
            "category": "Japanese",
            "price": 349,
            "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85",
            "description": "A delicious selection of fresh sushi",
            "rating": "4.6",
            "tag": "Chef pick",
            "color": "#f7e5e6",
        },
        {
            "name": "Chocolate Lava Cake",
            "category": "Desserts",
            "price": 149,
            "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85",
            "description": "Warm chocolate cake with a soft centre",
            "rating": "4.8",
            "tag": "Popular",
            "color": "#f1e8f4",
        },
        {
            "name": "Classic Zest Burger",
            "category": "Burgers",
            "price": 199,
            "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
            "description": "Crispy lettuce, cheese and signature sauce",
            "rating": "4.9",
            "tag": "Must try",
            "color": "#fff0df",
        },
    ]
    foods_col.insert_many(sample_foods)
    return jsonify({"message": "Seeded {} food items".format(len(sample_foods))}), 201


# ─── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
