'use strict';

const { Router } = require('express');
const { list, create, update, remove } = require('../controllers/product.controller');
const { protect, requireAdmin } = require('../middleware/auth');

const router = Router();

// Public
router.get('/', list);

// Admin only
router.post('/', protect, requireAdmin, create);
router.put('/:id', protect, requireAdmin, update);
router.delete('/:id', protect, requireAdmin, remove);

module.exports = router;
