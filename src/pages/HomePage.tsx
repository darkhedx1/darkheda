import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Users, 
  Zap, 
  Shield, 
  ArrowRight,
  Play,
  CheckCircle,
  TrendingUp,
  Clock,
  Award,
  Heart
} from 'lucide-react';
import { useServices } from '../contexts/ServiceContext';
import Button from '../components/UI/Button';

const HomePage: React.FC = () => {
  const { platforms, services } = useServices();

  // Aktif platformları al ve ilk 8'ini göster
  const activePlatforms = platforms
    .filter(platform => platform.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 8);

  // Her platform için hizmet sayısını ve başlangıç fiyatını hesapla - SABİT DEĞERLER
  const platformsWithStats = activePlatforms.map((platform, index) => {
    const platformServices = services.filter(service => 
      service.platform === platform.name && service.isActive
    );
    
    const minPrice = platformServices.length > 0 
      ? Math.min(...platformServices.flatMap(service => service.prices.map(p => p.price)))
      : 3.50;

    const serviceTypes = [...new Set(platformServices.map(s => s.category))];

    // SABİT DEĞERLER - Artık değişmeyecek
    const fixedStats = [
      { rating: 4.8, orders: '125K+' },
      { rating: 4.9, orders: '89K+' },
      { rating: 4.7, orders: '156K+' },
      { rating: 4.8, orders: '203K+' },
      { rating: 4.9, orders: '78K+' },
      { rating: 4.6, orders: '134K+' },
      { rating: 4.8, orders: '167K+' },
      { rating: 4.7, orders: '92K+' }
    ];

    const stats = fixedStats[index] || { rating: 4.8, orders: '50K+' };

    return {
      ...platform,
      serviceCount: platformServices.length,
      startingPrice: `₺${minPrice.toFixed(2)}`,
      services: serviceTypes.slice(0, 4),
      rating: stats.rating,
      orders: stats.orders
    };
  });

  const features = [
    {
      icon: Zap,
      title: 'Hızlı Teslimat',
      description: 'Siparişleriniz dakikalar içinde teslim edilir',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Güvenilir Hizmet',
      description: '8 yıllık tecrübe ile güvenli hizmet',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: Users,
      title: '750K+ Müşteri',
      description: 'Binlerce memnun müşteri',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      title: '7/24 Destek',
      description: 'Kesintisiz müşteri desteği',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const testimonials = [
    {
      name: 'Elif Kaya',
      role: 'İçerik Üreticisi',
      content: 'Sosyal medya hesaplarımı geliştirmek için Garanti Takipçim\'i tercih ediyorum. Hızlı ve güvenilir!',
      rating: 5,
      avatar: '👩‍💼',
      gender: 'female'
    },
    {
      name: 'Ahmet Yılmaz',
      role: 'Dijital Pazarlama Uzmanı',
      content: 'İnanılmaz bir hizmet kalitesi! Müşteri hizmetleri çok anlayışlı ve yardımsever.',
      rating: 5,
      avatar: '👨‍💻',
      gender: 'male'
    },
    {
      name: 'Zeynep Demir',
      role: 'Influencer',
      content: 'Organik büyüme için harika bir platform. Gerçek sonuçlar elde ediyorum.',
      rating: 5,
      avatar: '👩‍🎨',
      gender: 'female'
    },
    {
      name: 'Murat Özkan',
      role: 'YouTuber',
      content: 'Gerçek takipçiler ve hızlı teslimat. Sosyal medya büyümem için vazgeçilmez.',
      rating: 5,
      avatar: '👨‍🎬',
      gender: 'male'
    }
  ];

  const stats = [
    { value: '750K+', label: 'Aktif Müşteri', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { value: '2.1M+', label: 'Başarılı Sipariş', icon: TrendingUp, color: 'from-emerald-500 to-green-500' },
    { value: `${platforms.filter(p => p.isActive).length}+`, label: 'Platform Desteği', icon: Award, color: 'from-purple-500 to-pink-500' },
    { value: '8 YIL', label: 'Sektör Tecrübesi', icon: Clock, color: 'from-orange-500 to-red-500' }
  ];

  const customerAvatars = [
    { emoji: '👨‍💼', bg: 'from-blue-500 to-indigo-600' },
    { emoji: '👩‍💻', bg: 'from-purple-500 to-pink-600' },
    { emoji: '👨‍🎨', bg: 'from-green-500 to-teal-600' },
    { emoji: '👩‍🔬', bg: 'from-orange-500 to-red-600' },
    { emoji: '👨‍🚀', bg: 'from-cyan-500 to-blue-600' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 sm:w-80 h-56 sm:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-full border border-emerald-500/30 mb-4 sm:mb-6">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-2" />
                <span className="text-xs sm:text-sm font-medium">4.9 Yıldız • 15K+ Değerlendirme</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Garanti Takipçim
                </span>
                <br />
                ile Sosyal Medyada
                <br />
                <span className="text-white">Güvenle Büyü!</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-4 lg:px-0">
                Türkiye'nin en güvenilir sosyal medya büyüme platformu. 
                8 yıllık tecrübemiz ve 750K+ memnun müşterimizle yanınızdayız.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 px-4 lg:px-0">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                    Hemen Başla
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 border-white/20 text-white hover:bg-white/10">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Nasıl Çalışır?
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-4 sm:space-x-8 px-4 lg:px-0">
                <div className="flex -space-x-2">
                  {customerAvatars.map((avatar, index) => (
                    <div 
                      key={index} 
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gradient-to-br ${avatar.bg} flex items-center justify-center text-sm sm:text-base shadow-lg`}
                    >
                      {avatar.emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold">750K+</div>
                  <div className="text-gray-400 text-xs sm:text-sm">Mutlu Müşteri</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative px-4 lg:px-0"
            >
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-dark-800/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Garantili Büyüme!</h3>
                    <p className="text-gray-400 text-sm sm:text-base">Organik büyüme paketleriyle sosyal medya hesaplarınızı güçlendirin</p>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {['Gerçek ve Aktif Takipçiler', 'Hızla Artan Etkileşim', '7/24 Kesintisiz Destek', 'Drop Koruması Garantisi'].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-white">%20</div>
                        <div className="text-gray-400 text-xs sm:text-sm">İNDİRİM</div>
                      </div>
                      <Link to="/services">
                        <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-sm sm:text-base">
                          Hemen İncele
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Platforms - Dinamik Veriler */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Popüler Platformlar
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4">
              {platforms.filter(p => p.isActive).length} büyük sosyal medya platformu için profesyonel hizmetlerimiz
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {platformsWithStats.map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Link
                  to={`/services/${platform.name.toLowerCase()}`}
                  className="block bg-white dark:bg-dark-900 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className={`bg-gradient-to-br ${platform.color} p-4 sm:p-6 text-white relative`}>
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/20 rounded-full px-2 py-1 text-xs font-medium">
                      {platform.orders}
                    </div>
                    <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">
                      {platform.image ? (
                        <img 
                          src={platform.image} 
                          alt={platform.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
                        />
                      ) : (
                        platform.icon
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{platform.name}</h3>
                    <p className="text-white/90 text-xs sm:text-sm">{platform.description}</p>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {platform.services.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg"
                        >
                          {service}
                        </span>
                      ))}
                      {platform.services.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                          +{platform.services.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {platform.startingPrice}'den başlayan fiyatlar
                      </div>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mt-8 sm:mt-12"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              {platforms.filter(p => p.isActive).length}+ platform için hizmetlerimizi görmek için
            </p>
            <Link to="/services">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-sm sm:text-base">
                Tüm Hizmetleri Gör
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Neden Garanti Takipçim?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              8 yıllık tecrübemiz ve 750K+ memnun müşterimizle sektörün lideri konumundayız
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base px-2">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Güvenilir Büyüme
              </span>
            </h2>
            <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto px-4">
              8 yıllık tecrübemizle sosyal medya dünyasında lider konumdayız
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${stat.color} rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 group-hover:scale-110 transition-all duration-300 shadow-2xl`}>
                  <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-white/70 font-medium text-sm sm:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4">
              750K+ memnun müşterimizden bazı yorumlar
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-900 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${
                    testimonial.gender === 'female' 
                      ? 'from-pink-400 to-purple-500' 
                      : 'from-blue-400 to-indigo-500'
                  } flex items-center justify-center text-lg sm:text-xl shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {testimonial.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-dark-900 to-dark-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-4">
              Sosyal Medyada Güvenle Büyümeye Hazır mısınız?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Sosyal medya hesaplarınızı bir üst seviyeye taşımak için garantili paketlerimizi keşfedin. 
              Hemen başlayın ve farkı görün!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                  Hemen Kayıt Ol
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 border-white/20 text-white hover:bg-white/10">
                  Paketleri İncele
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;