const metricsService = require('../services/metricsService');

async function summary(req, res, next) {
  try {
    const result = await metricsService.summary(req.tenantId);
    res.json(result);
  } catch (err) { next(err); }
}

async function ordersByDate(req, res, next) {
  try {
    const { from, to } = req.query;
    const result = await metricsService.ordersByDate(req.tenantId, from, to);
    res.json(result);
  } catch (err) { next(err); }
}

async function topCustomers(req, res, next) {
  try {
    const result = await metricsService.topCustomers(req.tenantId);
    res.json(result);
  } catch (err) { next(err); }
}

async function revenueByDate(req, res, next) {
  try {
    const { from, to } = req.query;
    const result = await metricsService.revenueByDate(req.tenantId, from, to);
    res.json(result);
  } catch (err) { next(err); }
}

async function productPerformance(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const result = await metricsService.productPerformance(req.tenantId, limit);
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = { 
  summary, 
  ordersByDate, 
  topCustomers, 
  revenueByDate, 
  productPerformance,
};
