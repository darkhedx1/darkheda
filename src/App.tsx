import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { ServiceProvider } from './contexts/ServiceContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import CartSidebar from './components/Cart/CartSidebar';
import WhatsAppChat from './components/LiveChat/WhatsAppChat';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import FAQPage from './pages/FAQPage';
import ToolsPage from './pages/ToolsPage';
import AdminPage from './pages/AdminPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import WalletPage from './pages/WalletPage';
import UserSettingsPage from './pages/UserSettingsPage';

// 404 Fallback Component - SPA için optimize edilmiş
const NotFoundFallback: React.FC = () => {
  React.useEffect(() => {
    // URL'yi kontrol et ve uygun sayfaya yönlendir
    const path = window.location.pathname;
    
    // Eğer geçerli bir rota değilse ana sayfaya yönlendir
    const validRoutes = [
      '/', '/home', '/services', '/login', '/register', '/dashboard', 
      '/wallet', '/checkout', '/about', '/contact', '/blog', '/faq', 
      '/tools', '/admin', '/anasayfa', '/hizmetler', '/giris', '/kayit',
      '/hesap', '/hakkimizda', '/iletisim', '/sss', '/araclar', '/yonetim'
    ];
    
    const isValidRoute = validRoutes.some(route => path.startsWith(route)) || 
                        path.startsWith('/services/') || 
                        path.startsWith('/order-success/') ||
                        path.startsWith('/dashboard/') ||
                        path.startsWith('/blog/');
    
    if (!isValidRoute) {
      // 2 saniye bekle sonra ana sayfaya yönlendir
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Sayfa Yükleniyor...
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Ana sayfaya yönlendiriliyorsunuz...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
      </div>
    </div>
  );
};

function App() {
  const [cartOpen, setCartOpen] = React.useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <PaymentProvider>
          <ServiceProvider>
            <CartProvider>
              <OrderProvider>
                <Router>
                  <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300">
                    <Navbar />
                    <main className="pt-16">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/services/:platform" element={<ServiceDetailPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/dashboard/settings" element={<UserSettingsPage />} />
                        <Route path="/wallet" element={<WalletPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:id" element={<BlogPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/tools" element={<ToolsPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/admin/:section" element={<AdminPage />} />
                        
                        {/* TÜRKÇE ROTALAR */}
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/index" element={<HomePage />} />
                        <Route path="/index.html" element={<HomePage />} />
                        <Route path="/main" element={<HomePage />} />
                        <Route path="/anasayfa" element={<HomePage />} />
                        <Route path="/hizmetler" element={<ServicesPage />} />
                        <Route path="/hizmetler/:platform" element={<ServiceDetailPage />} />
                        <Route path="/giris" element={<LoginPage />} />
                        <Route path="/kayit" element={<RegisterPage />} />
                        <Route path="/hesap" element={<DashboardPage />} />
                        <Route path="/hesap/ayarlar" element={<UserSettingsPage />} />
                        <Route path="/hakkimizda" element={<AboutPage />} />
                        <Route path="/iletisim" element={<ContactPage />} />
                        <Route path="/sss" element={<FAQPage />} />
                        <Route path="/araclar" element={<ToolsPage />} />
                        <Route path="/yonetim" element={<AdminPage />} />
                        
                        {/* CATCH-ALL ROUTE - TÜM DİĞER ROTALAR */}
                        <Route path="*" element={<NotFoundFallback />} />
                      </Routes>
                    </main>
                    <Footer />
                    <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
                    <WhatsAppChat />
                    <Toaster 
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        className: 'dark:bg-dark-800 dark:text-white',
                      }}
                    />
                  </div>
                </Router>
              </OrderProvider>
            </CartProvider>
          </ServiceProvider>
        </PaymentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;