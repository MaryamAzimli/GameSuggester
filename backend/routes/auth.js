const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust path as necessary
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password, mail } = req.body;  // Include mail here
  try {
    const user = new User({ username, password, mail });  // Include mail here as well
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  // Here, you can optionally handle token invalidation, like adding it to a blacklist
  // For now, we'll just send a success message

  res.status(200).json({ message: 'Logged out successfully' });
});

// Add a game to favorites
router.post('/addFavorite', async (req, res) => {
  const { userId, appid } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.favorites.includes(appid)) {
      user.favorites.push(appid);
      await user.save();
      res.status(200).json({ message: 'Game added to favorites', favorites: user.favorites });
    } else {
      res.status(400).json({ error: 'Game already in favorites' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a game from favorites
router.post('/removeFavorite', async (req, res) => {
  const { userId, appid } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.favorites = user.favorites.filter(id => id !== appid);
    await user.save();
    res.status(200).json({ message: 'Game removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's favorite games
router.get('/favorites/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
