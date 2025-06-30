import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, User, Users } from 'lucide-react';

const WhatsAppChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactPersons = [
    {
      name: "Berk Taha Keskin",
      phone: "+90 533 582 20 64",
      role: "Müşteri Hizmetleri Müdürü",
      avatar: '👨‍💼',
      description: "Genel müşteri sorunları ve sipariş takibi"
    },
    {
      name: "Ömer Emir Erdoğan", 
      phone: "+90 555 191 2663",
      role: "Teknik Destek Uzmanı",
      avatar: '👨‍💻',
      description: "Teknik sorunlar ve özel talepler"
    }
  ];

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Merhaba ${name}! Garanti Takipçim hakkında bilgi almak istiyorum.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* WhatsApp Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
          >
            <MessageCircle className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Contact Selection */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-80 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Canlı Destek Hattı</h3>
                  <p className="text-xs text-white/80">WhatsApp ile iletişim</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Hangi uzmanımızla konuşmak istersiniz?
              </h4>

              <div className="space-y-4">
                {contactPersons.map((person, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
                    onClick={() => openWhatsApp(person.phone, person.name)}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-lg">
                        {person.avatar}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {person.name}
                        </h5>
                        <p className="text-green-600 dark:text-green-400 text-xs font-medium">
                          {person.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-xs mb-3">
                      {person.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="w-3 h-3" />
                        <span>{person.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Çevrimiçi</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                7/24 müşteri desteği
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppChat;