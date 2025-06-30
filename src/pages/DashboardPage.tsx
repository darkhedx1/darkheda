import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Wallet, 
  ShoppingBag, 
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  
  // Kullanıcının siparişlerini al
  const userOrders = user ? getUserOrders(user.id) : [];
  const recentOrders = userOrders.slice(0, 4);

  const stats = [
    {
      title: 'Toplam Bakiye',
      value: `₺${user?.balance.toFixed(2)}`,
      icon: Wallet,
      color: 'from-green-500 to-emerald-500',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Aktif Siparişler',
      value: userOrders.filter(order => order.status === 'processing' || order.status === 'pending').length.toString(),
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      change: '2 yeni',
      changeType: 'neutral'
    },
    {
      title: 'Tamamlanan',
      value: userOrders.filter(order => order.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'from-purple-500 to-pink-500',
      change: '+3 bu hafta',
      changeType: 'positive'
    },
    {
      title: 'Toplam Harcama',
      value: `₺${userOrders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      change: '+8.2%',
      changeType: 'positive'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'processing':
        return 'İşleniyor';
      case 'pending':
        return 'Bekliyor';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Hoş Geldiniz, {user?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Hesap durumunuzu ve siparişlerinizi buradan takip edebilirsiniz.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <Link to="/wallet">
                <Button variant="outline">
                  <Wallet className="w-4 h-4 mr-2" />
                  Bakiye Yükle
                </Button>
              </Link>
              <Link to="/services">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Sipariş
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                    : 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                {stat.title}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl shadow-lg"
          >
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Son Siparişler
                </h2>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Tümünü Gör
                </Button>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Henüz Sipariş Yok
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    İlk siparişinizi vermek için hizmetlerimizi inceleyin
                  </p>
                  <Link to="/services">
                    <Button>
                      Hizmetleri İncele
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {order.items[0]?.platform === 'Instagram' && '📷'}
                          {order.items[0]?.platform === 'TikTok' && '🎵'}
                          {order.items[0]?.platform === 'YouTube' && '🎥'}
                          {order.items[0]?.platform === 'Twitter/X' && '🐦'}
                          {order.items[0]?.platform === 'Spotify' && '🎶'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {order.items[0]?.serviceName || 'Hizmet'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {order.items.length} ürün • {order.id}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">
                          ₺{order.totalAmount.toFixed(2)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions & Account Info */}
          <div className="space-y-6">
            {/* Account Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Hesap Özeti
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Üyelik Tarihi</span>
                  <span className="font-medium text-gray-900 dark:text-white">15 Ocak 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Toplam Sipariş</span>
                  <span className="font-medium text-gray-900 dark:text-white">{userOrders.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Müşteri Seviyesi</span>
                  <span className="px-2 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs rounded-full font-medium">
                    Premium
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Sadakat Puanı</span>
                  <span className="font-medium text-gray-900 dark:text-white">1,245</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Hızlı İşlemler
              </h3>
              <div className="space-y-3">
                <Link to="/wallet">
                  <Button variant="outline" className="w-full justify-start">
                    <Wallet className="w-4 h-4 mr-3" />
                    Bakiye Yükle
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingBag className="w-4 h-4 mr-3" />
                    Yeni Sipariş Ver
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-3" />
                  Profil Ayarları
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-3" />
                  Hesap Ayarları
                </Button>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Bildirimler
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Hoş Geldiniz!
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Garanti Takipçim'e hoş geldiniz. İlk siparişinizi vermek için hizmetlerimizi inceleyin.
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Wallet className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Bakiye Yükleme
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Hızlı sipariş verebilmek için bakiye yüklemeyi unutmayın.
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Özel Kampanya
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Instagram paketlerinde %20 indirim fırsatı!
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;