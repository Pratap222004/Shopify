const prisma = require('../prisma/client');

async function getAll() {
  return prisma.tenant.findMany();
}

async function create(name) {
  return prisma.tenant.create({ data: { name } });
}

async function getById(id) {
  return prisma.tenant.findUnique({ where: { id: parseInt(id, 10) } });
}

async function update(id, data) {
  return prisma.tenant.update({ where: { id: parseInt(id, 10) }, data });
}

async function remove(id) {
  return prisma.tenant.delete({ where: { id: parseInt(id, 10) } });
}

module.exports = { getAll, create, getById, update, remove };


