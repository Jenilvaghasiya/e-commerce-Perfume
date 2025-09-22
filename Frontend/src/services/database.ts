// Database service layer for MongoDB integration
// This file contains the structure for MongoDB operations

interface DatabaseConfig {
  connectionString: string;
  databaseName: string;
}

// MongoDB Collections Structure
export interface UserDocument {
  _id?: string;
  name: string;
  email: string;
  password: string; // hashed
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    phone?: string;
    address?: string;
    city?: string;
    zipCode?: string;
  };
}

export interface ProductDocument {
  _id?: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  ingredients?: {
    top: string[];
    middle: string[];
    base: string[];
  };
}

export interface OrderDocument {
  _id?: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    customNotes?: {
      top: string;
      middle: string;
      base: string;
    };
  }>;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartDocument {
  _id?: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    customNotes?: {
      top: string;
      middle: string;
      base: string;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Database service class
export class DatabaseService {
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  // User operations
  async createUser(userData: Omit<UserDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<UserDocument> {
    // Implementation would connect to MongoDB and create user
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    // Implementation would query MongoDB for user by email
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  async updateUser(userId: string, updates: Partial<UserDocument>): Promise<UserDocument> {
    // Implementation would update user in MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  // Product operations
  async createProduct(productData: Omit<ProductDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<ProductDocument> {
    // Implementation would create product in MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  async getProducts(filters?: { category?: string; featured?: boolean }): Promise<ProductDocument[]> {
    // Implementation would query products from MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  async updateProduct(productId: string, updates: Partial<ProductDocument>): Promise<ProductDocument> {
    // Implementation would update product in MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  async deleteProduct(productId: string): Promise<boolean> {
    // Implementation would delete product from MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  // Order operations
  async createOrder(orderData: Omit<OrderDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<OrderDocument> {
    // Implementation would create order in MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  async getOrdersByUser(userId: string): Promise<OrderDocument[]> {
    // Implementation would query user orders from MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  async getAllOrders(): Promise<OrderDocument[]> {
    // Implementation would query all orders from MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  async updateOrderStatus(orderId: string, status: OrderDocument['status']): Promise<OrderDocument> {
    // Implementation would update order status in MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  // Cart operations
  async getCart(userId: string): Promise<CartDocument | null> {
    // Implementation would get user cart from MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  async updateCart(userId: string, items: CartDocument['items']): Promise<CartDocument> {
    // Implementation would update cart in MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }

  async clearCart(userId: string): Promise<boolean> {
    // Implementation would clear user cart in MongoDB
    throw new Error('MongoDB connection not implemented. Please set up MongoDB Atlas or use Supabase.');
  }
}

// Example usage and configuration
export const createDatabaseService = (connectionString: string) => {
  const config: DatabaseConfig = {
    connectionString,
    databaseName: 'ignite_perfume'
  };
  
  return new DatabaseService(config);
};

// For MongoDB Atlas integration, you would use:
// const dbService = createDatabaseService('mongodb+srv://username:password@cluster.mongodb.net/');

// Alternative: Supabase integration (recommended for this environment)
export const setupSupabaseIntegration = () => {
  console.log(`
    To integrate with a database, I recommend using Supabase instead of MongoDB for this environment.
    
    Steps to set up Supabase:
    1. Go to https://supabase.com and create a new project
    2. Get your project URL and anon key
    3. Click the "Connect to Supabase" button in the top right of this interface
    4. I'll then set up the database schema and integrate it with your app
    
    Supabase provides:
    - PostgreSQL database (more suitable for this environment)
    - Real-time subscriptions
    - Built-in authentication
    - REST API
    - Easy integration with React
  `);
};