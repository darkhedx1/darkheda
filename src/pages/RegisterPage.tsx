import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/UI/Logo';
import Button from '../components/UI/Button';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Şifre gücü hesaplama
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
  };

  // Gerçek zamanlı doğrulama
  const validateForm = () => {
    const errors: string[] = [];
    
    // İsim doğrulama
    if (formData.name.trim().length < 2) {
      errors.push('Ad soyad en az 2 karakter olmalıdır');
    }
    if (formData.name.trim().length > 50) {
      errors.push('Ad soyad en fazla 50 karakter olabilir');
    }
    if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(formData.name.trim())) {
      errors.push('Ad soyad sadece harf ve boşluk içerebilir');
    }
    
    // E-posta doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.push('Geçerli bir e-posta adresi girin');
    }
    
    // Telefon doğrulama (opsiyonel)
    if (formData.phone.trim() && !/^(\+90|0)?[5][0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.push('Geçerli bir Türkiye telefon numarası girin');
    }
    
    // Şifre doğrulama
    if (formData.password.length < 8) {
      errors.push('Şifre en az 8 karakter olmalıdır');
    }
    if (!/[a-z]/.test(formData.password)) {
      errors.push('Şifre en az bir küçük harf içermelidir');
    }
    if (!/[A-Z]/.test(formData.password)) {
      errors.push('Şifre en az bir büyük harf içermelidir');
    }
    if (!/\d/.test(formData.password)) {
      errors.push('Şifre en az bir rakam içermelidir');
    }
    
    // Şifre eşleşme kontrolü
    if (formData.password !== formData.confirmPassword) {
      errors.push('Şifreler eşleşmiyor');
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
    
    if (!acceptedTerms) {
      toast.error('Kullanım şartlarını kabul etmeniz gerekiyor');
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Kayıt başarılı! Hoş geldiniz.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Şifre gücü hesaplama
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Gerçek zamanlı doğrulama
    if (formData.name || formData.email || formData.password || formData.confirmPassword) {
      setTimeout(validateForm, 300);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Zayıf';
    if (passwordStrength < 60) return 'Orta';
    if (passwordStrength < 80) return 'İyi';
    return 'Güçlü';
  };

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
            Hesap Oluşturun
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-premium">
            Sosyal medya büyüme yolculuğunuza başlayın
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
              <label htmlFor="name" className="block text-sm font-premium font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ad Soyad *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white font-premium"
                  placeholder="Adınız Soyadınız"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-premium font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-posta Adresi *
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
              <label htmlFor="phone" className="block text-sm font-premium font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefon Numarası (Opsiyonel)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white font-premium"
                  placeholder="+90 5xx xxx xx xx"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-premium font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifre *
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
              
              {/* Şifre Gücü Göstergesi */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Şifre Gücü:</span>
                    <span className={`font-medium ${
                      passwordStrength < 30 ? 'text-red-500' :
                      passwordStrength < 60 ? 'text-yellow-500' :
                      passwordStrength < 80 ? 'text-blue-500' : 'text-green-500'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-premium font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifre Tekrarı *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white font-premium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

          {/* Şifre Kuralları */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Şifre Kuralları:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li className={formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}>
                    • En az 8 karakter
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}>
                    • En az bir küçük harf
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}>
                    • En az bir büyük harf
                  </li>
                  <li className={/\d/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}>
                    • En az bir rakam
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="accept-terms"
              name="accept-terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-600 rounded mt-1"
            />
            <label htmlFor="accept-terms" className="ml-3 block text-sm text-gray-700 dark:text-gray-300 font-premium">
              <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:text-primary-500">
                Kullanım Şartları
              </Link>
              {' '}ve{' '}
              <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:text-primary-500">
                Gizlilik Politikası
              </Link>
              'nı okudum ve kabul ediyorum. *
            </label>
          </div>

          <Button
            type="submit"
            className="w-full font-premium"
            size="lg"
            loading={loading}
            disabled={validationErrors.length > 0 || !acceptedTerms}
            icon={UserPlus}
          >
            Hesap Oluştur
          </Button>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-300 font-premium">
              Zaten hesabınız var mı?{' '}
            </span>
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-premium font-medium"
            >
              Giriş Yapın
            </Link>
          </div>
        </motion.form>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg p-4"
        >
          <h4 className="text-sm font-premium font-medium text-gray-800 dark:text-gray-200 mb-3">
            Üyelik Avantajları
          </h4>
          <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 font-premium">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
              <span>Hızlı ve güvenli sipariş takibi</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
              <span>Özel indirimler ve kampanyalar</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
              <span>7/24 öncelikli müşteri desteği</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
              <span>Bakiye yönetimi ve ödeme kolaylığı</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;