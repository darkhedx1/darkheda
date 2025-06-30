import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, Wallet, ArrowLeft, CheckCircle, AlertCircle, QrCode, Building2, Copy } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { createPaymentRequest } = usePayment();
  const { user, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'papara' | 'bank'>('balance');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const totalPrice = getTotalPrice();
  const hasEnoughBalance = user ? user.balance >= totalPrice : false;

  const paymentMethods = [
    {
      id: 'balance' as const,
      name: 'Bakiye ile Öde',
      icon: Wallet,
      color: 'from-green-500 to-emerald-500',
      description: `Mevcut bakiye: ₺${user?.balance.toFixed(2) || '0.00'}`
    },
    {
      id: 'papara' as const,
      name: 'PAPARA QR Kodu',
      icon: QrCode,
      color: 'from-purple-500 to-pink-500',
      description: 'QR kod ile hızlı ödeme'
    },
    {
      id: 'bank' as const,
      name: 'Garanti Bankası Havale',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      description: 'Banka havalesi ile ödeme'
    }
  ];

  const handlePaymentMethodSelect = async (method: 'balance' | 'papara' | 'bank') => {
    if (!user) {
      toast.error('Lütfen önce giriş yapın');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Sepetinizde ürün bulunmuyor');
      return;
    }

    if (!targetUrl.trim()) {
      toast.error('Lütfen hedef URL\'yi girin');
      return;
    }

    if (method === 'balance') {
      if (!hasEnoughBalance) {
        toast.error('Yetersiz bakiye! Lütfen bakiye yükleyin.');
        return;
      }

      setLoading(true);
      try {
        // Create order
        const orderId = await createOrder(items, targetUrl);
        
        // Process payment
        updateBalance(-totalPrice);
        toast.success('Ödeme başarılı! Bakiyenizden düşüldü.');
        
        // Clear cart
        clearCart();
        
        toast.success('Siparişiniz başarıyla oluşturuldu!');
        navigate(`/order-success/${orderId}`);
      } catch (error) {
        toast.error('Sipariş oluşturulurken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    } else {
      // Papara veya Banka havalesi için ödeme talebi oluştur
      setLoading(true);
      setPaymentMethod(method);

      try {
        await createPaymentRequest(totalPrice, method);
        setShowPaymentDetails(true);
      } catch (error) {
        toast.error('Ödeme talebi oluşturulurken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopyalandı!`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sepetiniz Boş
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Ödeme yapabilmek için sepetinizde ürün bulunmalıdır.
            </p>
            <Button onClick={() => navigate('/services')}>
              Hizmetleri İncele
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showPaymentDetails && (paymentMethod === 'papara' || paymentMethod === 'bank')) {
    const method = paymentMethods.find(m => m.id === paymentMethod)!;
    const paymentDetails = {
      papara: {
        iban: 'TR28 0082 9000 0949 1839 6025 14',
        name: 'Ömer Emir Erdoğan',
        qrImage: '/PAPARA QR.jpeg'
      },
      bank: {
        iban: 'TR87 0006 2000 3420 0006 8477 79',
        name: 'Ömer Emir Erdoğan',
        bank: 'Garanti BBVA'
      }
    };

    const details = paymentDetails[paymentMethod];

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => setShowPaymentDetails(false)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ödeme Bilgileri
            </h1>
          </div>

          {/* Payment Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 mb-6"
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl mb-6`}>
              <method.icon className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {method.name}
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Ödeme Talimatları
                    </h4>
                    <ol className="text-blue-800 dark:text-blue-200 text-sm space-y-1 list-decimal list-inside">
                      <li>Aşağıdaki bilgileri kullanarak ₺{totalPrice.toFixed(2)} ödeme yapın</li>
                      <li>Ödeme açıklamasına kullanıcı adınızı yazın</li>
                      <li>Ödeme yaptıktan sonra admin onayını bekleyin</li>
                      <li>Onay sonrası siparişiniz otomatik oluşturulacak</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* PAPARA QR */}
              {paymentMethod === 'papara' && (
                <div className="text-center">
                  <img 
                    src="/PAPARA QR.jpeg" 
                    alt="PAPARA QR Kodu" 
                    className="w-64 h-64 mx-auto mb-4 rounded-lg shadow-lg"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    QR kodu tarayarak ödeme yapabilirsiniz
                  </p>
                </div>
              )}

              {/* Payment Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">IBAN:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {details.iban}
                    </span>
                    <button
                      onClick={() => copyToClipboard(details.iban, 'IBAN')}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Ad Soyad:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white">{details.name}</span>
                    <button
                      onClick={() => copyToClipboard(details.name, 'Ad Soyad')}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {paymentMethod === 'bank' && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">Banka:</span>
                    <span className="text-gray-900 dark:text-white">Garanti BBVA</span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Ödenecek Tutar:</span>
                  <span className="text-2xl font-bold text-emerald-600">₺{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentDetails(false)}
              className="flex-1"
            >
              Geri Dön
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
            >
              Hesabıma Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ödeme
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            {/* Target URL */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Hedef Bilgileri
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profil/Video URL'si *
                </label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://instagram.com/kullanici_adi"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Hizmetin uygulanacağı profil veya içerik URL'sini girin
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Ödeme Yöntemi Seçin
              </h3>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                    disabled={loading || !targetUrl.trim() || (method.id === 'balance' && !hasEnoughBalance)}
                    className="w-full p-4 border-2 border-gray-200 dark:border-dark-600 rounded-lg hover:border-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${method.color}`}>
                        <method.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {method.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {method.description}
                        </div>
                        {method.id === 'balance' && !hasEnoughBalance && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Yetersiz bakiye! Bakiye yüklemeniz gerekiyor.
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg h-fit">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Sipariş Özeti
            </h3>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-dark-700 last:border-b-0">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {item.platform} - {item.serviceName}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {item.quantity} {item.category}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    ₺{item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-dark-700 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Ara Toplam:</span>
                <span className="font-semibold text-gray-900 dark:text-white">₺{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">KDV (%18):</span>
                <span className="font-semibold text-gray-900 dark:text-white">₺0.00</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-dark-700">
                <span>Toplam:</span>
                <span className="text-emerald-600">₺{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
              Ödeme yöntemi seçerek siparişinizi tamamlayabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;