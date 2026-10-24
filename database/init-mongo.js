// MongoDB init script – runs once when the container is first created
// Creates the zestora database and a dedicated app user

db = db.getSiblingDB('zestora');

// Ensure collections exist
db.createCollection('users');
db.createCollection('foods');
db.createCollection('orders');

// Seed a default admin user (optional — remove in production)
// Password: admin123 (bcrypt hash)
print('Zestora MongoDB initialised successfully.');
