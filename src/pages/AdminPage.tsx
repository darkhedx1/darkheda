import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, CreditCard, Settings, TrendingUp, DollarSign, Package, UserCheck, Clock, CheckCircle, XCircle, Eye, ExternalLink, Copy, User, Calendar, MapPin, Phone, Mail, AlertCircle, Plus, Edit, Trash2, Save, Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { usePayment } from '../contexts/PaymentContext';
import { useServices } from '../contexts/ServiceContext';
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
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editingPlatform, setEditingPlatform] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [newPlatform, setNewPlatform] = useState<any>(null);
  const [newService, setNewService] = useState<any>(null);

  // Admin kontrolü
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const paymentRequests = getAllPaymentRequests();
  const pendingPayments = paymentRequests.filter(req => req.status === 'pending');

  // Periyodik refresh
  useEffect(() => {
    const interval = setInterval(() => {
      forceRefresh();
    }, 5000); // Her 5 saniyede refresh

    return () => clearInterval(interval);
  }, [forceRefresh]);

  const stats = [
    {
      title: 'Toplam Sipariş',
      value: orders.length.toString(),
      icon: ShoppingBag,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
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
    { id: 'orders', name: 'Sipariş Yönetimi', icon: ShoppingBag },
    { id: 'payments', name: 'Ödeme Talepleri', icon: CreditCard },
    { id: 'platforms', name: 'Platform Yönetimi', icon: Package },
    { id: 'services', name: 'Hizmet Yönetimi', icon: Settings },
    { id: 'users', name: 'Kullanıcılar', icon: Users }
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
      forceRefresh(); // Anlık güncelleme
    } else if (newPlatform) {
      addPlatform(newPlatform);
      setNewPlatform(null);
      forceRefresh(); // Anlık güncelleme
    }
  };

  const handleServiceSave = () => {
    if (editingService) {
      updateService(editingService.id, editingService);
      setEditingService(null);
      forceRefresh(); // Anlık güncelleme
    } else if (newService) {
      addService(newService);
      setNewService(null);
      forceRefresh(); // Anlık güncelleme
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

  // Kullanıcı bilgilerini localStorage'dan al
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  };

  const registeredUsers = getRegisteredUsers();

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
            <Button
              onClick={forceRefresh}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Yenile</span>
            </Button>
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
        {activeTab === 'platforms' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg"
          >
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Platform Yönetimi
                </h2>
                <Button
                  onClick={() => setNewPlatform({
                    name: '',
                    icon: '🌐',
                    description: '',
                    color: 'from-blue-500 to-purple-600',
                    isActive: true,
                    order: platforms.length + 1
                  })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Platform
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {/* New Platform Form */}
              {newPlatform && (
                <div className="mb-6 p-4 border border-gray-200 dark:border-dark-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Yeni Platform Ekle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Platform Adı</label>
                      <input
                        type="text"
                        value={newPlatform.name}
                        onChange={(e) => setNewPlatform({...newPlatform, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">İkon</label>
                      <input
                        type="text"
                        value={newPlatform.icon}
                        onChange={(e) => setNewPlatform({...newPlatform, icon: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Açıklama</label>
                      <textarea
                        value={newPlatform.description}
                        onChange={(e) => setNewPlatform({...newPlatform, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Renk Gradyanı</label>
                      <select
                        value={newPlatform.color}
                        onChange={(e) => setNewPlatform({...newPlatform, color: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg"
                      >
                        <option value="from-blue-500 to-purple-600">Mavi-Mor</option>
                        <option value="from-pink-500 to-red-500">Pembe-Kırmızı</option>
                        <option value="from-green-500 to-teal-500">Yeşil-Teal</option>
                        <option value="from-yellow-500 to-orange-500">Sarı-Turuncu</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Platform Fotoğrafı</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'platform');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg"
                      />
                      {newPlatform.image && (
                        <img src={newPlatform.image} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded" />
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button onClick={handlePlatformSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Kaydet
                    </Button>
                    <Button variant="outline" onClick={() => setNewPlatform(null)}>
                      İptal
                    </Button>
                  </div>
                </div>
              )}

              {/* Platform List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platforms.map((platform) => (
                  <div key={platform.id} className="border border-gray-200 dark:border-dark-700 rounded-lg p-4">
                    {editingPlatform?.id === platform.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingPlatform.name}
                          onChange={(e) => setEditingPlatform({...editingPlatform, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded text-sm"
                        />
                        <textarea
                          value={editingPlatform.description}
                          onChange={(e) => setEditingPlatform({...editingPlatform, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded text-sm"
                          rows={2}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'platform', platform.id);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded text-sm"
                        />
                        {editingPlatform.image && (
                          <img src={editingPlatform.image} alt="Preview" className="w-12 h-12 object-cover rounded" />
                        )}
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handlePlatformSave}>
                            <Save className="w-3 h-3 mr-1" />
                            Kaydet
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingPlatform(null)}>
                            İptal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          {platform.image ? (
                            <img src={platform.image} alt={platform.name} className="w-8 h-8 object-cover rounded" />
                          ) : (
                            <span className="text-2xl">{platform.icon}</span>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{platform.name}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300">{platform.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded text-xs ${platform.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {platform.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" onClick={() => setEditingPlatform(platform)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                if (confirm('Bu platformu silmek istediğinizden emin misiniz?')) {
                                  deletePlatform(platform.id);
                                  forceRefresh();
                                }
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'services' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg"
          >
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Hizmet Yönetimi
                </h2>
                <Button
                  onClick={() => setNewService({
                    name: '',
                    description: '',
                    category: 'Takipçi',
                    platform: platforms[0]?.name || 'Instagram',
                    prices: [{ amount: 100, price: 10.00 }],
                    features: ['Hızlı teslimat'],
                    deliveryTime: '0-2 saat',
                    quality: 'Yüksek',
                    isActive: true
                  })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Hizmet
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {/* New Service Form */}
              {newService && (
                <div className="mb-6 p-4 border border-gray-200 dark:border-dark-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Yeni Hizmet Ekle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hizmet Adı</label>
                      <input
                        type="text"
                        value={newService.name}
                        onChange={(e) => setNewService({...newService, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Platform</label>
                      <select
                        value={newService.platform}
                        onChange={(e) => setNewService({...newService, platform: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg"
                      >
                        {platforms.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Kategori</label>
                      <select
                        value={newService.category}
                        onChange={(e) => setNewService({...newService, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg"
                      >
                        <option value="Takipçi">Takipçi</option>
                        <option value="Beğeni">Beğeni</option>
                        <option value="İzlenme">İzlenme</option>
                        <option value="Abone">Abone</option>
                        <option value="Üye">Üye</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Teslimat Süresi</label>
                      <input
                        type="text"
                        value={newService.deliveryTime}
                        onChange={(e) => setNewService({...newService, deliveryTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Açıklama</label>
                      <textarea
                        value={newService.description}
                        onChange={(e) => setNewService({...newService, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button onClick={handleServiceSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Kaydet
                    </Button>
                    <Button variant="outline" onClick={() => setNewService(null)}>
                      İptal
                    </Button>
                  </div>
                </div>
              )}

              {/* Service List */}
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="border border-gray-200 dark:border-dark-700 rounded-lg p-4">
                    {editingService?.id === service.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editingService.name}
                          onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded text-sm"
                          placeholder="Hizmet Adı"
                        />
                        <select
                          value={editingService.platform}
                          onChange={(e) => setEditingService({...editingService, platform: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded text-sm"
                        >
                          {platforms.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                        <textarea
                          value={editingService.description}
                          onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded text-sm md:col-span-2"
                          rows={2}
                          placeholder="Açıklama"
                        />
                        <div className="flex space-x-2 md:col-span-2">
                          <Button size="sm" onClick={handleServiceSave}>
                            <Save className="w-3 h-3 mr-1" />
                            Kaydet
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingService(null)}>
                            İptal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{service.platform} - {service.category}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{service.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {service.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => setEditingService(service)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              if (confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
                                deleteService(service.id);
                                forceRefresh();
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Diğer tab içerikleri burada devam eder... */}
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
                  {orders.map((order) => {
                    const orderUser = registeredUsers.find((u: any) => u.id === order.userId);
                    return (
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
                                Müşteri: {orderUser?.name || 'Bilinmeyen Kullanıcı'}
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
                    );
                  })}
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

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg"
          >
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Kullanıcı Yönetimi
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {registeredUsers.filter((u: any) => u.role !== 'admin').map((user: any) => (
                  <div
                    key={user.id}
                    className="border border-gray-200 dark:border-dark-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">
                          ₺{user.balance.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Bakiye
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;