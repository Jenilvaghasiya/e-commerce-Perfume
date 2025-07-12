const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: String,
    customNotes: {
      top: String,
      middle: String,
      base: String
    },
    image: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'online', 'cod'],
    required: true
  },
  paymentDetails: {
    stripePaymentIntentId: String,
    transactionId: String,
    last4: String,
    brand: String
  },
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    email: String,
    phone: String,
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: String,
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'United States'
    }
  },
  billingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    sameAsShipping: {
      type: Boolean,
      default: true
    }
  },
  tracking: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date
  },
  notes: String,
  customerNotes: String,
  refund: {
    amount: Number,
    reason: String,
    refundedAt: Date,
    refundId: String
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.orderNumber = `ORD-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Update payment status when order status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'Delivered') {
      this.paymentStatus = 'Paid';
      this.tracking.deliveredAt = new Date();
    } else if (this.status === 'Shipped' && !this.tracking.shippedAt) {
      this.tracking.shippedAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);