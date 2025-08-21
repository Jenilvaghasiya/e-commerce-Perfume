import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CustomizePage from './pages/CustomizePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import OrdersPage from './pages/OrdersPage';

// Loading component
const LoadingScreen = () => (
  <motion.div
    className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center z-50"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center">
      <motion.div
        className="w-20 h-20 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.h2
        className="text-2xl font-bold text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Ignite Perfume
      </motion.h2>
      <motion.p
        className="text-purple-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Loading your fragrance experience...
      </motion.p>
    </div>
  </motion.div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <OrderProvider>
            <Router>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <LoadingScreen key="loading" />
                ) : (
                  <motion.div
                    key="app"
                    className="min-h-screen bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Navbar />
                    <main>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/customize" element={<CustomizePage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                      </Routes>
                    </main>
                    <Footer />
                  </motion.div>
                )}
              </AnimatePresence>
            </Router>
          </OrderProvider>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;