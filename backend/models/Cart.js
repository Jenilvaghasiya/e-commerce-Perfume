const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    size: String,
    customNotes: {
      top: String,
      middle: String,
      base: String
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update totals before saving
cartSchema.pre('save', async function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.lastModified = new Date();
  
  // Calculate total price by populating products
  if (this.isModified('items')) {
    await this.populate('items.product');
    this.totalPrice = this.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }
  
  next();
});

// Remove empty carts
cartSchema.pre('save', function(next) {
  if (this.items.length === 0) {
    this.totalItems = 0;
    this.totalPrice = 0;
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);