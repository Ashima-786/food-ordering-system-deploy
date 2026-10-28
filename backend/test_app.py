"""
Unit and Integration Tests for Zestora Backend API
Tests auth, food catalog, order creation, order cancellation, and health check.
"""

import unittest
import json
from bson import ObjectId
from app import app, users_col, foods_col, orders_col, JWT_SECRET, serial, decode_token
import jwt


class ZestoraTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()
        self.test_email = f"test_{ObjectId()}@example.com"
        self.test_password = "password123"
        self.test_name = "Test User"

    def tearDown(self):
        # Clean up test user and orders created during tests
        users_col.delete_many({"email": self.test_email})
        # Clean up any order with test user
        orders_col.delete_many({"address": "Unit Test Address"})

    # ─── UNIT TESTS ─────────────────────────────────────────────────────────────

    def test_unit_serial_object_id(self):
        """Test MongoDB ObjectId serialization."""
        oid = ObjectId()
        doc = {"_id": oid, "name": "Pizza"}
        serialized = serial(doc)
        self.assertIsInstance(serialized["_id"], str)
        self.assertEqual(serialized["_id"], str(oid))

    def test_unit_token_decode_valid(self):
        """Test valid JWT token decoding."""
        token = jwt.encode({"sub": "user123", "email": "a@b.com"}, JWT_SECRET, algorithm="HS256")
        payload, err = decode_token(f"Bearer {token}")
        self.assertIsNone(err)
        self.assertEqual(payload["sub"], "user123")
        self.assertEqual(payload["email"], "a@b.com")

    def test_unit_token_decode_invalid(self):
        """Test invalid JWT token rejection."""
        payload, err = decode_token("Bearer invalid.token.value")
        self.assertIsNone(payload)
        self.assertIn("Invalid token", err)

    def test_unit_token_decode_missing_header(self):
        """Test missing Authorization header."""
        payload, err = decode_token(None)
        self.assertIsNone(payload)
        self.assertIn("Missing", err)

    # ─── INTEGRATION TESTS: HEALTH & SEED ───────────────────────────────────────

    def test_integration_health_check(self):
        """Test GET /api/health returns 200 and db ok."""
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data.get("status"), "ok")
        self.assertEqual(data.get("db"), "ok")

    def test_integration_foods_list(self):
        """Test GET /api/foods returns food items list."""
        res = self.client.get("/api/foods")
        self.assertEqual(res.status_code, 200)
        items = res.get_json()
        self.assertIsInstance(items, list)

    # ─── INTEGRATION TESTS: AUTH ────────────────────────────────────────────────

    def test_integration_auth_register_and_login(self):
        """Test complete auth lifecycle: register -> login -> /api/auth/me."""
        # 1. Register
        reg_res = self.client.post("/api/auth/register", json={
            "name": self.test_name,
            "email": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(reg_res.status_code, 201)
        reg_data = reg_res.get_json()
        self.assertIn("token", reg_data)
        token = reg_data["token"]

        # 2. Duplicate registration should return 409
        dup_res = self.client.post("/api/auth/register", json={
            "name": self.test_name,
            "email": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(dup_res.status_code, 409)

        # 3. Login
        login_res = self.client.post("/api/auth/login", json={
            "email": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(login_res.status_code, 200)
        login_data = login_res.get_json()
        self.assertIn("token", login_data)

        # 4. Login with wrong password should return 401
        bad_login = self.client.post("/api/auth/login", json={
            "email": self.test_email,
            "password": "wrongpassword"
        })
        self.assertEqual(bad_login.status_code, 401)

        # 5. Get Profile with Bearer token
        me_res = self.client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(me_res.get_json()["email"], self.test_email)

    # ─── INTEGRATION TESTS: ORDERS ──────────────────────────────────────────────

    def test_integration_place_and_list_order(self):
        """Test full user order workflow: register -> order food -> list orders -> cancel."""
        # Register user
        reg_res = self.client.post("/api/auth/register", json={
            "name": self.test_name,
            "email": self.test_email,
            "password": self.test_password
        })
        token = reg_res.get_json()["token"]

        # 1. Try placing order without items (should fail)
        bad_order = self.client.post("/api/orders", json={
            "items": [],
            "address": "Unit Test Address"
        }, headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(bad_order.status_code, 400)

        # 2. Place valid order
        order_payload = {
            "items": [
                {"name": "Margherita Pizza", "price": 249, "quantity": 2},
                {"name": "Classic Zest Burger", "price": 199, "quantity": 1}
            ],
            "address": "Unit Test Address"
        }
        order_res = self.client.post("/api/orders", json=order_payload, headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(order_res.status_code, 201)
        order_data = order_res.get_json()
        self.assertIn("_id", order_data)
        self.assertEqual(order_data["status"], "confirmed")
        self.assertEqual(order_data["total"], 249 * 2 + 199)
        order_id = order_data["_id"]

        # 3. Retrieve user orders
        list_res = self.client.get("/api/orders", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(list_res.status_code, 200)
        user_orders = list_res.get_json()
        self.assertGreaterEqual(len(user_orders), 1)
        self.assertEqual(user_orders[0]["_id"], order_id)

        # 4. Get specific order by ID
        get_res = self.client.get(f"/api/orders/{order_id}", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(get_res.status_code, 200)
        self.assertEqual(get_res.get_json()["_id"], order_id)

        # 5. Cancel order
        cancel_res = self.client.patch(f"/api/orders/{order_id}/cancel", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(cancel_res.status_code, 200)
        self.assertEqual(cancel_res.get_json()["message"], "Order cancelled")

        # Verify status is now cancelled
        verify_res = self.client.get(f"/api/orders/{order_id}", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(verify_res.get_json()["status"], "cancelled")

    def test_integration_coupon_validation(self):
        """Test coupon validation API endpoint."""
        res = self.client.post("/api/coupons/validate", json={"code": "AWS20", "subtotal": 500})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["valid"])
        self.assertEqual(data["discount"], 100.0)

        # Invalid coupon
        bad_res = self.client.post("/api/coupons/validate", json={"code": "INVALID_CODE", "subtotal": 500})
        self.assertEqual(bad_res.status_code, 400)

    def test_integration_admin_stats(self):
        """Test admin dashboard statistics."""
        res = self.client.get("/api/admin/stats")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("total_revenue", data)
        self.assertIn("total_orders", data)

    def test_integration_order_tracking_and_status(self):
        """Test real-time order tracking and status advance."""
        # 1. Place order
        reg_res = self.client.post("/api/auth/register", json={
            "name": self.test_name,
            "email": self.test_email,
            "password": self.test_password
        })
        token = reg_res.get_json()["token"]
        order_res = self.client.post("/api/orders", json={
            "items": [{"name": "Ambur Chicken Dum Biryani", "price": 279, "quantity": 1}],
            "address": "Unit Test Address"
        }, headers={"Authorization": f"Bearer {token}"})
        order_id = order_res.get_json()["_id"]

        # 2. Track order
        track_res = self.client.get(f"/api/orders/{order_id}/track")
        self.assertEqual(track_res.status_code, 200)
        track_data = track_res.get_json()
        self.assertEqual(track_data["status"], "confirmed")
        self.assertIn("steps", track_data)

        # 3. Update status to preparing
        patch_res = self.client.patch(f"/api/orders/{order_id}/status", json={"status": "preparing"})
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.get_json()["status"], "preparing")

    def test_integration_food_reviews(self):
        """Test customer food ratings and reviews."""
        # Post review
        review_res = self.client.post("/api/foods/1/reviews", json={
            "user_name": "Arun Kumar",
            "rating": 5,
            "comment": "Authentic taste of Ambur biryani!"
        })
        self.assertEqual(review_res.status_code, 201)

        # Fetch reviews
        get_res = self.client.get("/api/foods/1/reviews")
        self.assertEqual(get_res.status_code, 200)
        reviews = get_res.get_json()
        self.assertGreaterEqual(len(reviews), 1)
        self.assertEqual(reviews[0]["user_name"], "Arun Kumar")


if __name__ == "__main__":
    unittest.main()
