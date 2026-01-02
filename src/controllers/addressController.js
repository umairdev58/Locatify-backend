const Address = require('../models/Address');
const generatePublicCode = require('../utils/publicCode');
const { uploadFiles } = require('../utils/cloudinary');

const ensureUniqueCode = async () => {
  let code;
  let exists;
  do {
    code = generatePublicCode();
    exists = await Address.findOne({ publicCode: code });
  } while (exists);
  return code;
};

const parseLocation = (input) => {
  if (!input) return null;
  if (typeof input === 'string') {
    try {
      return JSON.parse(input);
    } catch (error) {
      console.warn('Invalid location payload, falling back to raw object');
    }
  }
  return input;
};

const buildHouseImageFiles = (req) => {
  if (Array.isArray(req.files) && req.files.length) {
    return req.files;
  }

  const rawImages = Array.isArray(req.body.houseImages) ? req.body.houseImages : [];
  return rawImages
    .map((image) => {
      if (!image || typeof image.base64 !== 'string') return null;
      return {
        originalname: image.name ?? 'house-image.jpg',
        buffer: Buffer.from(image.base64, 'base64'),
        mimetype: image.type ?? 'image/jpeg',
      };
    })
    .filter(Boolean);
};

exports.saveAddress = async (req, res) => {
  const { fullTextAddress, location, cardName } = req.body;
  if (!fullTextAddress || !location) {
    return res.status(400).json({ message: 'Address and location are required' });
  }

  const locationObj = parseLocation(location);
  if (!locationObj || typeof locationObj.latitude !== 'number' || typeof locationObj.longitude !== 'number') {
    return res.status(400).json({ message: 'Location payload malformed' });
  }

  try {
    const publicCode = await ensureUniqueCode();
    const imageUrls = await uploadFiles(buildHouseImageFiles(req));

    const address = await Address.create({
      user: req.user.id,
      fullTextAddress,
      cardName: cardName ?? 'My card',
      location: {
        latitude: locationObj.latitude,
        longitude: locationObj.longitude
      },
      houseImages: imageUrls,
      publicCode
    });

    return res.status(201).json(address);
  } catch (error) {
    console.error('Save address error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(addresses);
  } catch (error) {
    console.error('Fetch address error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAddress = async (req, res) => {
  const { fullTextAddress, location, cardName, addressId } = req.body;
  const locationObj = parseLocation(location);

  if (location && (!locationObj || typeof locationObj.latitude !== 'number' || typeof locationObj.longitude !== 'number')) {
    return res.status(400).json({ message: 'Invalid location payload' });
  }

  try {
    const address = await Address.findOne({ user: req.user.id, _id: addressId });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (fullTextAddress) {
      address.fullTextAddress = fullTextAddress;
    }
    if (cardName) {
      address.cardName = cardName;
    }

    if (locationObj) {
      address.location = {
        latitude: locationObj.latitude,
        longitude: locationObj.longitude
      };
    }

    const newImages = await uploadFiles(buildHouseImageFiles(req));
    if (newImages.length) {
      address.houseImages = [...address.houseImages, ...newImages];
    }

    await address.save();
    return res.json(address);
  } catch (error) {
    console.error('Update address error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyAddresses = exports.getMyAddress;

exports.getByPublicCode = async (req, res) => {
  const { publicCode } = req.params;
  try {
    const address = await Address.findOne({ publicCode });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    return res.json(address);
  } catch (error) {
    console.error('Fetch public code error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
