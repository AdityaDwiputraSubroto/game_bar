const Review = require('../models/reviewModel');

exports.createOrUpdateReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { gameId } = req.params;

  try {
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ error: 'Rating must be 1-5' });

    const reviewId = await Review.createOrUpdateReview(
      req.user.id,
      gameId,
      rating,
      comment || null
    );

    res.status(201).json({ message: 'Review saved', reviewId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getReviewsForGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    const reviews = await Review.getReviewsWithLikes(gameId);
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
};
