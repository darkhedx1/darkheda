import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, ArrowRight } from 'lucide-react';
import { useServices } from '../contexts/ServiceContext';
import Button from '../components/UI/Button';

const ServicesPage: React.FC = () => {
  const { services, platforms } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü', count: platforms.filter(p => p.isActive).length },
    { id: 'popular', name: 'Popüler', count: 8 },
    { id: 'social', name: 'Sosyal Medya', count: 15 },
    { id: 'video', name: 'Video Platformları', count: 7 },
    { id: 'music', name: 'Müzik Platformları', count: 5 },
    { id: 'gaming', name: 'Oyun Platformları', count: 3 },
  ];

  // Platform verilerini services context'inden al
  const activePlatforms = platforms.filter(platform => platform.isActive);

  // Her platform için hizmet sayısını ve başlangıç fiyatını hesapla - SABİT DEĞERLER
  const platformsWithStats = activePlatforms.map((platform, index) => {
    const platformServices = services.filter(service => 
      service.platform === platform.name && service.isActive
    );
    
    const minPrice = platformServices.length > 0 
      ? Math.min(...platformServices.flatMap(service => service.prices.map(p => p.price)))
      : 0;

    // SABİT DEĞERLER - Artık değişmeyecek
    const fixedStats = [
      { rating: 4.8, orders: '125K+' },
      { rating: 4.9, orders: '89K+' },
      { rating: 4.7, orders: '156K+' },
      { rating: 4.8, orders: '203K+' },
      { rating: 4.9, orders: '78K+' },
      { rating: 4.6, orders: '134K+' },
      { rating: 4.8, orders: '167K+' },
      { rating: 4.7, orders: '92K+' },
      { rating: 4.8, orders: '115K+' },
      { rating: 4.9, orders: '87K+' }
    ];

    const stats = fixedStats[index] || { rating: 4.8, orders: '50K+' };

    return {
      ...platform,
      serviceCount: platformServices.length,
      startingPrice: `₺${minPrice.toFixed(2)}`,
      services: platformServices.slice(0, 4).map(s => s.category),
      rating: stats.rating,
      orders: stats.orders
    };
  });

  const filteredPlatforms = platformsWithStats.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Tüm Hizmetlerimiz
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            {activePlatforms.length} farklı sosyal medya platformu için profesyonel büyüme hizmetleri
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Platform ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                    : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredPlatforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Service Header */}
                <div className={`bg-gradient-to-br ${platform.color} p-4 sm:p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-2 right-2 bg-white/20 rounded-full px-2 py-1 text-xs font-medium">
                    Aktif
                  </div>
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                    {platform.image ? (
                      <img 
                        src={platform.image} 
                        alt={platform.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                      />
                    ) : (
                      platform.icon
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{platform.name}</h3>
                  <p className="text-white/90 text-xs sm:text-sm">{platform.description}</p>
                </div>

                {/* Service Info */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {platform.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {platform.orders} sipariş
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 sm:mb-6">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Hizmetler ({platform.serviceCount}):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {platform.services.slice(0, 3).map((serviceType, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg"
                        >
                          {serviceType}
                        </span>
                      ))}
                      {platform.services.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                          +{platform.services.length - 3} daha
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {platform.startingPrice}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        başlangıç fiyatı
                      </div>
                    </div>
                    <Link to={`/services/${platform.name.toLowerCase()}`}>
                      <Button className="group-hover:scale-105 transition-transform duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2">
                        İncele
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredPlatforms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Sonuç bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 px-4">
              Aradığınız kriterlere uygun hizmet bulunamadı. Lütfen farklı arama yapın.
            </p>
            <Button onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}>
              Filtreleri Temizle
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;