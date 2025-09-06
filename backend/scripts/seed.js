const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models
const User = require('../models/User');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-commerce-Perfume', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@ignite.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      emailVerified: true
    });

    // Create regular user
    const regularUser = new User({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      isActive: true,
      emailVerified: true,
      profile: {
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        }
      }
    });

    await adminUser.save();
    await regularUser.save();

    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    const products = [
      {
        name: 'Midnight Essence',
        description: 'A mysterious and alluring fragrance with deep woody notes and hints of vanilla. Perfect for evening wear.',
        price: 89.99,
        category: 'Unisex',
        images: [{
          url: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
          alt: 'Midnight Essence Perfume',
          isPrimary: true
        }],
        ingredients: {
          top: [
            { name: 'Bergamot', percentage: 30 },
            { name: 'Lemon', percentage: 20 }
          ],
          middle: [
            { name: 'Rose', percentage: 40 },
            { name: 'Jasmine', percentage: 30 }
          ],
          base: [
            { name: 'Sandalwood', percentage: 50 },
            { name: 'Vanilla', percentage: 30 }
          ]
        },
        stock: 50,
        featured: true,
        isActive: true,
        rating: { average: 4.5, count: 25 }
      },
      {
        name: 'Rose Garden',
        description: 'Elegant floral scent with fresh rose petals and jasmine. A timeless feminine fragrance.',
        price: 79.99,
        category: 'Women',
        images: [{
          url: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
          alt: 'Rose Garden Perfume',
          isPrimary: true
        }],
        ingredients: {
          top: [
            { name: 'Rose Petals', percentage: 40 },
            { name: 'Peony', percentage: 30 }
          ],
          middle: [
            { name: 'Jasmine', percentage: 50 },
            { name: 'Lily', percentage: 25 }
          ],
          base: [
            { name: 'White Musk', percentage: 40 },
            { name: 'Cedar', percentage: 30 }
          ]
        },
        stock: 35,
        featured: true,
        isActive: true,
        rating: { average: 4.7, count: 18 }
      },
      {
        name: 'Ocean Breeze',
        description: 'Fresh aquatic fragrance with citrus and marine notes. Invigorating and refreshing.',
        price: 94.99,
        category: 'Men',
        images: [{
          url: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
          alt: 'Ocean Breeze Perfume',
          isPrimary: true
        }],
        ingredients: {
          top: [
            { name: 'Sea Salt', percentage: 35 },
            { name: 'Citrus', percentage: 30 }
          ],
          middle: [
            { name: 'Marine Notes', percentage: 45 },
            { name: 'Lavender', percentage: 25 }
          ],
          base: [
            { name: 'Driftwood', percentage: 40 },
            { name: 'Amber', percentage: 35 }
          ]
        },
        stock: 42,
        featured: false,
        isActive: true,
        rating: { average: 4.3, count: 12 }
      },
      {
        name: 'Vanilla Dreams',
        description: 'Warm and comforting vanilla with hints of caramel and soft spices.',
        price: 69.99,
        category: 'Women',
        images: [{
          url: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
          alt: 'Vanilla Dreams Perfume',
          isPrimary: true
        }],
        ingredients: {
          top: [
            { name: 'Sweet Orange', percentage: 30 },
            { name: 'Pink Pepper', percentage: 20 }
          ],
          middle: [
            { name: 'Vanilla Orchid', percentage: 50 },
            { name: 'Caramel', percentage: 25 }
          ],
          base: [
            { name: 'Vanilla Bean', percentage: 60 },
            { name: 'Tonka Bean', percentage: 25 }
          ]
        },
        stock: 28,
        featured: true,
        isActive: true,
        rating: { average: 4.6, count: 22 }
      }
    ];

    await Product.insertMany(products);
    console.log('✅ Products seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};

const seedDatabase = async () => {
  await connectDB();
  await seedUsers();
  await seedProducts();
  console.log('🎉 Database seeding completed!');
  process.exit(0);
};

seedDatabase();