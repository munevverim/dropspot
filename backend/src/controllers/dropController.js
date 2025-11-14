// backend/src/controllers/dropController.js
const {
  createDrop,
  updateDrop,
  deleteDrop,
  listActiveDrops,
  getDropById,
  listAllDrops,
} = require('../models/dropModel');

// GET /drops  → aktif drop listesi
async function getActiveDrops(req, res, next) {
  try {
    const drops = await listActiveDrops();
    res.json(drops);
  } catch (err) {
    next(err);
  }
}

// GET /drops/:id  → drop detayı
async function getDrop(req, res, next) {
  try {
    const { id } = req.params;
    const drop = await getDropById(id);

    if (!drop) {
      return res.status(404).json({ message: 'Drop bulunamadı' });
    }

    res.json(drop);
  } catch (err) {
    next(err);
  }
}

// GET /admin/drops  → tüm drop'lar (admin)
async function adminListDrops(req, res, next) {
  try {
    const drops = await listAllDrops();
    res.json(drops);
  } catch (err) {
    next(err);
  }
}

// POST /admin/drops  → yeni drop oluştur
async function adminCreateDrop(req, res, next) {
  try {
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
    } = req.body;

    if (
      !name ||
      totalQuantity == null ||
      !startTime ||
      !endTime ||
      !claimStartTime ||
      !claimEndTime
    ) {
      return res.status(400).json({
        message:
          'name, totalQuantity, startTime, endTime, claimStartTime, claimEndTime zorunludur',
      });
    }

    const drop = await createDrop({
      name,
      description,
      totalQuantity: Number(totalQuantity),
      maxPerUser: maxPerUser ? Number(maxPerUser) : 1,
      startTime,
      endTime,
      claimStartTime,
      claimEndTime,
      isActive: typeof isActive === 'boolean' ? isActive : true,
    });

    res.status(201).json(drop);
  } catch (err) {
    next(err);
  }
}

// PUT /admin/drops/:id  → drop güncelle
async function adminUpdateDrop(req, res, next) {
  try {
    const { id } = req.params;
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
    } = req.body;

    const drop = await updateDrop(id, {
      name,
      description,
      totalQuantity:
        typeof totalQuantity !== 'undefined'
          ? Number(totalQuantity)
          : undefined,
      maxPerUser:
        typeof maxPerUser !== 'undefined' ? Number(maxPerUser) : undefined,
      startTime,
      endTime,
      claimStartTime,
      claimEndTime,
      isActive,
    });

    if (!drop) {
      return res.status(404).json({ message: 'Drop bulunamadı' });
    }

    res.json(drop);
  } catch (err) {
    next(err);
  }
}

// DELETE /admin/drops/:id
async function adminDeleteDrop(req, res, next) {
  try {
    const { id } = req.params;
    const ok = await deleteDrop(id);

    if (!ok) {
      return res.status(404).json({ message: 'Drop bulunamadı' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getActiveDrops,
  getDrop,
  adminListDrops,
  adminCreateDrop,
  adminUpdateDrop,
  adminDeleteDrop,
};
