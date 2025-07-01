import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase, userOperations, User } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_CREDENTIALS = {
  'enginkeskin@garantitakipcim.com': 'EnginKeskin1.',
  'berktahakeskin@garantitakipcim.com': 'BerkTahaKeskin1.',
  'omeremirerdogan@garantitakipcim.com': 'Emir4474'
};

// Password validation
const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Şifre en az 8 karakter olmalıdır');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Şifre en az bir küçük harf içermelidir');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Şifre en az bir büyük harf içermelidir');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Şifre en az bir rakam içermelidir');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Name validation
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
      // Input validation
      if (!email.trim()) {
        throw new Error('E-posta adresi gerekli');
      }
      
      if (!validateEmail(email.trim())) {
        throw new Error('Geçerli bir e-posta adresi girin');
      }
      
      if (!password.trim()) {
        throw new Error('Şifre gerekli');
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if it's an admin login
      if (ADMIN_CREDENTIALS[normalizedEmail as keyof typeof ADMIN_CREDENTIALS]) {
        const expectedPassword = ADMIN_CREDENTIALS[normalizedEmail as keyof typeof ADMIN_CREDENTIALS];
        
        if (password !== expectedPassword) {
          throw new Error('Şifre hatalı');
        }

        // Check if admin user exists in database, if not create it
        let adminUser = await userOperations.getUserByEmail(normalizedEmail);
        
        if (!adminUser) {
          // Create admin user in database
          const adminName = normalizedEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          adminUser = await userOperations.createUser({
            email: normalizedEmail,
            name: adminName,
            balance: 999999.99,
            role: 'admin',
            is_active: true
          });
        }

        // Update last login
        await userOperations.updateLastLogin(adminUser.id);
        
        setUser(adminUser);
        return;
      }

      // Regular user login
      const foundUser = await userOperations.getUserByEmail(normalizedEmail);
      
      if (!foundUser) {
        throw new Error('Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı');
      }

      if (!foundUser.is_active) {
        throw new Error('Hesabınız devre dışı bırakılmış. Lütfen destek ile iletişime geçin');
      }

      // For regular users, we'll implement proper password hashing later
      // For now, simple validation
      if (password.length < 6) {
        throw new Error('Şifre hatalı');
      }

      // Update last login
      await userOperations.updateLastLogin(foundUser.id);
      
      setUser(foundUser);
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    setIsLoading(true);
    
    try {
      // Name validation
      const nameValidation = validateName(name);
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.errors[0]);
      }
      
      // Email validation
      if (!email.trim()) {
        throw new Error('E-posta adresi gerekli');
      }
      
      if (!validateEmail(email.trim())) {
        throw new Error('Geçerli bir e-posta adresi girin');
      }
      
      // Password validation
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if user already exists
      const existingUser = await userOperations.getUserByEmail(normalizedEmail);
      if (existingUser) {
        throw new Error('Bu e-posta adresi zaten kayıtlı');
      }

      // Create new user in Supabase
      const newUser = await userOperations.createUser({
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim(),
        balance: 0,
        role: 'user',
        is_active: true
      });

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
      const newBalance = user.balance + amount;
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      
      // Update in database
      userOperations.updateUserBalance(user.id, newBalance).catch(error => {
        console.error('Error updating balance in database:', error);
        toast.error('Bakiye güncellenirken bir hata oluştu');
      });
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