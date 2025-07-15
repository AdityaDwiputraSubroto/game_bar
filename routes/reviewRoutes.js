const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const replyController = require('../controllers/replyController');
const auth = require('../middlewares/auth');

// Review endpoints
router.post('/post/:gameId', auth, reviewController.createOrUpdateReview);
router.get('/:gameId', auth, reviewController.getReviewsForGame);

// Reply endpoints
router.post('/:reviewId/reply', auth, replyController.addReply);
router.get('/:reviewId/replies', auth, replyController.getReplies);

module.exports = router;
