const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const auth = require('../middlewares/auth');

router.post('/review/:reviewId', auth, likeController.likeOrDislikeReview);
router.post('/reply/:replyId', auth, likeController.likeOrDislikeReply);

module.exports = router;
