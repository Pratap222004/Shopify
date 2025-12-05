const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '6h';
module.exports = {
  JWT_SECRET,
  JWT_EXPIRES,
};


