const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route registrations
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const gameRoutes = require('./routes/gameRoutes');
app.use('/api/games', gameRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

const likeRoutes = require('./routes/likeRoutes');
app.use('/api/likes', likeRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});