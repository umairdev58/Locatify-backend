const Place = require('../models/Place');

exports.savePlace = async (req, res) => {
  const { name, notes, location } = req.body;
  if (!name || !location) {
    return res.status(400).json({ message: 'Name and location are required' });
  }

  const locationObj = typeof location === 'string' ? JSON.parse(location) : location;
  if (!locationObj || typeof locationObj.latitude !== 'number' || typeof locationObj.longitude !== 'number') {
    return res.status(400).json({ message: 'Location payload malformed' });
  }

  try {
    const place = await Place.create({
      user: req.user.id,
      name,
      notes: notes || '',
      location: {
        latitude: locationObj.latitude,
        longitude: locationObj.longitude
      }
    });

    return res.status(201).json(place);
  } catch (error) {
    console.error('Save place error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyPlaces = async (req, res) => {
  try {
    const places = await Place.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(places);
  } catch (error) {
    console.error('Fetch places error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePlace = async (req, res) => {
  const { name, notes, location, placeId } = req.body;
  
  if (!placeId) {
    return res.status(400).json({ message: 'Place ID is required' });
  }

  try {
    const place = await Place.findOne({ user: req.user.id, _id: placeId });
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    if (name) {
      place.name = name;
    }
    if (notes !== undefined) {
      place.notes = notes;
    }

    if (location) {
      const locationObj = typeof location === 'string' ? JSON.parse(location) : location;
      if (locationObj && typeof locationObj.latitude === 'number' && typeof locationObj.longitude === 'number') {
        place.location = {
          latitude: locationObj.latitude,
          longitude: locationObj.longitude
        };
      }
    }

    await place.save();
    return res.json(place);
  } catch (error) {
    console.error('Update place error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePlace = async (req, res) => {
  const { placeId } = req.params;
  
  try {
    const place = await Place.findOne({ user: req.user.id, _id: placeId });
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    await Place.deleteOne({ _id: placeId });
    return res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Delete place error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

