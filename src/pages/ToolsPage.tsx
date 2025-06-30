import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Instagram, 
  Youtube, 
  Music, 
  BarChart3, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle,
  TrendingUp,
  Calendar,
  Download,
  ExternalLink,
  Zap,
  Shield,
  Clock,
  User,
  UserCheck,
  Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';

const ToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('instagram');
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
    { id: 'tiktok', name: 'TikTok', icon: Music, color: 'from-gray-800 to-gray-900' }
  ];

  const tools = {
    instagram: [
      {
        id: 1,
        name: 'Profil Analizi',
        description: 'Instagram profilinizin detaylı analizini yapın',
        icon: BarChart3,
        features: ['Takipçi analizi', 'Etkileşim oranı', 'En iyi paylaşım zamanları', 'Hashtag önerileri'],
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 2,
        name: 'Takipçi Kalitesi',
        description: 'Takipçilerinizin kalitesini ve gerçekliğini kontrol edin',
        icon: Users,
        features: ['Sahte takipçi tespiti', 'Aktif takipçi oranı', 'Coğrafi dağılım', 'Yaş ve cinsiyet analizi'],
        color: 'from-emerald-500 to-green-500'
      },
      {
        id: 3,
        name: 'Hashtag Analizi',
        description: 'En etkili hashtagleri keşfedin ve analiz edin',
        icon: Search,
        features: ['Trend hashtagler', 'Hashtag performansı', 'Rekabet analizi', 'Önerilen hashtagler'],
        color: 'from-purple-500 to-pink-500'
      },
      {
        id: 4,
        name: 'İçerik Planlayıcı',
        description: 'İçerik takvimi oluşturun ve paylaşım zamanlarını optimize edin',
        icon: Calendar,
        features: ['İçerik takvimi', 'En iyi paylaşım saatleri', 'İçerik önerileri', 'Performans takibi'],
        color: 'from-orange-500 to-red-500'
      }
    ],
    youtube: [
      {
        id: 1,
        name: 'Kanal Analizi',
        description: 'YouTube kanalınızın detaylı performans analizini yapın',
        icon: BarChart3,
        features: ['Abone analizi', 'İzlenme istatistikleri', 'Video performansı', 'Gelir analizi'],
        color: 'from-red-500 to-pink-500'
      },
      {
        id: 2,
        name: 'Video SEO',
        description: 'Videolarınızın SEO performansını optimize edin',
        icon: TrendingUp,
        features: ['Anahtar kelime analizi', 'Başlık optimizasyonu', 'Açıklama önerileri', 'Etiket önerileri'],
        color: 'from-blue-500 to-purple-500'
      },
      {
        id: 3,
        name: 'Rakip Analizi',
        description: 'Rakip kanalları analiz edin ve stratejinizi geliştirin',
        icon: Eye,
        features: ['Rakip kanal analizi', 'İçerik karşılaştırması', 'Trend takibi', 'Fırsat analizi'],
        color: 'from-green-500 to-teal-500'
      }
    ],
    tiktok: [
      {
        id: 1,
        name: 'Profil Analizi',
        description: 'TikTok profilinizin detaylı analizini yapın',
        icon: BarChart3,
        features: ['Takipçi büyümesi', 'Video performansı', 'Etkileşim analizi', 'Trend takibi'],
        color: 'from-gray-700 to-gray-900'
      },
      {
        id: 2,
        name: 'Trend Takibi',
        description: 'Güncel TikTok trendlerini takip edin',
        icon: TrendingUp,
        features: ['Viral içerikler', 'Trend müzikler', 'Hashtag trendleri', 'Challenge takibi'],
        color: 'from-pink-500 to-red-500'
      },
      {
        id: 3,
        name: 'İçerik Önerileri',
        description: 'Viral olma potansiyeli yüksek içerik önerileri alın',
        icon: Zap,
        features: ['İçerik fikirleri', 'Optimal video süresi', 'En iyi paylaşım saatleri', 'Müzik önerileri'],
        color: 'from-cyan-500 to-blue-500'
      }
    ]
  };

  const handleAnalyze = async () => {
    if (!profileUrl.trim()) {
      toast.error('Lütfen geçerli bir profil URL\'si girin');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call and real profile analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract username from URL
      const username = extractUsernameFromUrl(profileUrl);
      
      // Generate realistic mock data based on platform
      const mockData = generateMockAnalysis(activeTab, username);
      setAnalysisResult(mockData);
      
      toast.success('Profil analizi tamamlandı!');
    } catch (error) {
      toast.error('Analiz sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const extractUsernameFromUrl = (url: string): string => {
    // Extract username from various social media URL formats
    const patterns = {
      instagram: /(?:instagram\.com\/)?([a-zA-Z0-9_.]+)/,
      youtube: /(?:youtube\.com\/(?:c\/|channel\/|user\/)?)?([a-zA-Z0-9_.-]+)/,
      tiktok: /(?:tiktok\.com\/@)?([a-zA-Z0-9_.]+)/
    };
    
    const pattern = patterns[activeTab as keyof typeof patterns];
    const match = url.match(pattern);
    return match ? match[1] : 'unknown_user';
  };

  const generateMockAnalysis = (platform: string, username: string) => {
    const baseData = {
      username,
      platform,
      profileImage: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
      verified: Math.random() > 0.7,
      analysisDate: new Date().toLocaleDateString('tr-TR')
    };

    switch (platform) {
      case 'instagram':
        return {
          ...baseData,
          followers: Math.floor(Math.random() * 100000) + 1000,
          following: Math.floor(Math.random() * 1000) + 100,
          posts: Math.floor(Math.random() * 500) + 50,
          engagementRate: (Math.random() * 10 + 1).toFixed(2),
          avgLikes: Math.floor(Math.random() * 5000) + 100,
          avgComments: Math.floor(Math.random() * 200) + 10,
          bio: `${username} - Content Creator & Influencer`,
          category: 'Lifestyle',
          lastPost: '2 saat önce'
        };
      
      case 'youtube':
        return {
          ...baseData,
          subscribers: Math.floor(Math.random() * 50000) + 1000,
          totalViews: Math.floor(Math.random() * 1000000) + 10000,
          videoCount: Math.floor(Math.random() * 200) + 10,
          avgViews: Math.floor(Math.random() * 10000) + 500,
          channelAge: Math.floor(Math.random() * 5) + 1,
          description: `${username} YouTube kanalına hoş geldiniz!`,
          category: 'Entertainment',
          lastVideo: '1 gün önce'
        };
      
      case 'tiktok':
        return {
          ...baseData,
          followers: Math.floor(Math.random() * 200000) + 1000,
          following: Math.floor(Math.random() * 500) + 50,
          likes: Math.floor(Math.random() * 500000) + 5000,
          videos: Math.floor(Math.random() * 100) + 20,
          avgViews: Math.floor(Math.random() * 50000) + 1000,
          bio: `${username} 🎵 Content Creator`,
          lastPost: '5 saat önce'
        };
      
      default:
        return baseData;
    }
  };

  const currentTools = tools[activeTab as keyof typeof tools] || [];

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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ücretsiz Araçlar
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Sosyal medya hesaplarınızı analiz edin ve büyüme stratejinizi geliştirin
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platform Tabs */}
      <section className="py-8 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-white dark:bg-dark-900 rounded-lg p-1 shadow-lg">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => setActiveTab(platform.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === platform.id
                      ? `bg-gradient-to-r ${platform.color} text-white shadow-lg`
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <platform.icon className="w-5 h-5" />
                  <span className="font-medium">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Analyzer */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Hızlı Profil Analizi
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {platforms.find(p => p.id === activeTab)?.name} profil URL'nizi girin ve anında analiz edin
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <input
                  type="url"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder={`${platforms.find(p => p.id === activeTab)?.name} profil URL'nizi girin...`}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                loading={loading}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 px-8"
              >
                Analiz Et
              </Button>
            </div>
            
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                  <span>Profil analiz ediliyor...</span>
                </div>
              </motion.div>
            )}

            {/* Analysis Results */}
            {analysisResult && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={analysisResult.profileImage}
                    alt={analysisResult.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        @{analysisResult.username}
                      </h3>
                      {analysisResult.verified && (
                        <UserCheck className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {analysisResult.platform.charAt(0).toUpperCase() + analysisResult.platform.slice(1)} Profili
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {activeTab === 'instagram' && (
                    <>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <Users className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {analysisResult.followers.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Takipçi</div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {analysisResult.posts}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Gönderi</div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          %{analysisResult.engagementRate}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Etkileşim</div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {analysisResult.avgLikes.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Ort. Beğeni</div>
                      </div>
                    </>
                  )}

                  {activeTab === 'youtube' && (
                    <>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <Users className="w-6 h-6 text-red-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {analysisResult.subscribers.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Abone</div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <Eye className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {(analysisResult.totalViews / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Toplam İzlenme</div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <Activity className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {analysisResult.videoCount}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Video</div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {analysisResult.avgViews.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Ort. İzlenme</div>
                      </div>
                    </>
                  )}

                  {activeTab === 'tiktok' && (
                    <>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <Users className="w-6 h-6 text-gray-800 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {analysisResult.followers.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Takipçi</div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {(analysisResult.likes / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Toplam Beğeni</div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {analysisResult.videos}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Video</div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                        <Eye className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {(analysisResult.avgViews / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Ort. İzlenme</div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Analiz Tarihi: {analysisResult.analysisDate}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {platforms.find(p => p.id === activeTab)?.name} Araçları
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Profesyonel analiz araçlarıyla hesabınızı optimize edin
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`bg-gradient-to-br ${tool.color} p-6 text-white`}>
                  <tool.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                  <p className="text-white/90 text-sm">{tool.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 group-hover:border-emerald-500 group-hover:text-emerald-600"
                      onClick={() => toast.success('Araç yakında aktif olacak!')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Dene
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                      onClick={() => toast.success('Rapor özelliği yakında!')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Rapor Al
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Neden Araçlarımızı Kullanmalısınız?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Profesyonel analiz araçlarımızla sosyal medya stratejinizi geliştirin
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Hızlı Analiz',
                description: 'Saniyeler içinde detaylı analiz sonuçları alın',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Shield,
                title: 'Güvenli ve Gizli',
                description: 'Verileriniz güvende, hiçbir bilgi saklanmaz',
                color: 'from-emerald-500 to-green-500'
              },
              {
                icon: Clock,
                title: '7/24 Erişim',
                description: 'İstediğiniz zaman araçlarımızı kullanabilirsiniz',
                color: 'from-blue-500 to-purple-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Daha Fazla Özellik İstiyorsanız
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Premium hesabınızla daha detaylı analizler ve özel raporlara erişin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3"
                onClick={() => toast.success('Premium özellikler yakında!')}
              >
                Premium'a Geç
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-3"
                onClick={() => toast.success('Tüm özellikler yakında!')}
              >
                Tüm Özellikleri Gör
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ToolsPage;