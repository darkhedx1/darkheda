import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  CreditCard, 
  Plus, 
  History, 
  ArrowLeft, 
  QrCode, 
  Building2,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';

const WalletPage: React.FC = () => {
  const { user, updateBalance } = useAuth();
  const { createPaymentRequest, getUserPaymentRequests } = usePayment();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'papara' | 'bank' | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const predefinedAmounts = [50, 100, 250, 500, 1000];
  const userPaymentRequests = user ? getUserPaymentRequests(user.id) : [];

  const paymentMethods = [
    {
      id: 'papara' as const,
      name: 'PAPARA QR Kodu',
      icon: QrCode,
      color: 'from-purple-500 to-pink-500',
      description: 'QR kod ile hızlı ödeme',
      details: {
        iban: 'TR28 0082 9000 0949 1839 6025 14',
        name: 'Ömer Emir Erdoğan',
        qrImage: '/PAPARA QR.jpeg'
      }
    },
    {
      id: 'bank' as const,
      name: 'Garanti Bankası Havale',
      icon: Building2,
      color: 'from-green-500 to-emerald-500',
      description: 'Banka havalesi ile ödeme',
      details: {
        iban: 'TR87 0006 2000 3420 0006 8477 79',
        name: 'Ömer Emir Erdoğan',
        bank: 'Garanti BBVA'
      }
    }
  ];

  const handlePaymentMethodSelect = async (method: 'papara' | 'bank') => {
    const numAmount = parseFloat(amount);
    
    if (!numAmount || numAmount <= 0) {
      toast.error('Geçerli bir tutar girin');
      return;
    }

    if (numAmount < 10) {
      toast.error('Minimum yükleme tutarı ₺10\'dur');
      return;
    }

    if (numAmount > 10000) {
      toast.error('Maksimum yükleme tutarı ₺10.000\'dir');
      return;
    }

    setLoading(true);
    setSelectedPaymentMethod(method);

    try {
      await createPaymentRequest(numAmount, method);
      setShowPaymentDetails(true);
      setAmount('');
    } catch (error) {
      toast.error('Ödeme talebi oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopyalandı!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Onaylandı';
      case 'pending':
        return 'Bekliyor';
      case 'rejected':
        return 'Reddedildi';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'rejected':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  if (showPaymentDetails && selectedPaymentMethod) {
    const method = paymentMethods.find(m => m.id === selectedPaymentMethod)!;
    
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
                      <li>Aşağıdaki bilgileri kullanarak ödeme yapın</li>
                      <li>Ödeme açıklamasına kullanıcı adınızı yazın</li>
                      <li>Ödeme yaptıktan sonra admin onayını bekleyin</li>
                      <li>Onay sonrası bakiye hesabınıza yansıyacak</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* PAPARA QR */}
              {selectedPaymentMethod === 'papara' && (
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
                      {method.details.iban}
                    </span>
                    <button
                      onClick={() => copyToClipboard(method.details.iban, 'IBAN')}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Ad Soyad:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white">{method.details.name}</span>
                    <button
                      onClick={() => copyToClipboard(method.details.name, 'Ad Soyad')}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {method.details.bank && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">Banka:</span>
                    <span className="text-gray-900 dark:text-white">{method.details.bank}</span>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                      Önemli Bilgi
                    </h4>
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      Ödeme talebiniz oluşturuldu. Admin kontrolü sonrası bakiyeniz hesabınıza yansıyacaktır. 
                      Bu işlem genellikle 1-24 saat arasında tamamlanır.
                    </p>
                  </div>
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
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cüzdan
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Wallet className="w-8 h-8" />
                <div>
                  <h2 className="text-lg font-semibold">Mevcut Bakiye</h2>
                  <p className="text-white/80 text-sm">Garanti Takipçim Cüzdan</p>
                </div>
              </div>
            </div>
            
            <div className="text-4xl font-bold mb-6">
              ₺{user?.balance.toFixed(2) || '0.00'}
            </div>
            
            <div className="flex items-center justify-between text-white/80 text-sm">
              <span>Kullanıcı: {user?.name}</span>
              <span>TL</span>
            </div>
          </motion.div>

          {/* Add Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Bakiye Yükle
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yüklenecek Tutar (₺)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Tutar girin"
                  min="10"
                  max="10000"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Hızlı Seçim:</p>
                <div className="grid grid-cols-3 gap-2">
                  {predefinedAmounts.map((preAmount) => (
                    <button
                      key={preAmount}
                      onClick={() => setAmount(preAmount.toString())}
                      className="px-3 py-2 text-sm border border-gray-300 dark:border-dark-600 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-colors duration-200"
                    >
                      ₺{preAmount}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Ödeme Yöntemi Seçin:</p>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      disabled={loading || !amount || parseFloat(amount) <= 0}
                      className="w-full p-4 border-2 border-gray-200 dark:border-dark-600 rounded-lg hover:border-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${method.color}`}>
                          <method.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {method.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <CreditCard className="w-4 h-4" />
                <span>Güvenli ödeme - Admin onaylı sistem</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment Requests History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg mt-8"
        >
          <div className="p-6 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center space-x-3">
              <History className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Ödeme Talepleri
              </h3>
            </div>
          </div>
          
          <div className="p-6">
            {userPaymentRequests.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  Henüz ödeme talebiniz bulunmuyor
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userPaymentRequests.map((request) => {
                  const StatusIcon = getStatusIcon(request.status);
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          request.status === 'approved'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : request.status === 'pending'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          <StatusIcon className={`w-5 h-5 ${
                            request.status === 'approved'
                              ? 'text-green-600 dark:text-green-400'
                              : request.status === 'pending'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                          }`} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            ₺{request.amount.toFixed(2)} - {request.paymentMethod === 'papara' ? 'PAPARA' : 'Garanti Bankası'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(request.createdAt).toLocaleDateString('tr-TR')} - {request.id}
                          </div>
                          {request.adminNote && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Admin Notu: {request.adminNote}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletPage;