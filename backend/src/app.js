// backend/src/app.js
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const dropRoutes = require('./routes/dropRoutes');
const adminDropRoutes = require('./routes/adminDropRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/drops', dropRoutes);
app.use('/admin/drops', adminDropRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;

