const express = require('express');
const Appointment = require('../models/Appointment');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// POST /api/appointments — créer un RDV
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, vehicleId, date, message } = req.body;
    let vehicleTitle = '';
    if (vehicleId) {
      const v = await Vehicle.findById(vehicleId);
      if (v) vehicleTitle = v.title;
    }
    const appointment = new Appointment({ name, phone, email, vehicleId: vehicleId || null, vehicleTitle, date, message });
    await appointment.save();
    res.status(201).json({ message: 'Rendez-vous enregistré avec succès' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/appointments — liste pour admin
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 }).populate('vehicleId', 'title brand model');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PATCH /api/appointments/:id/status — changer statut (admin)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/appointments/:id (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'RDV supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
