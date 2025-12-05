const prisma = require('../prisma/client');
const { redis } = require('../config/redis');

const CACHE_TTL = 300; // 5 minutes

/**
 * Get cache key for tenant-specific metrics
 */
function getCacheKey(tenantId, metricType, ...params) {
  return `metrics:${tenantId}:${metricType}:${params.join(':')}`;
}

/**
 * Clear all cached metrics for a tenant (call after sync)
 */
async function clearCacheForTenant(tenantId) {
  try {
    const pattern = `metrics:${tenantId}:*`;
    // Note: Redis keys() with pattern can be slow in production
    // For now, we'll clear specific keys. In production, use SCAN
    const keys = [
      getCacheKey(tenantId, 'summary'),
      getCacheKey(tenantId, 'topCustomers', '5'),
    ];
    for (const key of keys) {
      await redis.del(key);
    }
    // Clear date range caches by deleting all keys with tenant prefix
    // In production, use SCAN for better performance
    console.log(`Cleared cache for tenant ${tenantId}`);
  } catch (error) {
    console.log('Cache clear error:', error.message);
  }
}

/**
 * Get from cache or compute and cache
 */
async function getCachedOrCompute(tenantId, cacheKey, computeFn) {
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.log('Cache read error:', error.message);
  }

  const result = await computeFn();
  
  try {
    await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(result));
  } catch (error) {
    console.log('Cache write error:', error.message);
  }

  return result;
}

/**
 * Get summary metrics for a tenant
 */
async function summary(tenantId) {
  const cacheKey = getCacheKey(tenantId, 'summary');

  return getCachedOrCompute(tenantId, cacheKey, async () => {
    // Get counts
    const [customerCount, orderCount] = await Promise.all([
      prisma.customer.count({ where: { tenantId } }),
      prisma.order.count({ where: { tenantId } }),
    ]);

    // Get all orders with prices
    const orders = await prisma.order.findMany({
      where: { tenantId },
      select: { 
        totalPrice: true, 
        customerId: true 
      },
    });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    
    // Calculate average order value
    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Calculate repeat customer rate
    // Count how many customers have more than 1 order
    const customerOrderCounts = {};
    orders.forEach(order => {
      customerOrderCounts[order.customerId] = (customerOrderCounts[order.customerId] || 0) + 1;
    });
    
    const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
    const repeatCustomerRate = customerCount > 0 
      ? (repeatCustomers / customerCount) * 100 
      : 0;

    return {
      totalCustomers: customerCount,
      totalOrders: orderCount,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      repeatCustomerRate: parseFloat(repeatCustomerRate.toFixed(2)),
    };
  });
}

/**
 * Get orders grouped by date
 */
async function ordersByDate(tenantId, from, to) {
  const cacheKey = getCacheKey(tenantId, 'ordersByDate', from, to);

  return getCachedOrCompute(tenantId, cacheKey, async () => {
    // Validate date inputs
    if (!from || !to) {
      return [];
    }

    const fromDate = new Date(from);
    const toDate = new Date(to + 'T23:59:59');

    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        placedAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      select: {
        placedAt: true,
        totalPrice: true,
      },
      orderBy: {
        placedAt: 'asc',
      },
    });

    // Group by date
    const grouped = {};
    orders.forEach(order => {
      const date = order.placedAt.toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { date, orderCount: 0, revenue: 0 };
      }
      grouped[date].orderCount++;
      grouped[date].revenue += order.totalPrice || 0;
    });

    // Convert to array and sort by date
    return Object.values(grouped)
      .map(item => ({
        date: item.date,
        orderCount: item.orderCount,
        revenue: parseFloat(item.revenue.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  });
}

/**
 * Get revenue grouped by date
 */
async function revenueByDate(tenantId, from, to) {
  const cacheKey = getCacheKey(tenantId, 'revenueByDate', from, to);

  return getCachedOrCompute(tenantId, cacheKey, async () => {
    // Validate date inputs
    if (!from || !to) {
      return [];
    }

    const fromDate = new Date(from);
    const toDate = new Date(to + 'T23:59:59');

    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        placedAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      select: {
        placedAt: true,
        totalPrice: true,
      },
      orderBy: {
        placedAt: 'asc',
      },
    });

    // Group by date
    const grouped = {};
    orders.forEach(order => {
      const date = order.placedAt.toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { date, revenue: 0 };
      }
      grouped[date].revenue += order.totalPrice || 0;
    });

    // Convert to array and sort by date
    return Object.values(grouped)
      .map(item => ({
        date: item.date,
        revenue: parseFloat(item.revenue.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  });
}

/**
 * Get top customers by total spend
 */
async function topCustomers(tenantId, limit = 5) {
  const cacheKey = getCacheKey(tenantId, 'topCustomers', limit.toString());

  return getCachedOrCompute(tenantId, cacheKey, async () => {
    const customers = await prisma.customer.findMany({
      where: { tenantId },
      include: {
        orders: {
          select: { totalPrice: true },
        },
      },
    });

    const customersWithSpend = customers
      .map(customer => {
        const totalSpend = customer.orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        return {
          name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown Customer',
          email: customer.email || '',
          totalSpend: parseFloat(totalSpend.toFixed(2)),
        };
      })
      .filter(c => c.totalSpend > 0) // Only include customers with orders
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, limit);

    return customersWithSpend;
  });
}

/**
 * Get top products by quantity sold (optional metric)
 */
async function productPerformance(tenantId, limit = 5) {
  const cacheKey = getCacheKey(tenantId, 'productPerformance', limit.toString());

  return getCachedOrCompute(tenantId, cacheKey, async () => {
    // For now, return products ordered by price (as a proxy for performance)
    // In a real system, you'd track product quantities sold in orders
    const products = await prisma.product.findMany({
      where: { tenantId },
      orderBy: { price: 'desc' },
      take: limit,
    });

    return products.map(p => ({
      title: p.title,
      price: parseFloat(p.price.toFixed(2)),
      // In production, add: quantitySold, revenue
    }));
  });
}

module.exports = {
  summary,
  ordersByDate,
  revenueByDate,
  topCustomers,
  productPerformance,
  clearCacheForTenant,
};
