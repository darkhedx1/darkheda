import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import Button from '../components/UI/Button';

const BlogPage: React.FC = () => {
  const featuredPost = {
    id: 1,
    title: 'Instagram Algoritması 2024: Yeni Güncellemeler ve Stratejiler',
    excerpt: 'Instagram\'ın 2024 yılında getirdiği algoritma değişiklikleri ve bu değişikliklere nasıl adapte olabileceğiniz hakkında detaylı rehber. Organik erişimi artırmak için bilmeniz gereken tüm ipuçları.',
    image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    author: 'Emir Erdoğan',
    date: '15 Aralık 2024',
    readTime: '8 dk',
    category: 'Instagram',
    tags: ['algoritma', 'instagram', 'sosyal medya', '2024']
  };

  const blogPosts = [
    {
      id: 2,
      title: 'TikTok\'ta Viral Olmanın 10 Altın Kuralı',
      excerpt: 'TikTok\'ta içeriklerinizin viral olması için uygulamanız gereken stratejiler ve ipuçları. Algoritmanın nasıl çalıştığını öğrenin ve viral içerikler üretin.',
      image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      author: 'Sosyal Medya Uzmanı',
      date: '12 Aralık 2024',
      readTime: '6 dk',
      category: 'TikTok',
      tags: ['tiktok', 'viral', 'içerik', 'strateji']
    },
    {
      id: 3,
      title: 'YouTube SEO: Videolarınızı Keşfedilebilir Yapın',
      excerpt: 'YouTube videolarınızın daha fazla izlenmesi için SEO optimizasyonu nasıl yapılır? Anahtar kelime araştırmasından thumbnail tasarımına kadar her şey.',
      image: 'https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      author: 'SEO Uzmanı',
      date: '10 Aralık 2024',
      readTime: '10 dk',
      category: 'YouTube',
      tags: ['youtube', 'seo', 'video', 'optimizasyon']
    },
    {
      id: 4,
      title: 'Twitter/X\'te Etkileşim Artırma Teknikleri',
      excerpt: 'Twitter\'da takipçilerinizle daha fazla etkileşim kurmanın yolları. Thread yazma sanatından hashtag kullanımına kadar etkili stratejiler.',
      image: 'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      author: 'Sosyal Medya Uzmanı',
      date: '8 Aralık 2024',
      readTime: '5 dk',
      category: 'Twitter',
      tags: ['twitter', 'etkileşim', 'sosyal medya', 'thread']
    },
    {
      id: 5,
      title: 'Sosyal Medya İçerik Takvimi Nasıl Hazırlanır?',
      excerpt: 'Düzenli ve etkili içerik paylaşımı için içerik takvimi oluşturma rehberi. Planlama araçları ve stratejiler ile sosyal medya yönetiminizi profesyonelleştirin.',
      image: 'https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      author: 'İçerik Stratejisti',
      date: '5 Aralık 2024',
      readTime: '7 dk',
      category: 'Strateji',
      tags: ['içerik', 'planlama', 'strateji', 'takvim']
    },
    {
      id: 6,
      title: 'Influencer Marketing: Doğru İşbirlikleri Nasıl Kurulur?',
      excerpt: 'Markanız için en uygun influencer\'ları bulma ve işbirliği kurma stratejileri. ROI hesaplama ve kampanya yönetimi için kapsamlı rehber.',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      author: 'Pazarlama Uzmanı',
      date: '3 Aralık 2024',
      readTime: '9 dk',
      category: 'Pazarlama',
      tags: ['influencer', 'pazarlama', 'işbirliği', 'marka']
    }
  ];

  const categories = [
    { name: 'Tümü', count: 25 },
    { name: 'Instagram', count: 8 },
    { name: 'TikTok', count: 6 },
    { name: 'YouTube', count: 5 },
    { name: 'Twitter', count: 4 },
    { name: 'Strateji', count: 7 },
    { name: 'Pazarlama', count: 5 }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Blog
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Sosyal medya dünyasındaki en güncel trendler, ipuçları ve stratejiler
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Öne Çıkan
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">
                    {featuredPost.category}
                  </span>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                  </div>
                  <Link to={`/blog/${featuredPost.id}`}>
                    <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Kategoriler
                </h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Popüler Etiketler
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['sosyal medya', 'instagram', 'tiktok', 'youtube', 'strateji', 'pazarlama', 'içerik', 'algoritma', 'viral', 'etkileşim'].map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer transition-colors duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 dark:bg-dark-800/90 text-gray-900 dark:text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-sm flex items-center space-x-1"
                        >
                          <span>Devamını Oku</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Load More */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-center mt-12"
              >
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                  Daha Fazla Yükle
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Blog Güncellemelerini Kaçırmayın
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Sosyal medya dünyasındaki en güncel gelişmeleri ve ipuçlarını e-posta ile alın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <Button className="bg-white text-emerald-600 hover:bg-gray-100">
                Abone Ol
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;