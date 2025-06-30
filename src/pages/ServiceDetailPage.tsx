import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Users, 
  Zap, 
  Shield, 
  CheckCircle,
  Info,
  ArrowRight,
  Clock,
  Award,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Play,
  Music,
  Video,
  Headphones,
  UserPlus,
  ThumbsUp,
  Repeat,
  Send,
  Globe,
  Target,
  Layers,
  Activity,
  BarChart3
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useServices } from '../contexts/ServiceContext';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';

const ServiceDetailPage: React.FC = () => {
  const { platform } = useParams();
  const { addToCart } = useCart();
  const { getServicesByPlatform, platforms } = useServices();
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [quantity, setQuantity] = useState(50);
  const [activeTab, setActiveTab] = useState('packages');

  // Platform ve hizmet verilerini context'ten al
  const currentPlatform = platforms.find(p => p.name.toLowerCase() === platform?.toLowerCase());
  const platformServices = getServicesByPlatform(platform || '');

  // Varsayılan platform verisi
  const defaultPlatform = {
    id: 'default',
    name: 'Platform',
    icon: '🌐',
    description: 'Bu platform için hizmetler',
    color: 'from-blue-500 to-purple-600',
    isActive: true,
    order: 1
  };

  const serviceData = currentPlatform || defaultPlatform;
  
  // Eğer hizmet yoksa varsayılan hizmet oluştur
  const defaultService = {
    id: 'default',
    name: 'Temel Paket',
    description: 'Başlangıç seviyesi hizmet',
    category: 'Temel',
    platform: serviceData.name,
    prices: [
      { amount: 100, price: 5.00 },
      { amount: 500, price: 20.00 },
      { amount: 1000, price: 35.00 }
    ],
    features: ['Hızlı teslimat', 'Güvenli', 'Kaliteli'],
    deliveryTime: '1-6 saat',
    quality: 'Standard',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const services = platformServices.length > 0 ? platformServices : [defaultService];
  const currentPackage = services[selectedPackage] || defaultService;
  const currentPrice = currentPackage.prices.find(p => p.amount === quantity)?.price || 0;

  const tabs = [
    { id: 'packages', name: 'Paketler', icon: ShoppingCart },
    { id: 'info', name: 'Bilgi', icon: Info },
    { id: 'faq', name: 'S.S.S', icon: CheckCircle }
  ];

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantities = currentPackage.prices.map(p => p.amount);
    if (validQuantities.includes(newQuantity)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      platform: serviceData.name,
      serviceName: currentPackage.name,
      category: currentPackage.category,
      quantity: quantity,
      price: currentPrice
    };

    addToCart(cartItem);
  };

  const quantityOptions = currentPackage.prices.map(p => p.amount);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <div className={`bg-gradient-to-br ${serviceData.color} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="text-6xl mb-6">
                {serviceData.image ? (
                  <img 
                    src={serviceData.image} 
                    alt={serviceData.name}
                    className="w-16 h-16 object-cover rounded-2xl"
                  />
                ) : (
                  serviceData.icon
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {serviceData.name}
              </h1>
              <p className="text-xl text-white/90 mb-6">
                {serviceData.description}
              </p>
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">4.8</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>125K+ sipariş</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Hızlı teslimat', 'Güvenilir hizmet', 'Kaliteli sonuçlar', '24/7 destek'].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">
                Hızlı Sipariş
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Paket Seç
                  </label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
                  >
                    {services.map((pkg, index) => (
                      <option key={pkg.id} value={index} className="text-black">
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Miktar
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
                  >
                    {quantityOptions.map(amount => (
                      <option key={amount} value={amount} className="text-black">
                        {amount} {currentPackage.category.toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span>Toplam Fiyat:</span>
                    <span className="text-2xl font-bold">₺{currentPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-white text-purple-600 hover:bg-gray-100"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Sepete Ekle
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-200 dark:bg-dark-800 rounded-lg p-1 mb-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
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
            {activeTab === 'packages' && (
              <div className="space-y-6">
                {services.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white dark:bg-dark-800 rounded-2xl p-6 border-2 transition-all duration-200 ${
                      selectedPackage === index
                        ? 'border-primary-500 shadow-lg'
                        : 'border-gray-200 dark:border-dark-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {pkg.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {pkg.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pkg.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4" />
                            <span>{pkg.deliveryTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Shield className="w-4 h-4" />
                            <span>{pkg.quality}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={selectedPackage === index ? 'primary' : 'outline'}
                        onClick={() => setSelectedPackage(index)}
                      >
                        {selectedPackage === index ? 'Seçili' : 'Seç'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {pkg.prices.map((priceOption, idx) => (
                        <div
                          key={idx}
                          className={`text-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedPackage === index && quantity === priceOption.amount
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 dark:border-dark-600 hover:border-primary-300'
                          }`}
                          onClick={() => {
                            setSelectedPackage(index);
                            setQuantity(priceOption.amount);
                          }}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">
                            {priceOption.amount}
                          </div>
                          <div className="text-primary-600 dark:text-primary-400 font-bold text-sm">
                            ₺{priceOption.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {serviceData.name} Hizmetleri Nasıl Satın Alınır?
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {serviceData.name} hizmetlerini tercih etmek isteyen kullanıcılar, 
                    bu işlemi oldukça basit bir şekilde gerçekleştirebilir. İşlem adımları şu şekildedir:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[
                      {
                        icon: '🎯',
                        title: 'Profil Belirleme',
                        description: `Hizmet satın alması yapmak istediğiniz ${serviceData.name} profilinizi belirleyin.`
                      },
                      {
                        icon: '📦',
                        title: 'Paket Seçimi',
                        description: 'Size uygun hizmet paketini seçin ve sepete ekleyin.'
                      },
                      {
                        icon: '💳',
                        title: 'Ödeme Gerçin',
                        description: 'Güvenli ödeme yöntemleri ile işleminizi tamamlayın.'
                      },
                      {
                        icon: '🚀',
                        title: 'Hızlı Teslimat',
                        description: 'Siparişiniz dakikalar içinde hesabınıza yansıyacaktır.'
                      }
                    ].map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="text-2xl">{step.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {step.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Sıkça Sorulan Sorular
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      question: `${serviceData.name} hizmetleri güvenli mi?`,
                      answer: `Evet, tüm ${serviceData.name} hizmetlerimiz %100 güvenlidir. Gerçek ve aktif hesaplardan hizmet sunuyoruz.`
                    },
                    {
                      question: 'Siparişim ne kadar sürede teslim edilir?',
                      answer: `${serviceData.name} hizmetlerimiz genellikle 0-6 saat içinde teslim edilir. Paket türüne göre teslimat süreleri değişebilir.`
                    },
                    {
                      question: 'Drop koruması nedir?',
                      answer: 'Drop koruması, sipariş sonrası düşüş durumunda ücretsiz tamamlama garantisidir. 30 gün boyunca geçerlidir.'
                    },
                    {
                      question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
                      answer: 'Kredi kartı, banka kartı, Papara ve havale/EFT ile ödeme yapabilirsiniz.'
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-dark-700 pb-4 last:border-b-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Selection */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Seçiminiz
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {serviceData.image ? (
                      <img 
                        src={serviceData.image} 
                        alt={serviceData.name}
                        className="w-8 h-8 object-cover rounded-lg"
                      />
                    ) : (
                      serviceData.icon
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {serviceData.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {currentPackage.name}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Miktar:</span>
                    <span className="font-semibold">{quantity} {currentPackage.category.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Fiyat:</span>
                    <span className="font-semibold">₺{currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-dark-600">
                    <span className="font-semibold">Toplam:</span>
                    <span className="text-xl font-bold text-primary-600">₺{currentPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Sepete Ekle
                </Button>
              </div>
            </div>

            {/* Other Services */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Diğer Hizmetlerimiz
              </h3>
              <div className="space-y-3">
                {platforms.filter(p => p.isActive && p.name !== serviceData.name).slice(0, 5).map((platform, index) => (
                  <Link
                    key={index}
                    to={`/services/${platform.name.toLowerCase()}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">
                        {platform.image ? (
                          <img 
                            src={platform.image} 
                            alt={platform.name}
                            className="w-6 h-6 object-cover rounded"
                          />
                        ) : (
                          platform.icon
                        )}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {platform.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary-600 font-semibold">
                        ₺3.50+
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;