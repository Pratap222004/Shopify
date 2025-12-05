const prisma = require('../prisma/client');

const DATABASE_URL = process.env.DATABASE_URL;

const dbConnect = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to MySQL');
  } catch (e) {
    console.error('MySQL connection failed:', e);
    throw e;
  }
};

module.exports = {
  DATABASE_URL,
  dbConnect,
};


