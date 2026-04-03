const express = require('express');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/authMiddleware');
const { upload, uploadToCloudinary, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// GET /api/vehicles — liste avec filtres
router.get('/', async (req, res) => {
  try {
    const { type, brand, fuel, gearbox, minPrice, maxPrice, minYear, maxYear, page = 1, limit = 12 } = req.query;
    const query = { available: true };

    if (type) query.type = type;
    if (brand) query.brand = new RegExp(brand, 'i');
    if (fuel) query.fuel = fuel;
    if (gearbox) query.gearbox = gearbox;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = Number(minYear);
      if (maxYear) query.year.$lte = Number(maxYear);
    }

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ vehicles, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/vehicles/brands
router.get('/brands', async (req, res) => {
  try {
    const brands = await Vehicle.distinct('brand', { available: true });
    res.json(brands.sort());
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/vehicles/recent
router.get('/recent', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ available: true }).sort({ createdAt: -1 }).limit(6);
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/vehicles/:id
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Véhicule introuvable' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/vehicles — ajouter (admin)
router.post('/', auth, upload.array('photos', 10), async (req, res) => {
  try {
    const photos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        photos.push(url);
      }
    }
    const features = req.body.features ? JSON.parse(req.body.features) : [];
    const vehicle = new Vehicle({
      ...req.body,
      photos,
      features,
      negotiable: req.body.negotiable === 'true',
    });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/vehicles/:id — modifier (admin)
router.put('/:id', auth, upload.array('photos', 10), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Véhicule introuvable' });

    const newPhotos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        newPhotos.push(url);
      }
    }
    const keepPhotos = req.body.keepPhotos ? JSON.parse(req.body.keepPhotos) : vehicle.photos;
    const features = req.body.features ? JSON.parse(req.body.features) : vehicle.features;

    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { ...req.body, photos: [...keepPhotos, ...newPhotos], features, negotiable: req.body.negotiable === 'true' },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/vehicles/:id (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Véhicule introuvable' });

    for (const url of vehicle.photos) {
      try {
        const publicId = url.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, '');
        await cloudinary.uploader.destroy(publicId);
      } catch (_) {}
    }
    res.json({ message: 'Véhicule supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
