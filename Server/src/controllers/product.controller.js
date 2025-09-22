'use strict';

const Product = require('../models/Product');

exports.list = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('List products error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, price, description, image, category, inStock, featured, brand, notes } = req.body;
    if (!name || price == null || !description || !image) {
      return res.status(400).json({ message: 'name, price, description and image are required' });
    }
    const product = await Product.create({ name, price, description, image, category, inStock, featured, brand, notes });
    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Update product error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete product error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
