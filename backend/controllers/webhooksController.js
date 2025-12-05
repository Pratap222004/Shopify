const webhookService = require('../services/webhookService');
const { asyncHandler } = require('../utils/helpers');

const handle = asyncHandler(async (req, res) => {
  await webhookService.handle(req.body);
  res.status(200).json({ status: 'received' });
});

module.exports = { handle };


