const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Identifiants incorrects' });

    const valid = await admin.comparePassword(password);
    if (!valid) return res.status(401).json({ message: 'Identifiants incorrects' });

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/auth/setup — créer le premier admin (à désactiver après usage)
router.post('/setup', async (req, res) => {
  const existing = await Admin.countDocuments();
  if (existing > 0) return res.status(403).json({ message: 'Admin déjà configuré' });

  const { username, password } = req.body;
  const admin = new Admin({ username, password });
  await admin.save();
  res.json({ message: 'Admin créé avec succès' });
});

module.exports = router;
