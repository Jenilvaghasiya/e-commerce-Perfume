'use strict';

const { Router } = require('express');
const { protect, requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/admin.controller');
const customizationController = require('../controllers/customization.controller');

const router = Router();

router.get('/stats', protect, requireAdmin, controller.getStats);
router.get('/users', protect, requireAdmin, controller.listUsers);
router.get('/customizations', protect, requireAdmin, customizationController.getAllCustomizations);

module.exports = router;
