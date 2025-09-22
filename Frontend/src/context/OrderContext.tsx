import React, { createContext, useContext, useState } from 'react';
import { createOrder, type CreateOrderPayload, type OrderResponse, getAllOrders as apiGetAllOrders, updateOrderStatusApi } from '../services/api';

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
  email?: string;
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
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date'>, email: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getUserOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];
  refreshAllOrders: () => Promise<void>;
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
  const [orders, setOrders] = useState<Order[]>([]);

  const mapApiOrder = (o: OrderResponse): Order => ({
    id: (o as any)._id,
    orderNumber: o.orderNumber,
    date: o.createdAt?.split('T')[0] || new Date(o.createdAt).toISOString().split('T')[0],
    status: o.status as Order['status'],
    total: o.total,
    userId: (o as any).userId,
    email: (o as any).email,
    items: o.items.map((it) => ({
      id: (it as any).productId || '',
      name: it.name,
      price: it.price,
      quantity: it.quantity,
      image: (it as any).image || '',
      customNotes: it.customNotes as any,
    })),
    shippingAddress: o.shippingAddress,
    paymentMethod: o.paymentMethod,
    trackingNumber: o.trackingNumber,
  });

  const addOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>, email: string) => {
    const payload: CreateOrderPayload = {
      email,
      items: orderData.items.map((it) => ({
        productId: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
        customNotes: it.customNotes,
      })),
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod as any,
      status: orderData.status,
      paymentStatus: 'Paid',
    };

    // Ensure email is set by caller; fallback not set here
    const created = await createOrder(payload);
    setOrders((prev) => [mapApiOrder(created), ...prev]);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const updated = await updateOrderStatusApi(orderId, status);
    setOrders(prev => prev.map(order => (order.id === orderId ? mapApiOrder(updated) : order)));
  };

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return orders;
  };

  const refreshAllOrders = async () => {
    const list = await apiGetAllOrders();
    setOrders(list.map(mapApiOrder));
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getUserOrders,
      getAllOrders,
      refreshAllOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};