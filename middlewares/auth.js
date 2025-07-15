const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid user' });

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role // ⬅️ ini harus ada
    };

    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalid or expired' });
  }
};
