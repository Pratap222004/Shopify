// src/controllers/syncController.js

const syncService = require('../services/syncService');

/**
 * Controller to trigger a manual sync for the authenticated tenant.
 * Assumes authMiddleware has attached req.tenantId.
 */
async function run(req, res, next) {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: 'Missing tenantId on request' });
    }

    // Call the service to sync data for this tenant
    const result = await syncService.syncTenantData(tenantId);

    return res.json({
      success: true,
      tenantId,
      ...result,
    });
  } catch (err) {
    console.error('Error in runSync controller:', err);
    next(err);
  }
}

module.exports = {
  run,
};
