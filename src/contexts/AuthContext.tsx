import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  avatar?: string;
  role?: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Şifre güvenlik kuralları
const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false
};

// E-posta doğrulama
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Şifre doğrulama
const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`Şifre en az ${PASSWORD_RULES.minLength} karakter olmalıdır`);
  }
  
  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Şifre en az bir büyük harf içermelidir');
  }
  
  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Şifre en az bir küçük harf içermelidir');
  }
  
  if (PASSWORD_RULES.requireNumbers && !/\d/.test(password)) {
    errors.push('Şifre en az bir rakam içermelidir');
  }
  
  if (PASSWORD_RULES.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Şifre en az bir özel karakter içermelidir');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// İsim doğrulama
const validateName = (name: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (name.trim().length < 2) {
    errors.push('Ad soyad en az 2 karakter olmalıdır');
  }
  
  if (name.trim().length > 50) {
    errors.push('Ad soyad en fazla 50 karakter olabilir');
  }
  
  if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(name.trim())) {
    errors.push('Ad soyad sadece harf ve boşluk içerebilir');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    return saved && token ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Kullanıcı veritabanı simülasyonu
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('registeredUsers');
    const defaultUsers = [
      {
        id: 'admin1',
        name: 'Engin Keskin',
        email: 'enginkeskin@garantitakipcim.com',
        balance: 999999.99,
        role: 'admin' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        isActive: true
      },
      {
        id: 'admin2',
        name: 'Berk Taha Keskin',
        email: 'berktahakeskin@garantitakipcim.com',
        balance: 999999.99,
        role: 'admin' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        isActive: true
      },
      {
        id: 'admin3',
        name: 'Ömer Emir Erdoğan',
        email: 'omeremirerdogan@garantitakipcim.com',
        balance: 999999.99,
        role: 'admin' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        isActive: true
      },
      // Eski admin hesabı (geriye dönük uyumluluk için)
      {
        id: 'admin_legacy',
        name: 'Emir Erdoğan',
        email: 'omeremirerdogan4@gmail.com',
        balance: 999999.99,
        role: 'admin' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        isActive: true
      }
    ];
    return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
  });

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', `token_${user.id}_${Date.now()}`);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Giriş doğrulamaları
      if (!email.trim()) {
        throw new Error('E-posta adresi gerekli');
      }
      
      if (!validateEmail(email.trim())) {
        throw new Error('Geçerli bir e-posta adresi girin');
      }
      
      if (!password.trim()) {
        throw new Error('Şifre gerekli');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Kullanıcıyı kayıtlı kullanıcılar arasında ara
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      
      if (!foundUser) {
        throw new Error('Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı');
      }

      if (!foundUser.isActive) {
        throw new Error('Hesabınız devre dışı bırakılmış. Lütfen destek ile iletişime geçin');
      }

      // Admin şifre kontrolü
      const validPasswords: { [key: string]: string } = {
        'enginkeskin@garantitakipcim.com': 'EnginKeskin1.',
        'berktahakeskin@garantitakipcim.com': 'BerkTahaKeskin1.',
        'omeremirerdogan@garantitakipcim.com': 'Emir4474',
        'omeremirerdogan4@gmail.com': 'Emir4474' // Eski hesap
      };

      const expectedPassword = validPasswords[email.toLowerCase().trim()];
      if (expectedPassword && password !== expectedPassword) {
        throw new Error('Şifre hatalı');
      }

      // Normal kullanıcı için şifre kontrolü (basit simülasyon)
      if (!expectedPassword && foundUser.role !== 'admin') {
        // Normal kullanıcılar için şifre kontrolü burada yapılabilir
        // Şu an için basit kontrol
        if (password.length < 6) {
          throw new Error('Şifre hatalı');
        }
      }

      // Son giriş zamanını güncelle
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };

      // Kullanıcıları güncelle
      setUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
      setUser(updatedUser);
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // İsim doğrulaması
      const nameValidation = validateName(name);
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.errors[0]);
      }
      
      // E-posta doğrulaması
      if (!email.trim()) {
        throw new Error('E-posta adresi gerekli');
      }
      
      if (!validateEmail(email.trim())) {
        throw new Error('Geçerli bir e-posta adresi girin');
      }
      
      // Şifre doğrulaması
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // E-posta kontrolü
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (existingUser) {
        throw new Error('Bu e-posta adresi zaten kayıtlı');
      }

      // Yeni kullanıcı oluştur
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        balance: 0,
        role: 'user',
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // Kullanıcıyı kaydet
      setUsers(prev => [...prev, newUser]);
      setUser(newUser);
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success('Başarıyla çıkış yaptınız');
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount };
      setUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateBalance, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};