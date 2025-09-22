'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const healthRouter = require('./routes/health.routes');
const authRouter = require('./routes/auth.routes');
const productRouter = require('./routes/product.routes');
const orderRouter = require('./routes/order.routes');
const customizationRouter = require('./routes/customization.routes');
const adminRouter = require('./routes/admin.routes');

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/customizations', customizationRouter);
app.use('/api/admin', adminRouter);

// Base route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API running' });
});

module.exports = app;
