// backend/src/controllers/waitlistController.js
const { getDropById } = require('../models/dropModel');
const {
  joinWaitlist,
  leaveWaitlist,
} = require('../models/waitlistModel');

// POST /drops/:id/join
async function join(req, res, next) {
  try {
    const { id: dropId } = req.params;
    const userId = req.user.id;

    const drop = await getDropById(dropId);
    if (!drop || !drop.is_active) {
      return res.status(404).json({ message: 'Drop bulunamadı veya pasif' });
    }

    // zaman kontrolü: drop süresi içinde mi
    const now = new Date();
    if (now < new Date(drop.start_time) || now > new Date(drop.end_time)) {
      return res
        .status(400)
        .json({ message: 'Bu drop için kayıt zamanı dışında' });
    }

    await joinWaitlist(userId, dropId);

    // idempotent: daha önce katılmış olsa bile sonucu değiştirmiyoruz
    res.status(200).json({ message: 'Waitlist’e katılındı', dropId });
  } catch (err) {
    next(err);
  }
}

// POST /drops/:id/leave
async function leave(req, res, next) {
  try {
    const { id: dropId } = req.params;
    const userId = req.user.id;

    await leaveWaitlist(userId, dropId);

    // idempotent: zaten yoksa da 200 dönüyoruz
    res.status(200).json({ message: 'Waitlist’ten ayrılındı', dropId });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  join,
  leave,
};
