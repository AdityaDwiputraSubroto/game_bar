const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET;

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const userId = await User.createUser(username, email, hashed);
    res.status(201).json({ message: 'User created', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = jwt.sign(
        { id: user.id, role: user.role }, // ⬅️ tambahkan role ke payload
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Simpan refresh token di DB
    await User.saveRefreshToken(user.id, refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

  try {
    const user = await User.findByRefreshToken(refreshToken);
    if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Token expired or invalid' });

      const newAccessToken = jwt.sign(
        { id: user.id },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

  try {
    // Cek apakah token valid dan terdaftar
    const user = await User.findByRefreshToken(refreshToken);
    if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

    // Kosongkan refresh token di DB
    await User.saveRefreshToken(user.id, null);

    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
