const axios = require('axios');

/**
 * Shopify Admin REST API Service
 * Fetches data from Shopify stores using tenant's shopDomain and accessToken
 */

/**
 * Build Shopify Admin API URL
 */
function buildShopifyUrl(shopDomain, endpoint) {
  const cleanDomain = shopDomain.replace(/^https?:\/\//, '').replace(/\.myshopify\.com$/, '');
  return `https://${cleanDomain}.myshopify.com/admin/api/2023-10/${endpoint}`;
}

/**
 * Fetch customers from Shopify Admin API
 */
async function fetchCustomersFromShopify(tenant) {
  if (!tenant.shopDomain || !tenant.shopifyAccessToken) {
    console.log(`Tenant ${tenant.id} missing Shopify credentials`);
    return [];
  }

  try {
    const url = buildShopifyUrl(tenant.shopDomain, 'customers.json');
    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': tenant.shopifyAccessToken,
      },
    });
    return response.data.customers || [];
  } catch (error) {
    console.error(`Error fetching customers for tenant ${tenant.id}:`, error.message);
    // Return empty array on error (could be stubbed for demo)
    return [];
  }
}

/**
 * Fetch orders from Shopify Admin API
 */
async function fetchOrdersFromShopify(tenant) {
  if (!tenant.shopDomain || !tenant.shopifyAccessToken) {
    console.log(`Tenant ${tenant.id} missing Shopify credentials`);
    return [];
  }

  try {
    const url = buildShopifyUrl(tenant.shopDomain, 'orders.json?status=any&limit=250');
    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': tenant.shopifyAccessToken,
      },
    });
    return response.data.orders || [];
  } catch (error) {
    console.error(`Error fetching orders for tenant ${tenant.id}:`, error.message);
    return [];
  }
}

/**
 * Fetch products from Shopify Admin API
 */
async function fetchProductsFromShopify(tenant) {
  if (!tenant.shopDomain || !tenant.shopifyAccessToken) {
    console.log(`Tenant ${tenant.id} missing Shopify credentials`);
    return [];
  }

  try {
    const url = buildShopifyUrl(tenant.shopDomain, 'products.json?limit=250');
    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': tenant.shopifyAccessToken,
      },
    });
    return response.data.products || [];
  } catch (error) {
    console.error(`Error fetching products for tenant ${tenant.id}:`, error.message);
    return [];
  }
}

/**
 * Fetch events from Shopify (optional - for custom events like cart abandoned)
 * This is a placeholder for future webhook-based event tracking
 */
async function fetchEventsFromShopify(tenant) {
  // For now, return empty array
  // In production, this could query Shopify Analytics API or process webhook events
  return [];
}

module.exports = {
  fetchCustomersFromShopify,
  fetchOrdersFromShopify,
  fetchProductsFromShopify,
  fetchEventsFromShopify,
};


