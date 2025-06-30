import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: string;
  isRead: boolean;
}

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Garanti Takipçim canlı destek hattına hoş geldiniz. Size nasıl yardımcı olabilirim?',
      sender: 'admin',
      timestamp: new Date().toISOString(),
      isRead: true
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Custom event listener for opening chat from contact page
  useEffect(() => {
    const handleOpenLiveChat = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };

    window.addEventListener('openLiveChat', handleOpenLiveChat);
    
    return () => {
      window.removeEventListener('openLiveChat', handleOpenLiveChat);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate admin typing
    setIsTyping(true);
    
    // Send notification to admin (in real app, this would be a WebSocket or API call)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Yeni Canlı Destek Mesajı', {
        body: `Kullanıcı: ${message}`,
        icon: '/logo.svg'
      });
    }

    // Simulate admin response
    setTimeout(() => {
      setIsTyping(false);
      const adminResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoResponse(message),
        sender: 'admin',
        timestamp: new Date().toISOString(),
        isRead: true
      };
      setMessages(prev => [...prev, adminResponse]);
    }, 2000);
  };

  const getAutoResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('fiyat') || lowerMessage.includes('ücret')) {
      return 'Fiyatlarımız platformlara göre değişiklik göstermektedir. Instagram takipçi paketlerimiz ₺3.50\'den başlamaktadır. Detaylı fiyat listesi için hizmetler sayfamızı inceleyebilirsiniz.';
    }
    
    if (lowerMessage.includes('teslimat') || lowerMessage.includes('süre')) {
      return 'Siparişlerimiz genellikle 0-6 saat içinde teslim edilmektedir. Bazı özel paketlerde teslimat süresi 24 saate kadar çıkabilir.';
    }
    
    if (lowerMessage.includes('güvenli') || lowerMessage.includes('güven')) {
      return 'Evet, tüm hizmetlerimiz %100 güvenlidir. 8 yıllık tecrübemizle gerçek ve aktif hesaplardan hizmet sunuyoruz. Drop koruması garantimiz de bulunmaktadır.';
    }
    
    if (lowerMessage.includes('ödeme') || lowerMessage.includes('para')) {
      return 'Kredi kartı, banka kartı, Papara ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödeme yöntemlerimiz güvenlidir.';
    }
    
    if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
      return 'Merhaba! Size nasıl yardımcı olabilirim? Sorularınızı bekliyorum.';
    }
    
    if (lowerMessage.includes('iletişim') || lowerMessage.includes('contact')) {
      return 'İletişim sayfamızdan bize ulaşabilirsiniz. Telefon: 0555 191 2663, E-posta: garantitakipcim@gmail.com. Ayrıca bu canlı destek hattından da 7/24 yardım alabilirsiniz.';
    }
    
    return 'Mesajınızı aldım. Kısa süre içinde size dönüş yapacağım. Acil durumlar için 0555 191 2663 numaralı telefonu arayabilirsiniz.';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
          >
            <MessageCircle className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 60 : 500
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-80 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Canlı Destek</h3>
                  <p className="text-xs text-white/80">Genellikle hemen yanıtlar</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.sender === 'user' 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-gray-300'
                        }`}>
                          {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`p-3 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-emerald-500 text-white rounded-br-sm'
                            : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white rounded-bl-sm'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2 max-w-xs">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-dark-700 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="bg-gray-100 dark:bg-dark-700 p-3 rounded-2xl rounded-bl-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-dark-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Mesajlarınız admin ekibimize iletilmektedir
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;