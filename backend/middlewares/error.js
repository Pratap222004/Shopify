const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
}

module.exports = { errorHandler };


