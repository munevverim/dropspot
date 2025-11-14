
const db = require('../config/db');


async function createDrop({
  name,
  description,
  totalQuantity,
  maxPerUser,
  startTime,
  endTime,
  claimStartTime,
  claimEndTime,
  isActive = true,
}) {
  const result = await db.query(
    `INSERT INTO drops (
        name,
        description,
        total_quantity,
        max_per_user,
        start_time,
        end_time,
        claim_start_time,
        claim_end_time,
        is_active
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      name,
      description || null,
      totalQuantity,
      maxPerUser,
      startTime,
      endTime,
      claimStartTime,
      claimEndTime,
      isActive,
    ]
  );

  return result.rows[0];
}


async function updateDrop(id, fields) {
  const {
    name,
    description,
    totalQuantity,
    maxPerUser,
    startTime,
    endTime,
    claimStartTime,
    claimEndTime,
    isActive,
  } = fields;

  const result = await db.query(
    `UPDATE drops
     SET
       name = COALESCE($1, name),
       description = COALESCE($2, description),
       total_quantity = COALESCE($3, total_quantity),
       max_per_user = COALESCE($4, max_per_user),
       start_time = COALESCE($5, start_time),
       end_time = COALESCE($6, end_time),
       claim_start_time = COALESCE($7, claim_start_time),
       claim_end_time = COALESCE($8, claim_end_time),
       is_active = COALESCE($9, is_active),
       updated_at = NOW()
     WHERE id = $10
     RETURNING *`,
    [
      name ?? null,
      description ?? null,
      totalQuantity ?? null,
      maxPerUser ?? null,
      startTime ?? null,
      endTime ?? null,
      claimStartTime ?? null,
      claimEndTime ?? null,
      typeof isActive === 'boolean' ? isActive : null,
      id,
    ]
  );

  return result.rows[0] || null;
}

// Admin: drop sil
async function deleteDrop(id) {
  const result = await db.query(
    'DELETE FROM drops WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rowCount > 0;
}

// Kullanıcı: aktif drop listesi
async function listActiveDrops() {
  const result = await db.query(
    `SELECT *
     FROM drops
     WHERE is_active = TRUE
       AND start_time <= NOW()
       AND end_time >= NOW()
     ORDER BY start_time ASC`
  );

  return result.rows;
}

// Detay için tek drop
async function getDropById(id) {
  const result = await db.query(
    `SELECT * FROM drops WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

// Admin: tüm drop'lar (aktif/pasif)
async function listAllDrops() {
  const result = await db.query(
    `SELECT * FROM drops ORDER BY created_at DESC`
  );
  return result.rows;
}

module.exports = {
  createDrop,
  updateDrop,
  deleteDrop,
  listActiveDrops,
  getDropById,
  listAllDrops,
};
