require('dotenv').config();
const express = require('express');
const app = express();
const apiRoutes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Parse JSON for all routes except webhooks (webhooks need raw body for HMAC)
// Webhooks need raw body for HMAC verification, so we handle them separately
app.use('/api/webhooks', express.raw({ type: 'application/json' }), (req, res, next) => {
  // Parse the raw body to JSON for easier access in controllers
  try {
    req.body = JSON.parse(req.body.toString('utf8'));
  } catch (e) {
    // If parsing fails, keep as raw buffer
  }
  next();
});
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', apiRoutes);

app.use(errorHandler);

module.exports = app;

