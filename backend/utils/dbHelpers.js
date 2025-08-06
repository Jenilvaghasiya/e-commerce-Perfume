const mongoose = require('mongoose');

// Database helper functions
const dbHelpers = {
  // Check if MongoDB is connected
  isConnected: () => {
    return mongoose.connection.readyState === 1;
  },

  // Get connection status
  getConnectionStatus: () => {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[mongoose.connection.readyState] || 'unknown';
  },

  // Get database info
  getDatabaseInfo: async () => {
    try {
      if (!dbHelpers.isConnected()) {
        throw new Error('Database not connected');
      }

      const admin = mongoose.connection.db.admin();
      const info = await admin.serverStatus();
      
      return {
        host: info.host,
        version: info.version,
        uptime: info.uptime,
        connections: info.connections
      };
    } catch (error) {
      console.error('Error getting database info:', error);
      return null;
    }
  },

  // List all collections
  listCollections: async () => {
    try {
      if (!dbHelpers.isConnected()) {
        throw new Error('Database not connected');
      }

      const collections = await mongoose.connection.db.listCollections().toArray();
      return collections.map(col => ({
        name: col.name,
        type: col.type
      }));
    } catch (error) {
      console.error('Error listing collections:', error);
      return [];
    }
  },

  // Get collection stats
  getCollectionStats: async (collectionName) => {
    try {
      if (!dbHelpers.isConnected()) {
        throw new Error('Database not connected');
      }

      const stats = await mongoose.connection.db.collection(collectionName).stats();
      return {
        count: stats.count,
        size: stats.size,
        avgObjSize: stats.avgObjSize,
        storageSize: stats.storageSize
      };
    } catch (error) {
      console.error(`Error getting stats for ${collectionName}:`, error);
      return null;
    }
  },

  // Create indexes for better performance
  createIndexes: async () => {
    try {
      console.log('🔍 Creating database indexes...');

      // User indexes
      await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
      await mongoose.connection.db.collection('users').createIndex({ role: 1 });

      // Product indexes
      await mongoose.connection.db.collection('products').createIndex({ name: 'text', description: 'text' });
      await mongoose.connection.db.collection('products').createIndex({ category: 1 });
      await mongoose.connection.db.collection('products').createIndex({ featured: 1 });
      await mongoose.connection.db.collection('products').createIndex({ price: 1 });

      // Order indexes
      await mongoose.connection.db.collection('orders').createIndex({ user: 1 });
      await mongoose.connection.db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
      await mongoose.connection.db.collection('orders').createIndex({ status: 1 });
      await mongoose.connection.db.collection('orders').createIndex({ createdAt: -1 });

      // Cart indexes
      await mongoose.connection.db.collection('carts').createIndex({ user: 1 }, { unique: true });

      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error);
    }
  }
};

module.exports = dbHelpers;