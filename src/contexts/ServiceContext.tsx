import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  category: string;
  platform: string;
  prices: Array<{
    amount: number;
    price: number;
  }>;
  features: string[];
  deliveryTime: string;
  quality: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  isActive: boolean;
  order: number;
  image?: string;
}

interface ServiceContextType {
  services: ServicePackage[];
  platforms: Platform[];
  addService: (service: Omit<ServicePackage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateService: (id: string, updates: Partial<ServicePackage>) => void;
  deleteService: (id: string) => void;
  getServicesByPlatform: (platform: string) => ServicePackage[];
  addPlatform: (platform: Omit<Platform, 'id'>) => void;
  updatePlatform: (id: string, updates: Partial<Platform>) => void;
  deletePlatform: (id: string) => void;
  syncData: () => void;
  forceRefresh: () => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// ULTRA GÜÇLÜ CROSS-DEVICE SYNC SİSTEMİ
const STORAGE_KEYS = {
  services: 'garantitakipcim_services_v11',
  platforms: 'garantitakipcim_platforms_v11',
  lastUpdate: 'garantitakipcim_lastupdate_v11',
  version: 'garantitakipcim_version_v11',
  syncTrigger: 'garantitakipcim_sync_trigger_v11'
};

// BROADCAST CHANNEL - Cross-tab communication
let broadcastChannel: BroadcastChannel | null = null;
if (typeof BroadcastChannel !== 'undefined') {
  broadcastChannel = new BroadcastChannel('garantitakipcim_sync');
}

// WEBSOCKET SIMULATION - Server-Sent Events alternative
class SyncManager {
  private static instance: SyncManager;
  private listeners: Set<() => void> = new Set();
  private lastSyncTime = 0;
  private syncInterval: NodeJS.Timeout | null = null;

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  addListener(callback: () => void) {
    this.listeners.add(callback);
    this.startSyncInterval();
  }

  removeListener(callback: () => void) {
    this.listeners.delete(callback);
    if (this.listeners.size === 0) {
      this.stopSyncInterval();
    }
  }

  private startSyncInterval() {
    if (this.syncInterval) return;
    
    // Her 100ms kontrol et - Ultra hızlı sync
    this.syncInterval = setInterval(() => {
      this.checkForUpdates();
    }, 100);
  }

  private stopSyncInterval() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private checkForUpdates() {
    const currentSyncTime = parseInt(localStorage.getItem(STORAGE_KEYS.lastUpdate) || '0');
    
    if (currentSyncTime > this.lastSyncTime) {
      this.lastSyncTime = currentSyncTime;
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Sync listener error:', error);
      }
    });
  }

  triggerSync() {
    const timestamp = Date.now();
    localStorage.setItem(STORAGE_KEYS.lastUpdate, timestamp.toString());
    localStorage.setItem(STORAGE_KEYS.syncTrigger, `${timestamp}_${Math.random()}`);
    
    // Broadcast to other tabs/windows
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'SYNC_UPDATE',
        timestamp,
        source: 'admin_panel'
      });
    }

    // Trigger storage event manually
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEYS.lastUpdate,
      newValue: timestamp.toString(),
      oldValue: this.lastSyncTime.toString()
    }));

    this.notifyListeners();
  }
}

