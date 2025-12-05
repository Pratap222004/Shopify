const cron = require('node-cron');
const syncService = require('../services/syncService');

let jobStarted = false;

/**
 * Start the scheduled Shopify sync job
 * Runs every hour by default
 */
function start() {
  if (jobStarted) {
    console.log('Shopify sync cron job already started');
    return;
  }

  // Run every hour: 0 * * * *
  // For testing, you can use: '*/15 * * * *' (every 15 minutes)
  const schedule = process.env.CRON_SCHEDULE || '0 * * * *'; // Every hour at minute 0

  cron.schedule(schedule, async () => {
    console.log(`[Cron] Starting scheduled Shopify sync at ${new Date().toISOString()}`);
    try {
      const results = await syncService.syncAllTenants();
      console.log(`[Cron] Sync completed:`, results);
    } catch (error) {
      console.error(`[Cron] Sync error:`, error);
    }
  });

  jobStarted = true;
  console.log(`[Cron] Shopify sync job scheduled: ${schedule}`);
}

module.exports = { start };

