const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const upload = require('../middlewares/upload');

router.post(
  '/upload',
  auth,
  isAdmin, // ⬅️ hanya admin
  upload.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  gameController.uploadGame
);

router.get('/gameList', auth, gameController.getGameSummaries);
router.get('/:id/detail', auth, gameController.getGameDetail);
module.exports = router;
