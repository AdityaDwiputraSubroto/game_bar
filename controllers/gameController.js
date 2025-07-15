const cloudinary = require('../config/cloudinary');
const GameModel = require('../models/gameModel');

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    }).end(fileBuffer);
  });
};

exports.uploadGame = async (req, res) => {
  try {
    const {
      name,
      description,
      developer,
      publisher,
      genres
    } = req.body;

    if (!name || !description || !developer || !publisher || !genres) {
      return res.status(400).json({ error: 'All fields including genres are required' });
    }

    let parsedGenres;
    try {
      parsedGenres = JSON.parse(genres);
      if (!Array.isArray(parsedGenres)) throw new Error();
    } catch {
      return res.status(400).json({ error: 'Genres must be a valid JSON array like ["RPG", "Action"]' });
    }

    const profileImage = req.files['profile_image']?.[0];
    if (!profileImage) {
      return res.status(400).json({ error: 'Profile image is required' });
    }

    const profileUpload = await uploadToCloudinary(profileImage.buffer, 'game_profile');

    // 🔁 Insert Game
    const gameId = await GameModel.insertGame({
      name,
      description,
      developer,
      publisher,
      profile_image_url: profileUpload.secure_url
    });

    // 🔁 Upload gallery images
    const galleryImages = req.files['images'] || [];
    for (const file of galleryImages) {
      const imageUpload = await uploadToCloudinary(file.buffer, 'game_images');
      await GameModel.insertGameImage(gameId, imageUpload.secure_url, imageUpload.public_id);
    }

    // 🔁 Insert genres
    for (const genreName of parsedGenres) {
      let genre = await GameModel.findGenreByName(genreName);
      let genreId = genre?.id;

      if (!genreId) {
        genreId = await GameModel.insertGenre(genreName);
      }

      await GameModel.insertGameGenre(gameId, genreId);
    }

    res.status(201).json({ message: 'Game uploaded successfully', gameId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.getGameSummaries = async (req, res) => {
  try {
    const games = await GameModel.getGameSummaries();
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getGameDetail = async (req, res) => {
  try {
    const gameId = req.params.id;

    // 1. Ambil detail game dengan rating rata-rata
    const game = await GameModel.getGameByIdWithRating(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // 2. Ambil gambar-gambar selain profile
    const images = await GameModel.getAllGameImages(gameId);

    // 3. Ambil genre
    const genres = await GameModel.getGenresByGameId(gameId);

    // 4. Ambil semua review dan info like/dislike
    const reviews = await GameModel.getAllReviewsByGameId(gameId);

    // Gabungkan data dan kirimkan
    res.json({
      ...game,
      genres,
      images,
      reviews
    });
  } catch (err) {
    console.error('Error in getGameDetail:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

