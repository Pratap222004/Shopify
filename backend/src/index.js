const app = require('./app');
const { redis } = require('./config/redis');
const { start: startCron } = require('./cron/shopifySync');
const PORT = process.env.PORT || 4000;

process.on('uncaughtException', err => {
  console.log('Uncaught error:', err);
  process.exit(1);
});
process.on('unhandledRejection', err => {
  console.log('Unhandled rejection:', err);
  process.exit(1);
});

(async () => {
  await redis.connect();
  startCron(); // Start scheduled sync jobs
  app.listen(PORT, () => {
    console.log('API server running on port', PORT);
  });
})();

