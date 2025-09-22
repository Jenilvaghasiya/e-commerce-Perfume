import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 space-y-2">
          <button className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all duration-200 transform hover:scale-110">
            <Heart className="w-5 h-5 text-gray-700 hover:text-red-500" />
          </button>
        </div>
        {product.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-purple-600 font-medium">{product.category}</span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
          {product.name}
        </h3>

        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              product.inStock
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;