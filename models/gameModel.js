const db = require('../config/db');

// 1. Insert Game
exports.insertGame = async (gameData) => {
  const [result] = await db.execute(
    `INSERT INTO games (name, description, developer, publisher, profile_image_url)
     VALUES (?, ?, ?, ?, ?)`,
    [
      gameData.name,
      gameData.description,
      gameData.developer,
      gameData.publisher,
      gameData.profile_image_url
    ]
  );
  return result.insertId;
};

// 2. Insert Game Image
exports.insertGameImage = async (gameId, imageUrl, publicId) => {
  await db.execute(
    `INSERT INTO game_images (game_id, image_url, public_id)
     VALUES (?, ?, ?)`,
    [gameId, imageUrl, publicId]
  );
};

// 3. Get Genre by Name
exports.findGenreByName = async (name) => {
  const [rows] = await db.execute(`SELECT id FROM genres WHERE name = ?`, [name]);
  return rows[0] || null;
};

// 4. Insert New Genre
exports.insertGenre = async (name) => {
  const [result] = await db.execute(`INSERT INTO genres (name) VALUES (?)`, [name]);
  return result.insertId;
};

// 5. Link Game to Genre
exports.insertGameGenre = async (gameId, genreId) => {
  await db.execute(
    `INSERT INTO game_genres (game_id, genre_id) VALUES (?, ?)`,
    [gameId, genreId]
  );
};

exports.getGameSummaries = async () => {
  const [rows] = await db.execute(`
    SELECT 
      g.id,
      g.name,
      g.profile_image_url,
      g.publisher,
      g.description,
      ROUND(AVG(r.rating), 1) AS cumulative_rating,
      COUNT(r.rating) AS rating_count
    FROM games g
    LEFT JOIN reviews r ON g.id = r.game_id
    GROUP BY g.id
    ORDER BY g.id DESC
  `);

  return rows;
};


exports.getGameByIdWithRating = async (gameId) => {
  const [rows] = await db.execute(`
    SELECT 
      g.id, g.name, g.description, g.profile_image_url,
      g.developer, g.publisher,
      ROUND(AVG(r.rating), 2) AS average_rating,
      COUNT(r.id) AS total_reviews
    FROM games g
    LEFT JOIN reviews r ON r.game_id = g.id
    WHERE g.id = ?
    GROUP BY g.id
  `, [gameId]);

  return rows[0];
};

// Ambil semua gambar dari game tertentu
exports.getAllGameImages = async (gameId) => {
  const [rows] = await db.execute(`
    SELECT image_url FROM game_images WHERE game_id = ?
  `, [gameId]);
  return rows;
};

// Ambil semua genre dari game tertentu
exports.getGenresByGameId = async (gameId) => {
  const [rows] = await db.execute(`
    SELECT g.name
    FROM genres g
    JOIN game_genres gg ON gg.genre_id = g.id
    WHERE gg.game_id = ?
  `, [gameId]);
  return rows.map(row => row.name);
};

// Ambil semua review dengan data user dan like/dislike
exports.getAllReviewsByGameId = async (gameId) => {
  const [rows] = await db.execute(`
    SELECT 
      r.id, r.user_id, u.username, r.rating, r.comment, r.created_at,
      COALESCE(SUM(CASE WHEN rl.is_like = 1 THEN 1 ELSE 0 END), 0) as likes,
      COALESCE(SUM(CASE WHEN rl.is_like = 0 THEN 1 ELSE 0 END), 0) as dislikes
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    LEFT JOIN review_likes rl ON rl.review_id = r.id
    WHERE r.game_id = ?
    GROUP BY r.id
    ORDER BY r.created_at DESC
  `, [gameId]);
  return rows;
};

