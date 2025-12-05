const http = require('http');
const app = require('./app');
const { dbConnect } = require('./config/db');
const { redisClient } = require('./config/redis');
const { PORT } = require('./config');
const logger = require('./utils/logger');
const cronJobs = require('./cron/shopifySync');

const server = http.createServer(app);

const start = async () => {
  try {
    await dbConnect(); // MySQL
    await redisClient.connect(); // Redis
    cronJobs.start(); // Shopify sync jobs
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Startup failed:', err);
    process.exit(1);
  }
};

start();


