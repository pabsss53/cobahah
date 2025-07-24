import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  icon,
  variant = 'primary'
}) => {
  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        boxShadow: variant === 'primary' 
          ? '0 20px 40px rgba(59, 130, 246, 0.3)' 
          : '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white
        transition-all duration-300 flex items-center space-x-2
        ${className}
      `}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center space-x-2">
        {icon && (
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {icon}
          </motion.span>
        )}
        <span>{children}</span>
      </span>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </motion.button>
  );
};

export default AnimatedButton;