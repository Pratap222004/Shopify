require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 4000,
  ...require('./db'),
  ...require('./redis'),
  ...require('./jwt'),
  ...require('./shopify'),
  ...require('./cron'),
};


