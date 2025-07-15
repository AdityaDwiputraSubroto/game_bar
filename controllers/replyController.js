const Reply = require('../models/replyModel');

exports.addReply = async (req, res) => {
  const { reviewId } = req.params;
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'Text required' });

  try {
    const replyId = await Reply.addReply(reviewId, req.user.id, text);
    res.status(201).json({ message: 'Reply added', replyId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getReplies = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const replies = await Reply.getRepliesWithLikes(reviewId);
    res.json(replies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get replies' });
  }
};

