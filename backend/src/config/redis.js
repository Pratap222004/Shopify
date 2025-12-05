const { createClient } = require('redis');
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = createClient({ url: REDIS_URL });
redis.on('error', (e) => console.log('Redis error:', e));
module.exports = { redis, REDIS_URL };


