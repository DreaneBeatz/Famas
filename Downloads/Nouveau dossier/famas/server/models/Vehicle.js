const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: { type: Number, default: 0 },
    fuel: {
      type: String,
      enum: ['Essence', 'Diesel', 'Hybride', 'Électrique'],
      required: true,
    },
    gearbox: { type: String, enum: ['Manuelle', 'Automatique'], required: true },
    type: { type: String, enum: ['neuf', 'occasion'], required: true },
    price: { type: Number, required: true },
    negotiable: { type: Boolean, default: false },
    photos: [{ type: String }],
    description: { type: String, default: '' },
    features: [{ type: String }],
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
