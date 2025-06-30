import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  Shield, 
  Clock, 
  Target,
  Heart,
  Zap,
  Globe
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { icon: Users, value: '500K+', label: 'Mutlu Müşteri' },
    { icon: Award, value: '1.5M+', label: 'Başarılı Sipariş' },
    { icon: Clock, value: '8 YIL', label: 'Tecrübe' },
    { icon: Globe, value: '30+', label: 'Platform Desteği' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Güvenilirlik',
      description: '8 yıllık tecrübemizle sektörün en güvenilir hizmet sağlayıcısıyız.'
    },
    {
      icon: Zap,
      title: 'Hızlı Teslimat',
      description: 'Siparişlerinizi dakikalar içinde teslim ediyoruz.'
    },
    {
      icon: Heart,
      title: 'Müşteri Memnuniyeti',
      description: 'Müşteri memnuniyeti bizim için her şeyden önemlidir.'
    },
    {
      icon: Target,
      title: 'Kaliteli Hizmet',
      description: 'Sadece gerçek ve aktif hesaplardan hizmet sunuyoruz.'
    }
  ];

  const team = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Kurucu & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      description: 'Sosyal medya pazarlama alanında 10 yıllık deneyime sahip.'
    },
    {
      name: 'Elif Kaya',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      description: 'Teknoloji ve yazılım geliştirme konusunda uzman.'
    },
    {
      name: 'Mehmet Demir',
      role: 'Müşteri Hizmetleri Müdürü',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      description: '7/24 müşteri desteği konusunda deneyimli.'
    },
    {
      name: 'Ayşe Özkan',
      role: 'Pazarlama Müdürü',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      description: 'Dijital pazarlama stratejileri konusunda uzman.'
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
              Hakkımızda
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              2016 yılından beri sosyal medya büyüme hizmetlerinde Türkiye'nin lideri
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Hikayemiz
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Garanti Takipçim, 2016 yılında sosyal medya pazarlama alanındaki boşluğu doldurmak 
                  amacıyla kuruldu. Kuruluşumuzdan bu yana, binlerce müşteriye kaliteli ve 
                  güvenilir hizmet sunarak sektörün lideri konumuna geldik.
                </p>
                <p>
                  Misyonumuz, bireyler ve işletmelerin sosyal medya varlıklarını güçlendirmek, 
                  dijital dünyada daha görünür olmalarını sağlamaktır. Bu doğrultuda, 
                  sürekli gelişen teknoloji ve değişen sosyal medya trendlerini yakından takip ederek 
                  hizmetlerimizi güncel tutuyoruz.
                </p>
                <p>
                  8 yıllık tecrübemiz boyunca, 500.000'den fazla müşteriye hizmet verdik ve 
                  1.5 milyondan fazla siparişi başarıyla tamamladık. Bu başarının arkasında, 
                  müşteri memnuniyetini her şeyin üstünde tutan anlayışımız yatmaktadır.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="Ekibimiz"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Profesyonel Ekibimiz</h3>
                  <p className="text-white/90">Deneyimli uzmanlarımızla hizmetinizdeyiz</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Çalışma prensiplerimiz ve müşterilerimize verdiğimiz değer
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white dark:bg-dark-900 p-8 rounded-2xl shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ekibimiz
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Deneyimli ve uzman kadromuzla sizlere en iyi hizmeti sunuyoruz
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-lg"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <div className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                  {member.role}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-500 to-accent-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bizimle Büyümeye Hazır mısınız?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              8 yıllık tecrübemiz ve binlerce memnun müşterimizle sosyal medya büyüme 
              yolculuğunuzda yanınızdayız.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Hemen Başlayın
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200">
                İletişime Geçin
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;