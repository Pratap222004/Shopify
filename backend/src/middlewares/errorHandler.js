function errorHandler(err, req, res, next) {
  console.log('Error:', err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'Server error',
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
}
module.exports = { errorHandler };


