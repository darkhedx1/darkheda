import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/UI/Logo';
import Button from '../components/UI/Button';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // Gerçek zamanlı doğrulama
  const validateForm = () => {
    const errors: string[] = [];
    
    // E-posta doğrulama
    if (!formData.email.trim()) {
      errors.push('E-posta adresi gerekli');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.push('Geçerli bir e-posta adresi girin');
      }
    }
    
    // Şifre doğrulama
    if (!formData.password.trim()) {
      errors.push('Şifre gerekli');
    } else if (formData.password.length < 4) {
      errors.push('Şifre en az 4 karakter olmalıdır');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Lütfen form hatalarını düzeltin');
      return;
    }

    try {
      await login(formData.email, formData.password);
      
      // Remember me functionality
      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      // Admin kontrolü
      if (formData.email.toLowerCase().includes('garantitakipcim.com') || 
          formData.email === 'omeremirerdogan4@gmail.com') {
        toast.success('Admin girişi başarılı! Yönetim paneline yönlendiriliyorsunuz.');
        navigate('/admin');
      } else {
        toast.success('Giriş başarılı! Hoş geldiniz.');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Giriş yaparken bir hata oluştu.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Gerçek zamanlı doğrulama
    if (formData.email || formData.password) {
      setTimeout(validateForm, 300);
    }
  };

  // Remember me özelliği için e-posta yükleme
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="mb-8">
            <Logo size="lg" />
          </div>
          <h2 className="text-3xl font-premium font-bold text-gray-900 dark:text-white mb-2">
            Hesabınıza Giriş Yapın
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-premium">
            Sosyal medya büyüme yolculuğunuza devam edin
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-8 space-y-6 bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-premium font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white font-premium"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-premium font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white font-premium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Doğrulama Hataları */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    Lütfen aşağıdaki hataları düzeltin:
                  </h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-600 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 font-premium">
                Beni hatırla
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-premium"
            >
              Şifremi unuttum
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full font-premium"
            size="lg"
            loading={isLoading}
            disabled={validationErrors.length > 0}
            icon={LogIn}
          >
            Giriş Yap
          </Button>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-300 font-premium">
              Hesabınız yok mu?{' '}
            </span>
            <Link
              to="/register"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-premium font-medium"
            >
              Kayıt Olun
            </Link>
          </div>
        </motion.form>

        {/* Demo Hesap Bilgileri */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-premium font-medium text-blue-800 dark:text-blue-200 mb-1">
                Güvenlik Bilgisi
              </h4>
              <p className="text-xs text-blue-600 dark:text-blue-300 font-premium">
                Hesabınızın güvenliği için güçlü şifreler kullanın. Admin hesapları özel güvenlik önlemleri ile korunmaktadır.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;