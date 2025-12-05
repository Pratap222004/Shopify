const DATABASE_URL = process.env.DATABASE_URL;
function getPrisma() {
  return require('../prisma/client');
}
module.exports = { DATABASE_URL, getPrisma };


