// backend/src/controllers/claimController.js
const crypto = require('crypto');
const db = require('../config/db');
const { getDropById } = require('../models/dropModel');
const { isUserInWaitlist } = require('../models/waitlistModel');
const {
  findExistingClaim,
  countClaimsForDrop,
  createClaim,
} = require('../models/claimModel');

// POST /drops/:id/claim
async function claim(req, res, next) {
  const client = await db.pool.connect();

  try {
    const { id: dropId } = req.params;
    const userId = req.user.id;

    await client.query('BEGIN');

    // 1) Drop'u kilitle (row-level lock) → yarış koşulu önleme
    const dropResult = await client.query(
      `SELECT * FROM drops WHERE id = $1 FOR UPDATE`,
      [dropId]
    );
    const drop = dropResult.rows[0];

    if (!drop || !drop.is_active) {
      await client.query('ROLLBACK');
      return res
        .status(404)
        .json({ message: 'Drop bulunamadı veya pasif' });
    }

    const now = new Date();

    // 2) Claim window kontrolü
    if (
      now < new Date(drop.claim_start_time) ||
      now > new Date(drop.claim_end_time)
    ) {
      await client.query('ROLLBACK');
      return res
        .status(400)
        .json({ message: 'Claim penceresi açık değil' });
    }

    // 3) Kullanıcı waitlist'te mi?
    const inWaitlist = await isUserInWaitlist(userId, dropId);
    if (!inWaitlist) {
      await client.query('ROLLBACK');
      return res
        .status(403)
        .json({ message: 'Bu drop için waitlist’te değilsiniz' });
    }

    // 4) Idempotency: daha önce claim etmiş mi?
    const existingClaim = await findExistingClaim(userId, dropId);
    if (existingClaim) {
      await client.query('COMMIT');
      return res.status(200).json({
        message: 'Daha önce claim edilmiş',
        claimCode: existingClaim.claim_code,
      });
    }

    // 5) Stok kontrolü
    const claimedCount = await countClaimsForDrop(dropId);
    if (claimedCount >= drop.total_quantity) {
      await client.query('ROLLBACK');
      return res
        .status(409)
        .json({ message: 'Tüm stoklar claim edilmiş' });
    }

    // 6) Tek seferlik claim kodu üret
    const randomPart = crypto.randomBytes(6).toString('hex');
    const claimCode = `DROP${drop.id}-${randomPart}`.toUpperCase();

    // 7) Claim kaydı oluştur
    const claimRow = await createClaim(client, {
      userId,
      dropId,
      claimCode,
    });

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Claim başarıyla oluşturuldu',
      claimCode: claimRow.claim_code,
    });
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (_) {}
    next(err);
  } finally {
    client.release();
  }
}

module.exports = {
  claim,
};
