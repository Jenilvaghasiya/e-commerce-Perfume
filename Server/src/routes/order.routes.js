'use strict';

const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/order.controller');

// Create an order (authenticated)
router.post('/', protect, controller.createOrder);

// Get orders for current user
router.get('/me', protect, controller.getMyOrders);

// Admin: list all orders
router.get('/', protect, requireAdmin, controller.getAllOrders);

// Admin: update order status
router.put('/:id/status', protect, requireAdmin, controller.updateOrderStatus);

module.exports = router;
