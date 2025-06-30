import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Globe,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const contactPersons = [
    {
      name: "Berk Taha Keskin",
      phone: "+90 533 582 20 64",
      role: "Müşteri Hizmetleri Müdürü",
      avatar: '👨‍💼',
      description: "Genel müşteri sorunları ve sipariş takibi için"
    },
    {
      name: "Ömer Emir Erdoğan",
      phone: "+90 555 191 2663", 
      role: "Teknik Destek Uzmanı",
      avatar: '👨‍💻',
      description: "Teknik sorunlar ve özel talepler için"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Merhaba ${name}! Garanti Takipçim hakkında bilgi almak istiyorum.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const contactInfo = [
    {
      icon: MessageCircle,
      title: 'WhatsApp Canlı Destek',
      value: 'İki uzmanımızla iletişim',
      description: '7/24 müşteri hizmetleri',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Mail,
      title: 'E-posta',
      value: 'garantitakipcim@gmail.com',
      description: 'Genel sorularınız için',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Telefon Desteği',
      value: 'Çoklu hat desteği',
      description: '7/24 Müşteri Hizmetleri',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      value: '7/24 Hizmet',
      description: 'Kesintisiz destek',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const faqItems = [
    {
      question: 'Siparişim ne kadar sürede teslim edilir?',
      answer: 'Çoğu siparişimiz 0-1 saat içinde teslim edilir. Bazı özel paketlerde teslimat süresi 24 saate kadar çıkabilir.'
    },
    {
      question: 'Hizmetleriniz güvenli mi?',
      answer: 'Evet, tüm hizmetlerimiz %100 güvenlidir. Gerçek ve aktif hesaplardan hizmet sunuyoruz.'
    },
    {
      question: 'Ödeme yöntemleriniz nelerdir?',
      answer: 'Kredi kartı, banka kartı, Papara ve havale/EFT ile ödeme yapabilirsiniz.'
    },
    {
      question: 'Drop koruması nedir?',
      answer: 'Drop koruması, sipariş sonrası takipçi/beğeni kaybı durumunda ücretsiz tamamlama garantisidir.'
    }
  ];

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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              İletişim
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Size nasıl yardımcı olabiliriz? 7/24 buradayız!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white dark:bg-dark-900 p-8 rounded-2xl shadow-lg"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl mb-6`}>
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {info.title}
                </h3>
                <div className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                  {info.value}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Persons */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Uzman Ekibimiz
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Deneyimli uzmanlarımızla doğrudan iletişime geçin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {contactPersons.map((person, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8"
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    {person.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {person.name}
                  </h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                    {person.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {person.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">{person.phone}</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      onClick={() => openWhatsApp(person.phone, person.name)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(`tel:${person.phone}`)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Ara
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white dark:bg-dark-900 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Bize Mesaj Gönderin
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        E-posta
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Konu
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Konu seçiniz</option>
                      <option value="general">Genel Bilgi</option>
                      <option value="order">Sipariş Sorunu</option>
                      <option value="payment">Ödeme Sorunu</option>
                      <option value="technical">Teknik Destek</option>
                      <option value="partnership">İş Ortaklığı</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mesajınız
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={loading}
                    icon={Send}
                  >
                    Mesaj Gönder
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white dark:bg-dark-900 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Sıkça Sorulan Sorular
                </h2>
                <div className="space-y-6">
                  {faqItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-200 dark:border-dark-700 pb-4 last:border-b-0"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.question}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ofisimiz
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              İstanbul merkezli ekibimizle Türkiye geneline hizmet veriyoruz
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-lg"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Adres Bilgileri
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Garanti Takipçim Merkez Ofis
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Maslak Mahallesi, Büyükdere Caddesi<br />
                      No: 123, Kat: 5<br />
                      34485 Sarıyer / İstanbul
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      <span>Berk Taha Keskin: +90 533 582 20 64</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      <span>Ömer Emir Erdoğan: +90 555 191 2663</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      <span>garantitakipcim@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Google Maps Embed */}
              <div className="rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.8654285524!2d29.01073!3d41.10766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8ca058b28c20b6c3!2sMaslak%2C%20B%C3%BCy%C3%BCkdere%20Cd.%2C%2034485%20Sar%C4%B1yer%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1703123456789!5m2!1str!2str"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Garanti Takipçim Ofis Konumu"
                  className="w-full h-64 rounded-xl"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;