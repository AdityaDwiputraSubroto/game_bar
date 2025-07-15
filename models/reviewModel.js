const db = require('../config/db');

exports.createOrUpdateReview = async (userId, gameId, rating, comment) => {
  const [rows] = await db.execute(
    `SELECT * FROM reviews WHERE user_id = ? AND game_id = ?`,
    [userId, gameId]
  );

  if (rows.length > 0) {
    // Update
    await db.execute(
      `UPDATE reviews SET rating = ?, comment = ? WHERE user_id = ? AND game_id = ?`,
      [rating, comment, userId, gameId]
    );
    return rows[0].id;
  } else {
    // Insert
    const [result] = await db.execute(
      `INSERT INTO reviews (user_id, game_id, rating, comment) VALUES (?, ?, ?, ?)`,
      [userId, gameId, rating, comment]
    );
    return result.insertId;
  }
};

exports.getReviewsForGame = async (gameId) => {
  const [rows] = await db.execute(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.username,
            (SELECT COUNT(*) FROM review_likes WHERE review_id = r.id AND type = 'like') as likes,
            (SELECT COUNT(*) FROM review_likes WHERE review_id = r.id AND type = 'dislike') as dislikes
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.game_id = ?`,
    [gameId]
  );
  return rows;
};

exports.getReviewsWithLikes = async (gameId) => {
  const [rows] = await db.execute(`
    SELECT r.id, r.user_id, u.username, r.rating, r.comment, r.created_at,
      COUNT(CASE WHEN rl.is_like = 1 THEN 1 END) AS likes,
      COUNT(CASE WHEN rl.is_like = 0 THEN 1 END) AS dislikes
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    LEFT JOIN review_likes rl ON rl.review_id = r.id
    WHERE r.game_id = ?
    GROUP BY r.id
    ORDER BY r.created_at DESC
  `, [gameId]);

  return rows;
};

