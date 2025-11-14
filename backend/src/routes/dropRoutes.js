// backend/src/routes/dropRoutes.js
const express = require('express');
const {
  getActiveDrops,
  getDrop,
} = require('../controllers/dropController');

const { join, leave } = require('../controllers/waitlistController');
const { claim } = require('../controllers/claimController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// PUBLIC ROUTES
router.get('/', getActiveDrops);
router.get('/:id', getDrop);

// AUTH REQUIRED ROUTES
router.post('/:id/join', requireAuth, join);
router.post('/:id/leave', requireAuth, leave);
router.post('/:id/claim', requireAuth, claim);

module.exports = router;
