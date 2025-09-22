'use strict';

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    // Optional: can be ObjectId for catalog products, or string for custom items
    productId: { type: mongoose.Schema.Types.Mixed, ref: 'Product', required: false },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
    customNotes: {
      top: String,
      middle: String,
      base: String,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ['card', 'online', 'cod'], required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Paid' },
    orderNumber: { type: String, unique: true },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    // Simple sequential number using timestamp; for production use a counter collection
    this.orderNumber = `ORD-${year}-${Math.floor(Date.now() / 1000)}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
