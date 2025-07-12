import React, { createContext, useContext, useState } from 'react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customNotes?: {
    top: string;
    middle: string;
    base: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  userId: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getUserOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([
    // Mock data - in real app this would come from MongoDB
    {
      id: '1',
      orderNumber: 'ORD-2025-001',
      date: '2025-01-15',
      status: 'Delivered',
      total: 169.98,
      userId: '2', // John Doe user ID
      items: [
        {
          id: '1',
          name: 'Midnight Essence',
          price: 89.99,
          quantity: 1,
          image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg'
        },
        {
          id: 'custom-1',
          name: 'My Signature Scent',
          price: 79.99,
          quantity: 1,
          image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
          customNotes: {
            top: 'Lemon',
            middle: 'Rose',
            base: 'Sandalwood'
          }
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'New York',
        zipCode: '10001',
        phone: '+1 (555) 123-4567'
      },
      paymentMethod: 'Credit Card',
      trackingNumber: 'TRK123456789'
    }
  ]);

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderNumber: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0]
    };
    
    setOrders(prev => [newOrder, ...prev]);
    
    // In real app, this would save to MongoDB
    // await saveOrderToMongoDB(newOrder);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
    
    // In real app, this would update MongoDB
    // await updateOrderInMongoDB(orderId, { status });
  };

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return orders;
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getUserOrders,
      getAllOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};