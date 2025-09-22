'use strict';

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueAgg] = await Promise.all([
      User.countDocuments({}),
      Product.countDocuments({}),
      Order.countDocuments({}),
      Order.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({ totalUsers, totalProducts, totalOrders, totalRevenue });
  } catch (err) {
    console.error('Admin getStats error', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Admin listUsers error', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
