import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import IGBlack from '../IG BLACK.png';

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
    <nav className="bg-black shadow-lg sticky top-0 z-50 border-b border-neon-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={IGBlack} alt="Ignite Perfume logo" className="w-12 h-12 object-contain" />
            <span className="text-3xl font-bold text-white">
              Ignite Perfume
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-neon-blue transition-colors duration-200">
              Home
            </Link>
            <Link to="/shop" className="text-white hover:text-neon-blue transition-colors duration-200">
              Shop
            </Link>
            <Link to="/customize" className="text-white hover:text-neon-blue transition-colors duration-200">
              Customize
            </Link>
            <Link to="/about" className="text-white hover:text-neon-blue transition-colors duration-200">
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-neon-blue transition-colors duration-200">
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-white hover:text-neon-blue transition-colors duration-200">
                Admin
              </Link>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-white hover:text-neon-blue transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
            
            <Link to="/cart" className="relative p-2 text-white hover:text-neon-blue transition-colors duration-200">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center border border-gray-300">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-white hover:text-neon-blue transition-colors duration-200">
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-black border border-neon-blue rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                    Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-black px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-200 font-semibold">
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-neon-blue transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-neon-blue">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-white hover:text-neon-blue hover:bg-gray-800 rounded-md">
              Home
            </Link>
            <Link to="/shop" className="block px-3 py-2 text-white hover:text-neon-blue hover:bg-gray-800 rounded-md">
              Shop
            </Link>
            <Link to="/customize" className="block px-3 py-2 text-white hover:text-neon-blue hover:bg-gray-800 rounded-md">
              Customize
            </Link>
            <Link to="/about" className="block px-3 py-2 text-white hover:text-neon-blue hover:bg-gray-800 rounded-md">
              About
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-white hover:text-neon-blue hover:bg-gray-800 rounded-md">
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className="block px-3 py-2 text-white hover:text-neon-blue hover:bg-gray-800 rounded-md">
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