import React, { createContext, useContext, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  brand: string;
  rating: number;
  reviews: number;
  featured: boolean;
  discount?: number;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getFeaturedProducts: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Midnight Essence',
    price: 89.99,
    originalPrice: 99.99,
    description: 'A mysterious and alluring fragrance with deep woody notes',
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
    category: 'Unisex',
    inStock: true,
    brand: 'Ignite',
    rating: 4.8,
    reviews: 124,
    featured: true,
    discount: 10,
    notes: {
      top: ['Bergamot', 'Lemon'],
      middle: ['Lavender', 'Rose'],
      base: ['Sandalwood', 'Musk']
    }
  },
  {
    id: '2',
    name: 'Rose Garden',
    price: 79.99,
    description: 'Elegant floral scent with fresh rose petals and jasmine',
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
    category: 'Women',
    inStock: true,
    brand: 'Luxury',
    rating: 4.9,
    reviews: 89,
    featured: true,
    notes: {
      top: ['Rose', 'Jasmine'],
      middle: ['Peony', 'Lily'],
      base: ['White Musk', 'Cedar']
    }
  },
  {
    id: '3',
    name: 'Ocean Breeze',
    price: 94.99,
    description: 'Fresh aquatic fragrance with citrus and marine notes',
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
    category: 'Men',
    inStock: true,
    brand: 'Premium',
    rating: 4.6,
    reviews: 67,
    featured: false,
    notes: {
      top: ['Sea Salt', 'Citrus'],
      middle: ['Marine', 'Mint'],
      base: ['Driftwood', 'Amber']
    }
  },
  {
    id: '4',
    name: 'Vanilla Dreams',
    price: 69.99,
    originalPrice: 79.99,
    description: 'Warm and comforting vanilla with hints of caramel',
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
    category: 'Women',
    inStock: true,
    brand: 'Classic',
    rating: 4.7,
    reviews: 156,
    featured: true,
    discount: 12,
    notes: {
      top: ['Vanilla', 'Caramel'],
      middle: ['Honey', 'Cinnamon'],
      base: ['Tonka Bean', 'Sandalwood']
    }
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product =>
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getFeaturedProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};