if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set!');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '6h';
module.exports = { JWT_SECRET, JWT_EXPIRES };


