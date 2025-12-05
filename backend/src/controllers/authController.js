const authService = require('../services/authService');

async function signup(req, res) {
  try {
    const { name, shopDomain, shopifyAccessToken, email, password } = req.body;
    // Only name, email, and password are required
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields: name, email, and password are required' });
    }
    const token = await authService.signup({ name, shopDomain, shopifyAccessToken, email, password });
    res.status(201).json({ token });
  } catch (err) {
    console.log('Signup error:', err);
    res.status(400).json({ error: err.message || 'Signup failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const token = await authService.login(email, password);
    if (!token) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token });
  } catch (err) {
    console.log('Login error:', err);
    res.status(400).json({ error: err.message });
  }
}

module.exports = { signup, login };

