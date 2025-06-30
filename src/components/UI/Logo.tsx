import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Shield, Star, Zap, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
  className?: string;
  variant?: 'default' | 'white' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showSubtext = true, 
  className = '',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: {
      container: 'space-x-2',
      logo: 'w-8 h-8',
      title: 'text-base sm:text-lg',
      subtitle: 'text-xs'
    },
    md: {
      container: 'space-x-2 sm:space-x-3',
      logo: 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12',
      title: 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl',
      subtitle: 'text-xs sm:text-sm'
    },
    lg: {
      container: 'space-x-4',
      logo: 'w-16 h-16',
      title: 'text-2xl sm:text-3xl',
      subtitle: 'text-sm'
    }
  };

  const currentSize = sizeClasses[size];

  const getTextColor = () => {
    switch (variant) {
      case 'white':
        return 'text-white';
      case 'dark':
        return 'text-gray-900';
      default:
        return 'bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent';
    }
  };

  const getSubtextColor = () => {
    switch (variant) {
      case 'white':
        return 'text-white/80';
      case 'dark':
        return 'text-gray-600';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <Link to="/" className={`inline-flex items-center ${currentSize.container} ${className}`}>
      {/* Premium Logo Container */}
      <div className="relative group flex-shrink-0">
        <motion.div 
          className={`relative ${currentSize.logo} rounded-xl sm:rounded-2xl overflow-hidden shadow-xl transform group-hover:scale-105 transition-all duration-300`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Ana Logo Arka Plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600"></div>
          
          {/* Premium Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
          
          {/* Ana İkon - Crown (Kraliyet/Premium) */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <Crown className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-7 lg:h-7 text-white drop-shadow-lg" />
          </div>
          
          {/* Garanti Badge - Sağ Üst */}
          <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 text-white" />
          </div>
          
          {/* Premium Star - Sol Üst */}
          <div className="absolute -top-0.5 -left-0.5 sm:-top-1 sm:-left-1 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 text-white fill-current" />
          </div>
          
          {/* Güç İkonu - Sol Alt */}
          <div className="absolute -bottom-0.5 -left-0.5 sm:-bottom-1 sm:-left-1 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Zap className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 text-white" />
          </div>
          
          {/* Sparkles - Sağ Alt */}
          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 text-white" />
          </div>
          
          {/* Glow Efekti */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-blue-500/20 to-purple-600/20 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        </motion.div>
      </div>
      
      {/* Premium Yazı - Mobil Uyumlu */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className={`${currentSize.title} font-premium font-bold tracking-tight ${getTextColor()} leading-tight whitespace-nowrap overflow-hidden text-ellipsis`}>
          Garanti Takipçim
        </span>
        {showSubtext && (
          <span className={`${currentSize.subtitle} ${getSubtextColor()} font-premium font-medium -mt-0.5 sm:-mt-1 tracking-wide leading-tight whitespace-nowrap overflow-hidden text-ellipsis`}>
            Premium Sosyal Medya
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;