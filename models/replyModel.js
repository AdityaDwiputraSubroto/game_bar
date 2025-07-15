const db = require('../config/db');

exports.addReply = async (reviewId, userId, text) => {
  const [result] = await db.execute(
    `INSERT INTO review_replies (review_id, user_id, text) VALUES (?, ?, ?)`,
    [reviewId, userId, text]
  );
  return result.insertId;
};

exports.getReplies = async (reviewId) => {
  const [rows] = await db.execute(
    `SELECT r.id, r.text, r.created_at, u.username,
            (SELECT COUNT(*) FROM reply_likes WHERE reply_id = r.id AND type = 'like') as likes,
            (SELECT COUNT(*) FROM reply_likes WHERE reply_id = r.id AND type = 'dislike') as dislikes
     FROM review_replies r
     JOIN users u ON r.user_id = u.id
     WHERE r.review_id = ?`,
    [reviewId]
  );
  return rows;
};

exports.getRepliesWithLikes = async (reviewId) => {
  const [rows] = await db.execute(`
    SELECT rr.id, rr.user_id, u.username, rr.text, rr.created_at,
      COUNT(CASE WHEN rl.is_like = 1 THEN 1 END) AS likes,
      COUNT(CASE WHEN rl.is_like = 0 THEN 1 END) AS dislikes
    FROM review_replies rr
    JOIN users u ON rr.user_id = u.id
    LEFT JOIN reply_likes rl ON rl.reply_id = rr.id
    WHERE rr.review_id = ?
    GROUP BY rr.id
    ORDER BY rr.created_at ASC
  `, [reviewId]);

  return rows;
};
