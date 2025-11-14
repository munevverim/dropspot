// backend/src/models/waitlistModel.js
const db = require('../config/db');

async function joinWaitlist(userId, dropId) {
  const result = await db.query(
    `INSERT INTO waitlist_entries (user_id, drop_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, drop_id) DO NOTHING
     RETURNING *`,
    [userId, dropId]
  );
  // idempotent: varsa row dönmez ama biz yine "joined: true" diyebiliriz
  return result.rows[0] || null;
}

async function leaveWaitlist(userId, dropId) {
  const result = await db.query(
    `DELETE FROM waitlist_entries
     WHERE user_id = $1 AND drop_id = $2`,
    [userId, dropId]
  );
  // idempotent: satır silinmese de hata dönmüyoruz
  return result.rowCount > 0;
}

async function isUserInWaitlist(userId, dropId) {
  const result = await db.query(
    `SELECT 1 FROM waitlist_entries
     WHERE user_id = $1 AND drop_id = $2`,
    [userId, dropId]
  );
  return result.rowCount > 0;
}

module.exports = {
  joinWaitlist,
  leaveWaitlist,
  isUserInWaitlist,
};
