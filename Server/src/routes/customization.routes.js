'use strict';

const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { createCustomization, getMyCustomizations } = require('../controllers/customization.controller');

router.post('/', protect, createCustomization);
router.get('/me', protect, getMyCustomizations);

module.exports = router;
