const db = require('../config/db');

exports.toggleReviewLike = async (reviewId, userId, isLike) => {
  const numericIsLike = isLike ? 1 : 0;

  await db.execute(`
    INSERT INTO review_likes (review_id, user_id, is_like)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE is_like = ?
  `, [reviewId, userId, numericIsLike, numericIsLike]);
};

exports.toggleReplyLike = async (replyId, userId, isLike) => {
  const numericIsLike = isLike ? 1 : 0;

  await db.execute(`
    INSERT INTO reply_likes (reply_id, user_id, is_like)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE is_like = ?`,
    [replyId, userId, numericIsLike, numericIsLike]);

};
