'use strict';

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    category: { type: String, enum: ['top', 'middle', 'base'], required: true },
    intensity: { type: Number },
    price: { type: Number },
  },
  { _id: false }
);

const customizationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    notes: {
      top: { type: [noteSchema], default: [] },
      middle: { type: [noteSchema], default: [] },
      base: { type: [noteSchema], default: [] },
    },
    concentration: { type: Number, required: true },
    bottleSize: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customization', customizationSchema);
