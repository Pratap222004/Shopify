const tenantService = require('../services/tenantService');

async function getSettings(req, res, next) {
  try {
    const tenant = await tenantService.getTenantById(req.tenantId);
    res.json({
      name: tenant.name,
      shopDomain: tenant.shopDomain,
      shopifyAccessToken: tenant.shopifyAccessToken ? '***' : '', // Don't expose full token
      lastSyncedAt: tenant.lastSyncedAt,
    });
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const { name, shopDomain, shopifyAccessToken } = req.body;
    const updated = await tenantService.updateTenant(req.tenantId, {
      name,
      shopDomain,
      shopifyAccessToken,
    });
    res.json({
      name: updated.name,
      shopDomain: updated.shopDomain,
      shopifyAccessToken: updated.shopifyAccessToken ? '***' : '',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSettings, updateSettings };

