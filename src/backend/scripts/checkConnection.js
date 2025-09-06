const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const checkConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📍 Connection String:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log('✅ MongoDB Connection Successful!');
    console.log('🏠 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    console.log('🔌 Port:', conn.connection.port);
    console.log('📈 Ready State:', conn.connection.readyState);

    // List existing collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📋 Collections:', collections.map(c => c.name));

    // Test basic operations
    console.log('\n🧪 Testing basic operations...');
    
    // Test write operation
    const testCollection = conn.connection.db.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful' 
    });
    console.log('✅ Write operation successful');

    // Test read operation
    const testDoc = await testCollection.findOne({ test: true });
    console.log('✅ Read operation successful:', testDoc ? 'Document found' : 'No document');

    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('✅ Delete operation successful');

    console.log('\n🎉 All tests passed! MongoDB is ready to use.');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('1. Make sure MongoDB is running: mongod');
      console.error('2. Check if MongoDB service is started');
      console.error('3. Verify the connection string is correct');
      console.error('4. Check if port 27017 is available');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Connection closed');
    process.exit(0);
  }
};

checkConnection();