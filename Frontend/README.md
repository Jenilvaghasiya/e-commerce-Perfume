# Ignite Perfume E-commerce Website

A comprehensive e-commerce platform for custom perfume creation and sales, built with React, TypeScript, and Tailwind CSS.

## Features

### User Features
- **Custom Perfume Builder**: Create personalized fragrances with top, middle, and base notes
- **Product Catalog**: Browse and filter perfumes by category
- **Shopping Cart**: Add products and manage quantities
- **Checkout System**: Multiple payment methods (Cash on Delivery, Debit Card, Online Payment)
- **Order Tracking**: View order history and track shipments
- **User Authentication**: Secure login and registration
- **Responsive Design**: Optimized for all devices

### Admin Features
- **Dashboard**: Overview of sales, orders, and users
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order statuses
- **User Management**: View customer information
- **Analytics**: Sales and performance metrics

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations

## Database Integration

### Current Implementation
The application currently uses local state management with Context API for data persistence. All data is stored in browser localStorage.

### MongoDB Integration Setup

To integrate with MongoDB, follow these steps:

#### Option 1: MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster and database
3. Get your connection string
4. Set up a backend API (Node.js/Express) to handle database operations
5. Update the database service in `src/services/database.ts`

#### Option 2: Supabase (Alternative - Easier Setup)
1. Go to https://supabase.com and create a new project
2. Click "Connect to Supabase" in the top right of the interface
3. The database schema will be automatically set up

### Database Schema

The application is designed with the following collections:

- **Users**: User accounts and profiles
- **Products**: Perfume catalog
- **Orders**: Purchase history and tracking
- **Carts**: Shopping cart persistence

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Demo Credentials

### Admin Access
- Email: admin@ignite.com
- Password: admin123

### User Access
- Email: user@example.com
- Password: user123

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
├── pages/              # Page components
├── services/           # Database and API services
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Key Features Implementation

### Custom Perfume Builder
- Interactive note selection interface
- Real-time price calculation
- 3D bottle preview
- Custom naming system

### Shopping Experience
- Advanced product filtering
- Wishlist functionality
- Cart persistence
- Multiple payment options

### Admin Dashboard
- Real-time analytics
- Order management system
- Product inventory control
- User management tools

## Deployment

The application is configured for deployment on Netlify and other static hosting platforms.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.