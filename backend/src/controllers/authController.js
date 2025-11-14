// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

function generateToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

// POST /auth/signup
// body: { email, password }
async function signup(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'email ve password zorunludur' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      // idempotent: aynı email ile tekrar signup → aynı sonucu dön (409)
      return res
        .status(409)
        .json({ message: 'Bu email adresi zaten kayıtlı' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, passwordHash });

    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
}

// POST /auth/login
// body: { email, password }
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'email ve password zorunludur' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
    }

    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signup,
  login,
};
