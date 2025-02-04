const express = require('express');
const router = express.Router();
const Location = require('../../models/Location');

// Get locations within radius of coordinates
router.get('/search', async (req, res) => {
  try {
    const { lat, lng, radius = 50, type } = req.query;
    
    const query = {
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1609.34 // Convert miles to meters
        }
      }
    };

    if (type) {
      query.type = type;
    }

    const locations = await Location.find(query);
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single location
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new location
router.post('/', async (req, res) => {
  try {
    const location = new Location(req.body);
    const savedLocation = await location.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update location
router.patch('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    Object.assign(location, req.body);
    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;