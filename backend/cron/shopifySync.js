const cron = require('node-cron');
const { CRON_SCHEDULE } = require('../config/cron');
const shopifySyncService = require('../services/shopifySyncService');
const logger = require('../utils/logger');

let jobStarted = false;

function start() {
  if (!jobStarted) {
    cron.schedule(CRON_SCHEDULE, async () => {
      logger.info('Running scheduled Shopify sync...');
      await shopifySyncService.syncAllTenants();
    });
    jobStarted = true;
    logger.info('Shopify sync cron job scheduled with:', CRON_SCHEDULE);
  }
}

module.exports = { start };


