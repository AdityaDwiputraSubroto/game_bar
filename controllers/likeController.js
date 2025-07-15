const Like = require('../models/likeModel');

exports.likeOrDislikeReview = async (req, res) => {
  const { reviewId } = req.params;
  const { isLike } = req.body;
  const userId = req.user.id;

  try {
    await Like.toggleReviewLike(reviewId, userId, isLike);
    res.json({ message: 'Review like/dislike updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.likeOrDislikeReply = async (req, res) => {
  const { replyId } = req.params;
  const { isLike } = req.body;
  const userId = req.user.id;

  try {
    await Like.toggleReplyLike(replyId, userId, isLike);
    res.json({ message: 'Reply like/dislike updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
