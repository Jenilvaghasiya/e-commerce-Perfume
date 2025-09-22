'use strict';

const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const {
      email,
      items,
      total,
      status = 'Processing',
      shippingAddress,
      paymentMethod,
      paymentStatus = 'Paid',
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must include items' });
    }

    const order = await Order.create({
      userId,
      email,
      items,
      total,
      status,
      shippingAddress,
      paymentMethod,
      paymentStatus,
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error('createOrder error', err);
    return res.status(500).json({ message: 'Failed to create order' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error('getMyOrders error', err);
    return res.status(500).json({ message: 'Failed to get orders' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error('getAllOrders error', err);
    return res.status(500).json({ message: 'Failed to get orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (err) {
    console.error('updateOrderStatus error', err);
    return res.status(500).json({ message: 'Failed to update order' });
  }
};
