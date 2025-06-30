import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../UI/Button';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('E-posta adresi gerekli');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Geçerli bir e-posta adresi girin');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage (in real app, this would be an API call)
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      
      if (subscribers.includes(email.toLowerCase())) {
        toast.info('Bu e-posta adresi zaten kayıtlı');
        setLoading(false);
        return;
      }
      
      subscribers.push(email.toLowerCase());
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      
      setSubscribed(true);
      toast.success('Bültene başarıyla abone oldunuz!');
      setEmail('');
      
      // Send notification to admin
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Yeni Bülten Abonesi', {
          body: `Yeni abone: ${email}`,
          icon: '/logo.svg'
        });
      }
      
    } catch (error) {
      toast.error('Abone olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Teşekkürler!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Bültenimize başarıyla abone oldunuz. En güncel haberlerimizi e-posta ile alacaksınız.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Bülten</h3>
      <p className="text-gray-400 mb-4 text-sm">
        Yeni hizmetler ve kampanyalardan haberdar olun.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
            disabled={loading}
          />
        </div>
        <Button 
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 text-sm font-medium"
          loading={loading}
          disabled={loading}
        >
          Abone Ol
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;