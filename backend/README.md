# Ignite Perfume Backend API

A comprehensive Node.js backend API for the Ignite Perfume e-commerce platform with MongoDB integration.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Password hashing with bcrypt
- Protected routes middleware

### 👥 User Management
- User registration and login
- Profile management
- Password change functionality
- Account deactivation
- User statistics and order history

### 🛍️ Product Management
- CRUD operations for products
- Product filtering and search
- Category-based organization
- Stock management
- Product reviews and ratings
- Featured products

### 🛒 Shopping Cart
- Add/remove items from cart
- Update quantities
- Cart persistence
- Stock validation

### 📦 Order Management
- Order creation and tracking
- Order status updates
- Payment method support
- Shipping address management
- Order cancellation
- Admin order management

### 👨‍💼 Admin Dashboard
- Sales analytics
- User management
- Order management
- Product management
- Dashboard statistics

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: bcryptjs for password hashing
- **CORS**: Cross-origin resource sharing enabled

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the backend directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ignite_perfume

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /profile` - Update user profile
- `POST /logout` - Logout user

### User Routes (`/api/users`)
- `GET /profile` - Get user profile with stats
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `DELETE /account` - Deactivate account
- `GET /orders` - Get user order history

### Product Routes (`/api/products`)
- `GET /` - Get all products (with filtering)
- `GET /featured` - Get featured products
- `GET /:id` - Get single product
- `POST /` - Create product (Admin)
- `PUT /:id` - Update product (Admin)
- `DELETE /:id` - Delete product (Admin)
- `POST /:id/reviews` - Add product review

### Cart Routes (`/api/cart`)
- `GET /` - Get user cart
- `POST /add` - Add item to cart
- `PUT /update/:itemId` - Update cart item
- `DELETE /remove/:itemId` - Remove item from cart
- `DELETE /clear` - Clear cart

### Order Routes (`/api/orders`)
- `GET /` - Get user orders
- `GET /:id` - Get single order
- `POST /` - Create new order
- `PUT /:id/status` - Update order status (Admin)
- `POST /:id/cancel` - Cancel order

### Admin Routes (`/api/admin`)
- `GET /dashboard` - Get dashboard data
- `GET /users` - Get all users
- `GET /orders` - Get all orders
- `PUT /users/:id/status` - Update user status
- `GET /analytics` - Get analytics data

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  profile: {
    phone: String,
    address: Object,
    dateOfBirth: Date,
    gender: String
  },
  preferences: {
    favoriteNotes: [String],
    skinType: String,
    newsletter: Boolean
  },
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  images: [Object],
  ingredients: {
    top: [Object],
    middle: [Object],
    base: [Object]
  },
  stock: Number,
  inStock: Boolean,
  featured: Boolean,
  rating: {
    average: Number,
    count: Number
  },
  reviews: [Object],
  timestamps: true
}
```

### Order Model
```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  items: [Object],
  total: Number,
  status: String,
  paymentMethod: String,
  shippingAddress: Object,
  tracking: Object,
  timestamps: true
}
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Express-validator for all inputs
- **CORS Protection**: Configured for frontend domain
- **Rate Limiting**: Can be added for production
- **Data Sanitization**: Mongoose built-in sanitization

## Error Handling

- Centralized error handling middleware
- Validation error responses
- MongoDB error handling
- Development vs production error messages

## Testing

```bash
npm test
```

## Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secret
- Configure MongoDB Atlas connection
- Set up email service
- Configure Stripe keys

### Recommended Hosting
- **Backend**: Heroku, DigitalOcean, AWS
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary, AWS S3

## API Documentation

The API follows RESTful conventions with consistent response formats:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.