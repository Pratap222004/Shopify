const tenantsService = require('../services/tenantsService');
const { asyncHandler } = require('../utils/helpers');

const getAll = asyncHandler(async (req, res) => {
  const tenants = await tenantsService.getAll();
  res.json(tenants);
});

const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const tenant = await tenantsService.create(name);
  res.status(201).json(tenant);
});

const getById = asyncHandler(async (req, res) => {
  const tenant = await tenantsService.getById(req.params.id);
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
  res.json(tenant);
});

const update = asyncHandler(async (req, res) => {
  const tenant = await tenantsService.update(req.params.id, req.body);
  res.json(tenant);
});

const remove = asyncHandler(async (req, res) => {
  await tenantsService.remove(req.params.id);
  res.status(204).end();
});

module.exports = { getAll, create, getById, update, remove };