const syncManager = SyncManager.getInstance();

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<ServicePackage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.services);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('🚀 Services loaded:', parsed.length);
        return parsed;
      }
      const defaultData = getDefaultServices();
      console.log('🚀 Using default services:', defaultData.length);
      return defaultData;
    } catch (error) {
      console.error('❌ Services load error:', error);
      return getDefaultServices();
    }
  });

  const [platforms, setPlatforms] = useState<Platform[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.platforms);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('🚀 Platforms loaded:', parsed.length);
        return parsed;
      }
      const defaultData = getDefaultPlatforms();
      console.log('🚀 Using default platforms:', defaultData.length);
      return defaultData;
    } catch (error) {
      console.error('❌ Platforms load error:', error);
      return getDefaultPlatforms();
    }
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ULTRA GÜÇLÜ KAYDETME FONKSİYONU
  const saveToStorage = (newServices?: ServicePackage[], newPlatforms?: Platform[]) => {
    try {
      const timestamp = Date.now();
      const updateId = `${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('🚀 ULTRA: Starting IMMEDIATE save operation...', updateId);
      
      if (newServices) {
        const serviceData = JSON.stringify(newServices);
        localStorage.setItem(STORAGE_KEYS.services, serviceData);
        sessionStorage.setItem(STORAGE_KEYS.services, serviceData);
        setServices([...newServices]);
        console.log('✅ ULTRA: Services saved IMMEDIATELY:', newServices.length);
      }
      
      if (newPlatforms) {
        const platformData = JSON.stringify(newPlatforms);
        localStorage.setItem(STORAGE_KEYS.platforms, platformData);
        sessionStorage.setItem(STORAGE_KEYS.platforms, platformData);
        setPlatforms([...newPlatforms]);
        console.log('✅ ULTRA: Platforms saved IMMEDIATELY:', newPlatforms.length);
      }
      
      // TIMESTAMP KAYDET
      localStorage.setItem(STORAGE_KEYS.lastUpdate, timestamp.toString());
      localStorage.setItem(STORAGE_KEYS.version, '11.0');
      
      setRefreshTrigger(prev => prev + 1);
      
      // ULTRA GÜÇLÜ SYNC TRİGGER
      syncManager.triggerSync();
      
      console.log('🚀 ULTRA: Save operation completed SUCCESSFULLY!', updateId);
      
    } catch (error) {
      console.error('❌ ULTRA: Storage save error:', error);
      toast.error('Veri kaydetme hatası!');
    }
  };

  // ULTRA GÜÇLÜ YÜKLEME FONKSİYONU
  const loadFromStorage = () => {
    try {
      console.log('🔄 ULTRA: Loading data from storage...');
      
      const servicesData = localStorage.getItem(STORAGE_KEYS.services);
      if (servicesData) {
        const parsedServices = JSON.parse(servicesData);
        setServices([...parsedServices]);
        console.log('✅ ULTRA: Services reloaded:', parsedServices.length);
      }
      
      const platformsData = localStorage.getItem(STORAGE_KEYS.platforms);
      if (platformsData) {
        const parsedPlatforms = JSON.parse(platformsData);
        setPlatforms([...parsedPlatforms]);
        console.log('✅ ULTRA: Platforms reloaded:', parsedPlatforms.length);
      }
      
      setRefreshTrigger(prev => prev + 1);
      console.log('🔄 ULTRA: Data loading completed!');
      
    } catch (error) {
      console.error('❌ ULTRA: Storage load error:', error);
    }
  };

  // SYNC MANAGER SETUP
  useEffect(() => {
    const syncCallback = () => {
      console.log('📱 ULTRA: Sync triggered, reloading data...');
      loadFromStorage();
    };

    syncManager.addListener(syncCallback);

    return () => {
      syncManager.removeListener(syncCallback);
    };
  }, []);

  // BROADCAST CHANNEL LISTENER
  useEffect(() => {
    if (!broadcastChannel) return;

    const handleBroadcast = (event: MessageEvent) => {
      if (event.data.type === 'SYNC_UPDATE') {
        console.log('📡 ULTRA: Broadcast received, syncing...');
        setTimeout(loadFromStorage, 10);
      }
    };

    broadcastChannel.addEventListener('message', handleBroadcast);

    return () => {
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcast);
      }
    };
  }, []);

  // STORAGE EVENT LISTENER
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.lastUpdate || e.key === STORAGE_KEYS.syncTrigger) {
        console.log('📱 ULTRA: Storage change detected, reloading...');
        setTimeout(loadFromStorage, 10);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // VISIBILITY CHANGE LISTENER - Mobil için önemli
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('📱 ULTRA: Page visible, syncing...');
        setTimeout(loadFromStorage, 50);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // FOCUS LISTENER - Mobil için önemli
  useEffect(() => {
    const handleFocus = () => {
      console.log('📱 ULTRA: Window focused, syncing...');
      setTimeout(loadFromStorage, 50);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const syncData = () => {
    console.log('📱 ULTRA: Manual sync triggered');
    loadFromStorage();
  };

  const forceRefresh = () => {
    console.log('📱 ULTRA: Force refresh triggered');
    loadFromStorage();
    syncManager.triggerSync();
  };

  const addService = (service: Omit<ServicePackage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newService: ServicePackage = {
      ...service,
      id: `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedServices = [...services, newService];
    console.log('📱 ULTRA: Service added:', newService.id);
    
    saveToStorage(updatedServices, undefined);
    toast.success('Yeni hizmet eklendi!');
  };

  const updateService = (id: string, updates: Partial<ServicePackage>) => {
    const updatedServices = services.map(service => 
      service.id === id 
        ? { ...service, ...updates, updatedAt: new Date().toISOString() }
        : service
    );
    
    console.log('📱 ULTRA: Service updated:', id);
    saveToStorage(updatedServices, undefined);
    toast.success('Hizmet güncellendi!');
  };

  const deleteService = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    console.log('📱 ULTRA: Service deleted:', id);
    
    saveToStorage(updatedServices, undefined);
    toast.success('Hizmet silindi!');
  };

  const getServicesByPlatform = (platform: string) => {
    return services.filter(service => 
      service.platform.toLowerCase() === platform.toLowerCase() && service.isActive
    );
  };

  const addPlatform = (platform: Omit<Platform, 'id'>) => {
    const newPlatform: Platform = {
      ...platform,
      id: `platform_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updatedPlatforms = [...platforms, newPlatform];
    console.log('📱 ULTRA: Platform added:', newPlatform.id);
    
    saveToStorage(undefined, updatedPlatforms);
    toast.success('Yeni platform eklendi!');
  };

  const updatePlatform = (id: string, updates: Partial<Platform>) => {
    const updatedPlatforms = platforms.map(platform => 
      platform.id === id ? { ...platform, ...updates } : platform
    );
    
    console.log('📱 ULTRA: Platform updated:', id, updates);
    saveToStorage(undefined, updatedPlatforms);
    toast.success('Platform güncellendi!');
  };

  const deletePlatform = (id: string) => {
    const updatedPlatforms = platforms.filter(platform => platform.id !== id);
    console.log('📱 ULTRA: Platform deleted:', id);
    
    saveToStorage(undefined, updatedPlatforms);
    toast.success('Platform silindi!');
  };

  return (
    <ServiceContext.Provider value={{
      services,
      platforms,
      addService,
      updateService,
      deleteService,
      getServicesByPlatform,
      addPlatform,
      updatePlatform,
      deletePlatform,
      syncData,
      forceRefresh
    }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within ServiceProvider');
  }
  return context;
};

// Default data functions
function getDefaultServices(): ServicePackage[] {
  return [
    // Instagram Hizmetleri
    {
      id: 'instagram_followers_1',
      name: 'Premium Türk Takipçi',
      description: 'Gerçek Türk kullanıcılardan takipçi',
      category: 'Takipçi',
      platform: 'Instagram',
      prices: [
        { amount: 100, price: 15.00 },
        { amount: 250, price: 35.00 },
        { amount: 500, price: 65.00 },
        { amount: 1000, price: 120.00 }
      ],
      features: ['Gerçek Türk hesaplar', 'Drop koruması', 'Hızlı teslimat'],
      deliveryTime: '0-2 saat',
      quality: 'Premium',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'instagram_likes_1',
      name: 'Instagram Beğeni',
      description: 'Gönderilerinize kaliteli beğeni',
      category: 'Beğeni',
      platform: 'Instagram',
      prices: [
        { amount: 100, price: 5.00 },
        { amount: 500, price: 20.00 },
        { amount: 1000, price: 35.00 },
        { amount: 2500, price: 80.00 }
      ],
      features: ['Hızlı teslimat', 'Güvenli', 'Drop koruması'],
      deliveryTime: '0-1 saat',
      quality: 'Yüksek',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // YouTube Hizmetleri
    {
      id: 'youtube_subscribers_1',
      name: 'YouTube Abone',
      description: 'Kanalınıza gerçek aboneler',
      category: 'Abone',
      platform: 'YouTube',
      prices: [
        { amount: 100, price: 25.00 },
        { amount: 250, price: 55.00 },
        { amount: 500, price: 100.00 },
        { amount: 1000, price: 180.00 }
      ],
      features: ['Gerçek hesaplar', 'Drop koruması', 'Kaliteli'],
      deliveryTime: '1-6 saat',
      quality: 'Premium',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'youtube_views_1',
      name: 'YouTube İzlenme',
      description: 'Videolarınıza kaliteli izlenme',
      category: 'İzlenme',
      platform: 'YouTube',
      prices: [
        { amount: 1000, price: 15.00 },
        { amount: 5000, price: 65.00 },
        { amount: 10000, price: 120.00 },
        { amount: 25000, price: 280.00 }
      ],
      features: ['Hızlı teslimat', 'Güvenli', 'Organik görünüm'],
      deliveryTime: '0-4 saat',
      quality: 'Yüksek',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // TikTok Hizmetleri
    {
      id: 'tiktok_followers_1',
      name: 'TikTok Takipçi',
      description: 'TikTok hesabınıza kaliteli takipçi',
      category: 'Takipçi',
      platform: 'TikTok',
      prices: [
        { amount: 100, price: 12.00 },
        { amount: 500, price: 55.00 },
        { amount: 1000, price: 100.00 },
        { amount: 2500, price: 230.00 }
      ],
      features: ['Gerçek hesaplar', 'Hızlı teslimat', 'Drop koruması'],
      deliveryTime: '0-3 saat',
      quality: 'Premium',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tiktok_likes_1',
      name: 'TikTok Beğeni',
      description: 'Videolarınıza hızlı beğeni',
      category: 'Beğeni',
      platform: 'TikTok',
      prices: [
        { amount: 100, price: 8.00 },
        { amount: 500, price: 35.00 },
        { amount: 1000, price: 65.00 },
        { amount: 2500, price: 150.00 }
      ],
      features: ['Hızlı teslimat', 'Güvenli', 'Kaliteli'],
      deliveryTime: '0-2 saat',
      quality: 'Yüksek',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

function getDefaultPlatforms(): Platform[] {
  return [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      description: 'Instagram hesabınızı büyütmek için gereken tüm hizmetler',
      color: 'from-pink-500 to-purple-600',
      isActive: true,
      order: 1
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '🎥',
      description: 'YouTube kanalınızı büyütmek için etkili çözümler',
      color: 'from-red-500 to-red-600',
      isActive: true,
      order: 2
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      description: 'TikTok hesabınızı viral yapmak için profesyonel hizmetler',
      color: 'from-gray-800 to-gray-900',
      isActive: true,
      order: 3
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👥',
      description: 'Facebook sayfanızı büyütmek için etkili stratejiler',
      color: 'from-blue-600 to-blue-800',
      isActive: true,
      order: 4
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      description: 'WhatsApp gruplarınızı büyütmek için profesyonel hizmetler',
      color: 'from-green-500 to-green-600',
      isActive: true,
      order: 5
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: '👻',
      description: 'Snapchat hesabınızı güçlendirmek için etkili çözümler',
      color: 'from-yellow-400 to-yellow-500',
      isActive: true,
      order: 6
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      description: 'Telegram kanallarınızı büyütmek için profesyonel hizmetler',
      color: 'from-blue-400 to-blue-500',
      isActive: true,
      order: 7
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: '🐦',
      description: 'Twitter hesabınızı güçlendirmek için profesyonel hizmetler',
      color: 'from-blue-500 to-cyan-500',
      isActive: true,
      order: 8
    }
  ];
}