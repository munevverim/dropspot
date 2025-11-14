// backend/src/routes/adminDropRoutes.js
const express = require('express');
const {
  adminListDrops,
  adminCreateDrop,
  adminUpdateDrop,
  adminDeleteDrop,
} = require('../controllers/dropController');
const {
  requireAuth,
  requireAdmin,
} = require('../middleware/authMiddleware');

const router = express.Router();

// Tüm admin drop endpoint'leri JWT + admin korumalı
router.use(requireAuth);
router.use(requireAdmin);

// GET /admin/drops  → tüm drop’lar
router.get('/', adminListDrops);

// POST /admin/drops → yeni drop oluştur
router.post('/', adminCreateDrop);

// PUT /admin/drops/:id → drop güncelle
router.put('/:id', adminUpdateDrop);

// DELETE /admin/drops/:id → drop sil
router.delete('/:id', adminDeleteDrop);

module.exports = router;
