const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/error');
const { tenantMiddleware } = require('./middlewares/tenant');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(tenantMiddleware); // Attach tenant extraction middleware

// Healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Main API routes
app.use('/api', routes);

// Global error handling
app.use(errorHandler);

module.exports = app;


