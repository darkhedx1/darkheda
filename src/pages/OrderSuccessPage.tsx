import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ArrowRight, Copy, ExternalLink } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(useOrders().getOrderById(orderId || ''));

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
    }
  }, [orderId, getOrderById]);

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast.success('Sipariş ID kopyalandı!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'processing':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'processing':
        return 'İşleniyor';
      case 'pending':
        return 'Bekliyor';
      default:
        return 'Bilinmiyor';
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sipariş Bulunamadı
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Belirtilen sipariş ID'si bulunamadı.
            </p>
            <Link to="/dashboard">
              <Button>Hesabıma Dön</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Siparişiniz Alındı!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Siparişiniz başarıyla oluşturuldu ve işleme alındı.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Sipariş Detayları
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-dark-700">
              <span className="text-gray-600 dark:text-gray-300">Sipariş ID:</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm text-gray-900 dark:text-white">{order.id}</span>
                <button
                  onClick={copyOrderId}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-dark-700">
              <span className="text-gray-600 dark:text-gray-300">Sipariş Tarihi:</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(order.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-dark-700">
              <span className="text-gray-600 dark:text-gray-300">Toplam Tutar:</span>
              <span className="font-bold text-emerald-600">₺{order.totalAmount.toFixed(2)}</span>
            </div>

            {order.targetUrl && (
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-dark-700">
                <span className="text-gray-600 dark:text-gray-300">Hedef URL:</span>
                <a
                  href={order.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700"
                >
                  <span className="text-sm truncate max-w-32">{order.targetUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Sipariş Edilen Hizmetler
          </h3>
          
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {item.platform} - {item.serviceName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {item.quantity} {item.category}
                  </div>
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  ₺{item.totalPrice.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Teslimat Süreci
              </h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Siparişiniz işleme alındı ve yakında teslim edilecek. Teslimat süreci genellikle 0-6 saat arasında tamamlanır. 
                Sipariş durumunuzu hesabınızdan takip edebilirsiniz.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full">
              Hesabıma Dön
            </Button>
          </Link>
          <Link to="/services" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
              Yeni Sipariş Ver
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;