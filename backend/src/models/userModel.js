// backend/src/models/userModel.js
const db = require('../config/db');

async function createUser({ email, passwordHash, role = 'user' }) {
  const result = await db.query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, $3)
     RETURNING id, email, role, created_at`,
    [email, passwordHash, role]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await db.query(
    `SELECT id, email, password_hash, role, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await db.query(
    `SELECT id, email, role, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
