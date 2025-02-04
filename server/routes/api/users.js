const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('favorites');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add location to favorites
router.post('/favorites/:locationId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(req.params.locationId)) {
      user.favorites.push(req.params.locationId);
      await user.save();
    }
    res.json(user.favorites);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove location from favorites
router.delete('/favorites/:locationId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.locationId
    );
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Save search parameters
router.post('/searches', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedSearches.push(req.body);
    await user.save();
    res.json(user.savedSearches);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;