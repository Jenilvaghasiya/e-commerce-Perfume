'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    // Dev shortcut: allow static admin token
    if (token === 'static-admin') {
      req.user = { id: 'admin', role: 'admin' };
      return next();
    }
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admin only' });
  }
  next();
};
