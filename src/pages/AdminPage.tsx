import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, CreditCard, Settings, TrendingUp, DollarSign, Package, UserCheck, Clock, CheckCircle, XCircle, Eye, ExternalLink, Copy, User, Calendar, MapPin, Phone, Mail, AlertCircle, Plus, Edit, Trash2, Save, Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { usePayment } from '../contexts/PaymentContext';
import { useServices } from '../contexts/ServiceContext';
import { userOperations } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const { getAllPaymentRequests, approvePayment, rejectPayment } = usePayment();
  const { 
    platforms, 
    services, 
    updatePlatform, 
    addPlatform, 
    deletePlatform,
    updateService,
    addService,
    deleteService,
    forceRefresh
  } = useServices();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editingPlatform, setEditingPlatform] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [newPlatform, setNewPlatform] = useState<any>(null);
  const [newService, setNewService] = useState<any>(null);
  const [supabaseUsers, setSupabaseUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Admin kontrolü
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const paymentRequests = getAllPaymentRequests();
  const pendingPayments = paymentRequests.filter(req => req.status === 'pending');

  // Supabase kullanıcılarını yükle
  const loadSupabaseUsers = async () => {
    setLoadingUsers(true);
    try {
      const users = await userOperations.getAllUsers();
      setSupabaseUsers(users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Kullanıcılar yüklenirken hata oluştu');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadSupabaseUsers();
  }, []);

  // Periyodik refresh
  useEffect(() => {
    const interval = setInterval(() => {
      forceRefresh();
      loadSupabaseUsers();
    }, 10000); // Her 10 saniyede refresh

    return () => clearInterval(interval);
  }, [forceRefresh]);

  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: supabaseUsers.length.toString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: `${supabaseUsers.filter(u => u.role === 'user').length} normal kullanıcı`
    },
    {
      title: 'Bekleyen Ödemeler',
      value: pendingPayments.length.toString(),
      icon: CreditCard,
      color: 'from-yellow-500 to-orange-500',
      change: `₺${pendingPayments.reduce((sum, req) => sum + req.amount, 0).toFixed(2)}`
    },
    {
      title: 'Aktif Platformlar',
      value: platforms.filter(p => p.isActive).length.toString(),
      icon: Package,
      color: 'from-purple-500 to-pink-500',
      change: `${platforms.length} toplam`
    },
    {
      title: 'Toplam Hizmet',
      value: services.filter(s => s.isActive).length.toString(),
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: `${services.length} toplam`
    }
  ];

  const tabs = [
    { id: 'users', name: 'Kullanıcı Yönetimi', icon: Users },
    { id: 'orders', name: 'Sipariş Yönetimi', icon: ShoppingBag },
    { id: 'payments', name: 'Ödeme Talepleri', icon: CreditCard },
    { id: 'platforms', name: 'Platform Yönetimi', icon: Package },
    { id: 'services', name: 'Hizmet Yönetimi', icon: Settings }
  ];

  const handleImageUpload = (file: File, type: 'platform' | 'service', id?: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      if (type === 'platform') {
        if (editingPlatform) {
          setEditingPlatform({ ...editingPlatform, image: imageUrl });
        } else if (newPlatform) {
          setNewPlatform({ ...newPlatform, image: imageUrl });
        }
      }
      
      toast.success('Fotoğraf yüklendi!');
    };
    reader.readAsDataURL(file);
  };

  const handlePlatformSave = () => {
    if (editingPlatform) {
      updatePlatform(editingPlatform.id, editingPlatform);
      setEditingPlatform(null);
      forceRefresh();
    } else if (newPlatform) {
      addPlatform(newPlatform);
      setNewPlatform(null);
      forceRefresh();
    }
  };

  const handleServiceSave = () => {
    if (editingService) {
      updateService(editingService.id, editingService);
      setEditingService(null);
      forceRefresh();
    } else if (newService) {
      addService(newService);
      setNewService(null);
      forceRefresh();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'processing':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
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
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  const handleOrderStatusUpdate = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
    toast.success('Sipariş durumu güncellendi');
  };

  const handlePaymentApprove = (requestId: string) => {
    approvePayment(requestId, 'Admin tarafından onaylandı');
  };

  const handlePaymentReject = (requestId: string) => {
    const reason = prompt('Red nedeni (opsiyonel):');
    rejectPayment(requestId, reason || 'Admin tarafından reddedildi');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Hoş geldiniz, {user.name}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => loadSupabaseUsers()}
                variant="outline"
                className="flex items-center space-x-2"
                loading={loadingUsers}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Kullanıcıları Yenile</span>
              </Button>
              <Button
                onClick={forceRefresh}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Yenile</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
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
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.change}
                </span>
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

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 dark:bg-dark-800 rounded-lg p-1 mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-dark-700 text-primary-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg"
          >
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Kullanıcı Yönetimi (Supabase)
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Toplam: {supabaseUsers.length} kullanıcı
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {loadingUsers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">Kullanıcılar yükleniyor...</p>
                </div>
              ) : supabaseUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">Henüz kullanıcı bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {supabaseUsers.map((dbUser) => (
                    <div
                      key={dbUser.id}
                      className="border border-gray-200 dark:border-dark-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            dbUser.role === 'admin' 
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                              : 'bg-gradient-to-br from-emerald-500 to-blue-500'
                          }`}>
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {dbUser.name}
                              </span>
                              {dbUser.role === 'admin' && (
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                                  Admin
                                </span>
                              )}
                              {!dbUser.is_active && (
                                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full font-medium">
                                  Pasif
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {dbUser.email}
                            </div>
                            {dbUser.phone && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                📞 {dbUser.phone}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Kayıt: {formatDate(dbUser.created_at)}
                              {dbUser.last_login && (
                                <span className="ml-2">
                                  Son giriş: {formatDate(dbUser.last_login)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-600 text-lg">
                            ₺{dbUser.balance.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Bakiye
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {dbUser.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Diğer tab içerikleri aynı kalacak... */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg"
          >
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Sipariş Yönetimi
              </h2>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">Henüz sipariş bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 dark:border-dark-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">
                            {order.items[0]?.platform === 'Instagram' && '📷'}
                            {order.items[0]?.platform === 'TikTok' && '🎵'}
                            {order.items[0]?.platform === 'YouTube' && '🎥'}
                            {order.items[0]?.platform === 'Twitter/X' && '🐦'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {order.id}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              Müşteri: {order.userId}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleString('tr-TR')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 dark:text-white">
                            ₺{order.totalAmount.toFixed(2)}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {order.items.length} ürün
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleOrderStatusUpdate(order.id, 'processing')}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              İşleme Al
                            </Button>
                          )}
                          {order.status === 'processing' && (
                            <Button
                              size="sm"
                              onClick={() => handleOrderStatusUpdate(order.id, 'completed')}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Tamamla
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'payments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg"
          >
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Ödeme Talepleri
              </h2>
            </div>
            <div className="p-6">
              {paymentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">Henüz ödeme talebi bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 dark:border-dark-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {request.userName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {request.userEmail}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(request.createdAt).toLocaleString('tr-TR')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ₺{request.amount.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {request.paymentMethod === 'papara' ? 'PAPARA' : 'Garanti Bankası'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePaymentReject(request.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reddet
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handlePaymentApprove(request.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Onayla
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Platform ve Service yönetimi aynı kalacak... */}
      </div>
    </div>
  );
};

export default AdminPage;