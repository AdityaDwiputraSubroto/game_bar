const db = require('../config/db');

exports.findByEmail = async (email) => {
  const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0];
};

exports.findByUsername = async (username) => {
  const [rows] = await db.execute(`SELECT * FROM users WHERE username = ?`, [username]);
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0];
};

exports.createUser = async (username, email, hashedPassword) => {
  const [result] = await db.execute(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, hashedPassword]
  );
  return result.insertId;
};

exports.saveRefreshToken = async (id, token) => {
  await db.execute(`UPDATE users SET refresh_token = ? WHERE id = ?`, [token, id]);
};

exports.findByRefreshToken = async (token) => {
  const [rows] = await db.execute(`SELECT * FROM users WHERE refresh_token = ?`, [token]);
  return rows[0];
};
