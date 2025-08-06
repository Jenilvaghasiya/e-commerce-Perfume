const express = require('express');
const { protect, admin } = require('../middleware/auth');
const dbHelpers = require('../utils/dbHelpers');

const router = express.Router();

// @route   GET /api/database/status
// @desc    Get database connection status
// @access  Private/Admin
router.get('/status', protect, admin, async (req, res) => {
  try {
    const status = dbHelpers.getConnectionStatus();
    const isConnected = dbHelpers.isConnected();
    const info = await dbHelpers.getDatabaseInfo();
    const collections = await dbHelpers.listCollections();

    res.json({
      success: true,
      data: {
        status,
        isConnected,
        info,
        collections,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting database status'
    });
  }
});

// @route   GET /api/database/collections/:name/stats
// @desc    Get collection statistics
// @access  Private/Admin
router.get('/collections/:name/stats', protect, admin, async (req, res) => {
  try {
    const { name } = req.params;
    const stats = await dbHelpers.getCollectionStats(name);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found or error getting stats'
      });
    }

    res.json({
      success: true,
      data: {
        collection: name,
        stats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Collection stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting collection statistics'
    });
  }
});

// @route   POST /api/database/indexes
// @desc    Create database indexes
// @access  Private/Admin
router.post('/indexes', protect, admin, async (req, res) => {
  try {
    await dbHelpers.createIndexes();

    res.json({
      success: true,
      message: 'Database indexes created successfully'
    });
  } catch (error) {
    console.error('Create indexes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating database indexes'
    });
  }
});

module.exports = router;