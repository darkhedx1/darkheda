import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram,
  Youtube,
  Shield,
  CheckCircle,
  Award,
  Clock,
  Users,
  TrendingUp,
  CreditCard,
  Zap,
  Star,
  Crown,
  Sparkles
} from 'lucide-react';
import { useServices } from '../../contexts/ServiceContext';
import Logo from '../UI/Logo';
import Newsletter from '../Footer/Newsletter';

const Footer: React.FC = () => {
  const { platforms } = useServices();
  const currentYear = new Date().getFullYear();

  // Aktif platformları al
  const activePlatforms = platforms.filter(p => p.isActive).slice(0, 16);

  const features = [
    { icon: Users, title: '750K+', subtitle: 'Aktif Müşteri', color: 'from-blue-500 to-cyan-500' },
    { icon: TrendingUp, title: '2.1M+', subtitle: 'Başarılı Sipariş', color: 'from-emerald-500 to-green-500' },
    { icon: Award, title: `${platforms.filter(p => p.isActive).length}+`, subtitle: 'Platform Desteği', color: 'from-purple-500 to-pink-500' },
    { icon: Clock, title: '8 YIL', subtitle: 'Sektör Tecrübesi', color: 'from-orange-500 to-red-500' }
  ];

  return (
    <footer className="bg-dark-900 text-white">
      {/* Features Section */}
      <div className="border-t border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-premium font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Güvenilir Büyüme
              </span>
            </h2>
            <p className="text-gray-400 text-lg font-premium">
              8 yıllık tecrübemizle sosyal medya dünyasında lider konumdayız
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-premium font-bold text-white mb-2">{feature.title}</div>
                <div className="text-gray-400 font-premium">{feature.subtitle}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info - Premium Logo */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo size="md" variant="white" />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed font-premium">
              Türkiye'nin en güvenilir sosyal medya hizmet sağlayıcısı. 
              8 yıllık tecrübemizle kaliteli ve hızlı hizmet sunuyoruz.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300 font-premium">0555 191 2663</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300 font-premium">garantitakipcim@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300 font-premium">İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Services - Dinamik Platform Listesi */}
          <div>
            <h3 className="text-lg font-premium font-semibold mb-6">Hizmetler</h3>
            <div className="grid grid-cols-2 gap-2">
              {activePlatforms.map((platform, index) => (
                <Link
                  key={platform.id}
                  to={`/services/${platform.name.toLowerCase()}`}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-sm py-1 font-premium"
                >
                  {platform.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-premium font-semibold mb-6">Kurumsal</h3>
            <div className="space-y-3">
              {[
                { name: 'Hakkımızda', href: '/about' },
                { name: 'Blog', href: '/blog' },
                { name: 'Sıkça Sorulanlar', href: '/faq' },
                { name: 'İletişim', href: '/contact' },
                { name: 'Kullanım Şartları', href: '/terms' },
                { name: 'Gizlilik Politikası', href: '/privacy' },
                { name: 'Ücretsiz Araçlar', href: '/tools' },
                { name: 'API Dokümantasyonu', href: '/api' }
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 block text-sm font-premium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter - İşlevsel Bülten */}
          <div>
            <Newsletter />
            
            {/* Social Links */}
            <div className="mt-6">
              <p className="text-gray-400 text-sm mb-3 font-premium">Bizi Takip Edin</p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-sky-500 transition-colors duration-200">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-200">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm font-premium">
              © {currentYear} Garanti Takipçim. Tüm hakları saklıdır.
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm font-premium">Ödeme Yöntemleri:</span>
              <div className="flex space-x-2">
                <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-10 h-6 bg-gradient-to-r from-red-600 to-orange-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-10 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  PP
                </div>
                <div className="w-10 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  PAP
                </div>
                <div className="w-10 h-6 bg-gradient-to-r from-green-600 to-green-800 rounded text-white text-xs flex items-center justify-center font-bold">
                  EFT
                </div>
                <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  KK
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;