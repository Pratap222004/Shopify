const authService = require('../services/authService');
const { asyncHandler } = require('../utils/helpers');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const token = await authService.login(email, password);
  if (!token) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token });
});

const register = asyncHandler(async (req, res) => {
  const { email, password, tenantName } = req.body;
  const token = await authService.register(email, password, tenantName);
  res.status(201).json({ token });
});

module.exports = { login, register };


