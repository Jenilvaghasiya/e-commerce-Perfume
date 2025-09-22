'use strict';

const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI, {
      dbName: process.env.DB_NAME || 'ecommerce',
    });

    console.log('MongoDB connected');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

module.exports = connectDB;
