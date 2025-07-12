import React, { createContext, useContext, useState } from 'react';

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
    description: 'A mysterious and alluring fragrance with deep woody notes',
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
    category: 'Unisex',
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Rose Garden',
    price: 79.99,
    description: 'Elegant floral scent with fresh rose petals and jasmine',
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
    category: 'Women',
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Ocean Breeze',
    price: 94.99,
    description: 'Fresh aquatic fragrance with citrus and marine notes',
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
    category: 'Men',
    inStock: true,
    featured: false
  },
  {
    id: '4',
    name: 'Vanilla Dreams',
    price: 69.99,
    description: 'Warm and comforting vanilla with hints of caramel',
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
    category: 'Women',
    inStock: true,
    featured: true
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