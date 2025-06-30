import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from './CartContext';
import { toast } from 'react-hot-toast';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  targetUrl?: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], targetUrl?: string) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = async (items: CartItem[], targetUrl?: string): Promise<string> => {
    const orderId = `ORD-${Date.now()}`;
    const totalAmount = items.reduce((total, item) => total + item.totalPrice, 0);
    
    const newOrder: Order = {
      id: orderId,
      userId: 'current-user', // Bu gerçek uygulamada auth context'ten gelecek
      items,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      targetUrl
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Simulate order processing
    setTimeout(() => {
      updateOrderStatus(orderId, 'processing');
      toast.success('Siparişiniz işleme alındı!');
      
      // Simulate completion after 30 seconds
      setTimeout(() => {
        updateOrderStatus(orderId, 'completed');
        toast.success('Siparişiniz tamamlandı!');
      }, 30000);
    }, 2000);

    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : order.completedAt
          }
        : order
    ));
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      getOrderById,
      getUserOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};