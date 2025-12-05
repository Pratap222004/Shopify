const prisma = require('../prisma/client');
const syncService = require('../services/syncService');
const crypto = require('crypto');
const { SHOPIFY_WEBHOOK_SECRET } = require('../config/shopify');

/**
 * Verify HMAC signature for Shopify webhooks
 */
function verifyHmac(body, hmacHeader) {
  if (!SHOPIFY_WEBHOOK_SECRET || !hmacHeader) {
    console.warn('HMAC verification skipped: missing secret or header');
    return true; // Allow in development if secret not set
  }

  // Body is a Buffer when using express.raw()
  const bodyString = Buffer.isBuffer(body) ? body.toString('utf8') : (typeof body === 'string' ? body : JSON.stringify(body));
  const calculatedHmac = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(bodyString, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(hmacHeader),
    Buffer.from(calculatedHmac)
  );
}

/**
 * Handle Shopify order creation webhook
 */
async function orderCreate(req, res, next) {
  try {
    // Parse body if it's a Buffer
    const bodyData = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString('utf8')) : req.body;
    const shopDomain = req.headers['x-shopify-shop-domain'] || bodyData.shop_domain;
    if (!shopDomain) {
      return res.status(400).json({ error: 'Missing shop domain' });
    }

    // Verify HMAC signature
    const hmac = req.headers['x-shopify-hmac-sha256'];
    if (!verifyHmac(req.body, hmac)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const tenant = await prisma.tenant.findUnique({ where: { shopDomain } });
    if (!tenant) {
      console.log(`Webhook received for unknown tenant: ${shopDomain}`);
      return res.status(200).json({ status: 'received' }); // Don't reveal tenant existence
    }

    // Trigger a sync for this tenant
    // In production, you might want to process the webhook payload directly
    console.log(`Webhook: Order created for tenant ${tenant.id}, triggering sync`);
    syncService.syncTenantData(tenant.id).catch(err => {
      console.error(`Error syncing tenant ${tenant.id} from webhook:`, err);
    });

    res.status(200).json({ status: 'received' });
  } catch (err) {
    next(err);
  }
}

/**
 * Handle Shopify customer creation webhook
 */
async function customerCreate(req, res, next) {
  try {
    // Parse body if it's a Buffer
    const bodyData = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString('utf8')) : req.body;
    const shopDomain = req.headers['x-shopify-shop-domain'] || bodyData.shop_domain;
    if (!shopDomain) {
      return res.status(400).json({ error: 'Missing shop domain' });
    }

    // Verify HMAC signature
    const hmac = req.headers['x-shopify-hmac-sha256'];
    if (!verifyHmac(req.body, hmac)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const tenant = await prisma.tenant.findUnique({ where: { shopDomain } });
    if (!tenant) {
      console.log(`Webhook received for unknown tenant: ${shopDomain}`);
      return res.status(200).json({ status: 'received' });
    }

    console.log(`Webhook: Customer created for tenant ${tenant.id}, triggering sync`);
    syncService.syncTenantData(tenant.id).catch(err => {
      console.error(`Error syncing tenant ${tenant.id} from webhook:`, err);
    });

    res.status(200).json({ status: 'received' });
  } catch (err) {
    next(err);
  }
}

module.exports = { orderCreate, customerCreate };
