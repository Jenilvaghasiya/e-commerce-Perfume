'use strict';

exports.healthCheck = (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: {
      node: process.version,
    },
  });
};
