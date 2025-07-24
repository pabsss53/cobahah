import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
      }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
           style={{ background: `linear-gradient(135deg, ${color.split(' ')[1]}, ${color.split(' ')[3]})` }}>
      </div>
      
      <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 h-full transition-all duration-300 group-hover:border-transparent">
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color} mb-4`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text"
            style={{ backgroundImage: `linear-gradient(135deg, ${color.split(' ')[1]}, ${color.split(' ')[3]})` }}>
          {title}
        </h3>
        
        <p className="text-gray-300 leading-relaxed">
          {description}
        </p>

        {/* Animated border */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r p-[1px]"
               style={{ background: `linear-gradient(135deg, ${color.split(' ')[1]}, ${color.split(' ')[3]})` }}>
            <div className="w-full h-full bg-gray-900 rounded-xl"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;