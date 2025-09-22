'use strict';

const Customization = require('../models/Customization');

exports.createCustomization = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, notes, concentration, bottleSize, totalPrice } = req.body;
    if (!name || !notes || !concentration || !bottleSize || totalPrice == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const created = await Customization.create({
      userId,
      name,
      notes,
      concentration,
      bottleSize,
      totalPrice,
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error('createCustomization error', err);
    return res.status(500).json({ message: 'Failed to save customization' });
  }
};

exports.getMyCustomizations = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const list = await Customization.find({ userId }).sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    console.error('getMyCustomizations error', err);
    return res.status(500).json({ message: 'Failed to get customizations' });
  }
};

// Admin: list all customizations
exports.getAllCustomizations = async (req, res) => {
  try {
    // Auth and admin check are enforced at the route level
    const list = await Customization.find({}).sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    console.error('getAllCustomizations error', err);
    return res.status(500).json({ message: 'Failed to get customizations' });
  }
};

