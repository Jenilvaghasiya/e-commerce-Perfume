'use strict';

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Unisex' },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    brand: { type: String, default: 'Ignite' },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    notes: {
      top: { type: [String], default: [] },
      middle: { type: [String], default: [] },
      base: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
