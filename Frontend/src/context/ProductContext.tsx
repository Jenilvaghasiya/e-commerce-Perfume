import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProducts as apiGetProducts, createProduct as apiCreateProduct, updateProductApi, deleteProductApi, Product as ApiProduct } from '../services/api';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  brand?: string;
  rating?: number;
  reviews?: number;
  createdAt?: string;
  notes?: {
    top?: string[];
    middle?: string[];
    base?: string[];
  };
  originalPrice?: number;
  discount?: number;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
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

function mapApiToProduct(p: ApiProduct): Product {
  return {
    id: (p as any)._id || (p as any).id,
    name: p.name,
    price: p.price as number,
    description: p.description,
    image: p.image,
    category: p.category as string,
    inStock: p.inStock,
    featured: p.featured,
    brand: p.brand,
    rating: (p as any).rating ?? 0,
    reviews: (p as any).reviews ?? 0,
    createdAt: (p as any).createdAt,
    notes: p.notes,
  };
}

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGetProducts();
        setProducts(data.map(mapApiToProduct));
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    // Prepare payload for API (no id)
    const { id, originalPrice, discount, ...payload } = { ...product } as any;
    const created = await apiCreateProduct(payload);
    setProducts(prev => [...prev, mapApiToProduct(created)]);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { originalPrice, discount, ...payload } = updates as any;
    const updated = await updateProductApi(id, payload);
    setProducts(prev => prev.map(p => (p.id === id ? mapApiToProduct(updated) : p)));
  };

  const deleteProduct = async (id: string) => {
    await deleteProductApi(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getFeaturedProducts = () => products.filter(p => p.featured);

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, getFeaturedProducts }}>
      {children}
    </ProductContext.Provider>
  );
};