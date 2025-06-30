import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface CartItem {
  id: string;
  platform: string;
  serviceName: string;
  category: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'id' | 'totalPrice'>) => {
    const id = `${item.platform}-${item.serviceName}-${item.quantity}`;
    const existingItem = items.find(cartItem => 
      cartItem.platform === item.platform && 
      cartItem.serviceName === item.serviceName &&
      cartItem.quantity === item.quantity
    );

    if (existingItem) {
      toast.info('Bu ürün zaten sepetinizde mevcut');
      return;
    }

    const newItem: CartItem = {
      ...item,
      id,
      totalPrice: item.price
    };

    setItems(prev => [...prev, newItem]);
    toast.success('Ürün sepete eklendi!');
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success('Ürün sepetten kaldırıldı');
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity, totalPrice: item.price }
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Sepet temizlendi');
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return items.length;
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};