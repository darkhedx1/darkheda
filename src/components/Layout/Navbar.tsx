import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Settings,
  Wallet,
  ShoppingCart,
  Bell,
  Home,
  Package,
  Wrench,
  BookOpen,
  Phone
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import CartSidebar from '../Cart/CartSidebar';
import Logo from '../UI/Logo';
import Button from '../UI/Button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const navigation = [
    { name: 'Ana Sayfa', href: '/', icon: Home },
    { name: 'Hizmetler', href: '/services', icon: Package },
    { name: 'Araçlar', href: '/tools', icon: Wrench },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'İletişim', href: '/contact', icon: Phone },
  ];

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-b border-gray-200 dark:border-dark-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Yeni Premium Tasarım */}
            <Logo size="md" />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 font-premium font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors duration-200"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="relative flex items-center space-x-1 sm:space-x-2">
                  {/* Notifications - Hidden on mobile */}
                  <button className="hidden sm:block p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors duration-200 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"></span>
                  </button>

                  {/* Cart */}
                  <button 
                    onClick={() => setCartOpen(true)}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors duration-200 relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-premium font-medium text-gray-900 dark:text-white truncate max-w-24">{user.name}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-premium font-semibold">₺{user.balance.toFixed(2)}</p>
                      </div>
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 z-50"
                        >
                          <div className="py-1">
                            <Link
                              to="/dashboard"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 font-premium"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <User className="w-4 h-4 mr-3" />
                              Hesabım
                            </Link>
                            <Link
                              to="/wallet"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 font-premium"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Wallet className="w-4 h-4 mr-3" />
                              Bakiye Yükle
                            </Link>
                            <Link
                              to="/dashboard/settings"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 font-premium"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings className="w-4 h-4 mr-3" />
                              Ayarlar
                            </Link>
                            <hr className="my-1 border-gray-200 dark:border-dark-700" />
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700 font-premium"
                            >
                              <LogOut className="w-4 h-4 mr-3" />
                              Çıkış Yap
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3 font-premium">
                      Giriş
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-xs sm:text-sm px-2 sm:px-3 font-premium">
                      Kayıt
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors duration-200"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700 shadow-lg"
            >
              <div className="px-4 py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors duration-200 font-premium"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
                {user && (
                  <>
                    <hr className="my-2 border-gray-200 dark:border-dark-700" />
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors duration-200 font-premium"
                      onClick={() => setIsOpen(false)}
                    >
                      <Bell className="w-5 h-5" />
                      <span className="font-medium">Bildirimler</span>
                      <span className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></span>
                    </Link>
                    <button
                      onClick={() => { setCartOpen(true); setIsOpen(false); }}
                      className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors duration-200 w-full font-premium"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="font-medium">Sepetim</span>
                      {getTotalItems() > 0 && (
                        <span className="ml-auto w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {getTotalItems()}
                        </span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;