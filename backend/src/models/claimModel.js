// backend/src/models/claimModel.js
const db = require('../config/db');

async function findExistingClaim(userId, dropId) {
  const result = await db.query(
    `SELECT * FROM claims
     WHERE user_id = $1 AND drop_id = $2
       AND status = 'claimed'
     LIMIT 1`,
    [userId, dropId]
  );
  return result.rows[0] || null;
}

async function countClaimsForDrop(dropId) {
  const result = await db.query(
    `SELECT COUNT(*)::INT AS count
     FROM claims
     WHERE drop_id = $1
       AND status = 'claimed'`,
    [dropId]
  );
  return result.rows[0].count;
}

async function createClaim(client, { userId, dropId, claimCode }) {
  const result = await client.query(
    `INSERT INTO claims (user_id, drop_id, claim_code)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, dropId, claimCode]
  );
  return result.rows[0];
}

module.exports = {
  findExistingClaim,
  countClaimsForDrop,
  createClaim,
};
