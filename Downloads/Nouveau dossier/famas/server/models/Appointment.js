const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null },
    vehicleTitle: { type: String, default: '' },
    date: { type: Date, required: true },
    message: { type: String, default: '' },
    status: { type: String, enum: ['en attente', 'confirmé', 'annulé'], default: 'en attente' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
