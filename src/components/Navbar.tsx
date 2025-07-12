import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Heart, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ignite Perfume
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              Home
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              Shop
            </Link>
            <Link to="/customize" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              Customize
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
                Admin
              </Link>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
            
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200">
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md">
              Home
            </Link>
            <Link to="/shop" className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md">
              Shop
            </Link>
            <Link to="/customize" className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md">
              Customize
            </Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md">
              About
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md">
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md">
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;