import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Search, 
  HelpCircle,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';
import Button from '../components/UI/Button';

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = [
    { id: 'all', name: 'Tümü', count: 24 },
    { id: 'orders', name: 'Siparişler', count: 8 },
    { id: 'payment', name: 'Ödeme', count: 6 },
    { id: 'delivery', name: 'Teslimat', count: 5 },
    { id: 'account', name: 'Hesap', count: 5 }
  ];

  const faqData = [
    {
      id: 1,
      category: 'orders',
      question: 'Sipariş nasıl verebilirim?',
      answer: 'Sipariş vermek için önce hesap oluşturmanız gerekiyor. Hesabınıza giriş yaptıktan sonra istediğiniz hizmeti seçin, miktarı belirleyin ve ödeme işlemini tamamlayın. Sipariş otomatik olarak işleme alınacaktır.'
    },
    {
      id: 2,
      category: 'orders',
      question: 'Siparişimi nasıl takip edebilirim?',
      answer: 'Hesabınıza giriş yaparak "Siparişlerim" bölümünden tüm siparişlerinizi ve durumlarını görebilirsiniz. Ayrıca sipariş durumu değişikliklerinde e-posta bildirimi alırsınız.'
    },
    {
      id: 3,
      category: 'orders',
      question: 'Siparişimi iptal edebilir miyim?',
      answer: 'Henüz işleme alınmamış siparişleri iptal edebilirsiniz. İşleme alınan siparişler için iptal işlemi mümkün değildir. İptal talepleriniz için müşteri hizmetleri ile iletişime geçin.'
    },
    {
      id: 4,
      category: 'payment',
      question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
      answer: 'Kredi kartı, banka kartı, Papara ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödeme işlemleri SSL sertifikası ile güvence altındadır.'
    },
    {
      id: 5,
      category: 'payment',
      question: 'Bakiye nasıl yüklerim?',
      answer: 'Hesabınıza giriş yaparak "Bakiye Yükle" bölümünden istediğiniz tutarı seçip ödeme yapabilirsiniz. Bakiye yükleme işlemi anında gerçekleşir.'
    },
    {
      id: 6,
      category: 'payment',
      question: 'Ödeme güvenli mi?',
      answer: 'Evet, tüm ödeme işlemleri 256-bit SSL şifreleme ile korunmaktadır. Kredi kartı bilgileriniz bizim sunucularımızda saklanmaz.'
    },
    {
      id: 7,
      category: 'delivery',
      question: 'Siparişim ne kadar sürede teslim edilir?',
      answer: 'Çoğu siparişimiz 0-1 saat içinde teslim edilir. Bazı özel paketlerde teslimat süresi 24 saate kadar çıkabilir. Her hizmet için teslimat süresi ürün sayfasında belirtilmiştir.'
    },
    {
      id: 8,
      category: 'delivery',
      question: 'Drop koruması nedir?',
      answer: 'Drop koruması, sipariş sonrası takipçi/beğeni kaybı durumunda ücretsiz tamamlama garantisidir. 30 gün boyunca geçerlidir.'
    },
    {
      id: 9,
      category: 'delivery',
      question: 'Siparişim eksik teslim edilirse ne olur?',
      answer: 'Siparişiniz eksik teslim edilirse, eksik kısmı ücretsiz olarak tamamlarız. Bu durumda müşteri hizmetleri ile iletişime geçmeniz yeterlidir.'
    },
    {
      id: 10,
      category: 'account',
      question: 'Hesabımı nasıl oluştururum?',
      answer: 'Ana sayfadaki "Kayıt Ol" butonuna tıklayarak ad, e-posta ve şifre bilgilerinizi girerek hesap oluşturabilirsiniz. E-posta doğrulaması gerekmez.'
    },
    {
      id: 11,
      category: 'account',
      question: 'Şifremi unuttum, ne yapmalıyım?',
      answer: 'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayarak e-posta adresinizi girin. Size şifre sıfırlama linki gönderilecektir.'
    },
    {
      id: 12,
      category: 'account',
      question: 'Hesap bilgilerimi nasıl güncellerim?',
      answer: 'Hesabınıza giriş yaparak "Profil Ayarları" bölümünden ad, e-posta ve şifre bilgilerinizi güncelleyebilirsiniz.'
    }
  ];

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-accent-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <HelpCircle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sıkça Sorulan Sorular
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Merak ettiğiniz her şeyin cevabı burada
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Soru ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredFAQs.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {item.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openItems.includes(item.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Sonuç bulunamadı
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Aradığınız kriterlere uygun soru bulunamadı. Lütfen farklı arama yapın.
              </p>
              <Button onClick={() => {setSearchTerm(''); setActiveCategory('all');}}>
                Filtreleri Temizle
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Aradığınız Cevabı Bulamadınız mı?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              7/24 müşteri destek ekibimiz size yardımcı olmaya hazır
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl shadow-lg">
                <MessageCircle className="w-8 h-8 text-primary-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Canlı Destek
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Anında yardım alın
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Sohbet Başlat
                </Button>
              </div>
              
              <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl shadow-lg">
                <Phone className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Telefon Desteği
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  0850 850 15 15
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Hemen Ara
                </Button>
              </div>
              
              <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl shadow-lg">
                <Mail className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  E-posta Desteği
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  info@sosyalpanel.com
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  E-posta Gönder
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;