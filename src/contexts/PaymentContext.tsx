import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  paymentMethod: 'papara' | 'bank';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  adminNote?: string;
  receiptImage?: string;
}

interface PaymentContextType {
  paymentRequests: PaymentRequest[];
  createPaymentRequest: (amount: number, paymentMethod: 'papara' | 'bank') => Promise<string>;
  approvePayment: (requestId: string, adminNote?: string) => void;
  rejectPayment: (requestId: string, adminNote?: string) => void;
  getUserPaymentRequests: (userId: string) => PaymentRequest[];
  getPendingPaymentRequests: () => PaymentRequest[];
  getAllPaymentRequests: () => PaymentRequest[];
  updatePaymentRequest: (requestId: string, updates: Partial<PaymentRequest>) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => {
    const saved = localStorage.getItem('paymentRequests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('paymentRequests', JSON.stringify(paymentRequests));
    
    // Anlık bildirim sistemi - yeni ödeme talebi geldiğinde
    const pendingCount = paymentRequests.filter(req => req.status === 'pending').length;
    if (pendingCount > 0) {
      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Yeni Ödeme Talebi', {
          body: `${pendingCount} adet bekleyen ödeme talebi var`,
          icon: '/logo.svg'
        });
      }
    }
  }, [paymentRequests]);

  // Notification permission iste
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const createPaymentRequest = async (amount: number, paymentMethod: 'papara' | 'bank'): Promise<string> => {
    const requestId = `PAY-${Date.now()}`;
    
    // Kullanıcı bilgilerini al
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    const newRequest: PaymentRequest = {
      id: requestId,
      userId: currentUser.id || 'unknown',
      userName: currentUser.name || 'Bilinmeyen Kullanıcı',
      userEmail: currentUser.email || 'unknown@email.com',
      amount,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setPaymentRequests(prev => [newRequest, ...prev]);
    
    // Anlık bildirim gönder
    toast.success('Ödeme talebi oluşturuldu! Admin onayı bekleniyor.');
    
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Yeni Ödeme Talebi', {
        body: `${newRequest.userName} - ₺${amount} ${paymentMethod === 'papara' ? 'PAPARA' : 'Banka Havalesi'}`,
        icon: '/logo.svg'
      });
    }
    
    return requestId;
  };

  const approvePayment = (requestId: string, adminNote?: string) => {
    setPaymentRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: 'approved',
            approvedAt: new Date().toISOString(),
            adminNote
          }
        : request
    ));
    
    // Kullanıcının bakiyesini güncelle
    const request = paymentRequests.find(r => r.id === requestId);
    if (request) {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = users.map((user: any) => 
        user.id === request.userId 
          ? { ...user, balance: (user.balance || 0) + request.amount }
          : user
      );
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      // Mevcut kullanıcı ise bakiyesini güncelle
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id === request.userId) {
        const updatedCurrentUser = { ...currentUser, balance: (currentUser.balance || 0) + request.amount };
        localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
      }
    }
    
    toast.success('Ödeme onaylandı! Bakiye hesaba yansıtıldı.');
  };

  const rejectPayment = (requestId: string, adminNote?: string) => {
    setPaymentRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            adminNote
          }
        : request
    ));
    
    toast.error('Ödeme talebi reddedildi.');
  };

  const getUserPaymentRequests = (userId: string) => {
    return paymentRequests.filter(request => request.userId === userId);
  };

  const getPendingPaymentRequests = () => {
    return paymentRequests.filter(request => request.status === 'pending');
  };

  const getAllPaymentRequests = () => {
    return paymentRequests;
  };

  const updatePaymentRequest = (requestId: string, updates: Partial<PaymentRequest>) => {
    setPaymentRequests(prev => prev.map(request => 
      request.id === requestId ? { ...request, ...updates } : request
    ));
  };

  return (
    <PaymentContext.Provider value={{
      paymentRequests,
      createPaymentRequest,
      approvePayment,
      rejectPayment,
      getUserPaymentRequests,
      getPendingPaymentRequests,
      getAllPaymentRequests,
      updatePaymentRequest
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};