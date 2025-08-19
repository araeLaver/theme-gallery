import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Theme } from '../types/theme';
import { Link } from 'react-router-dom';

interface ThemeCardProps {
  theme: Theme;
  index: number;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer"
    >
      <Link to={`/theme/${theme.id}`}>
        <div className="relative h-80">
          <img
            src={theme.coverImage}
            alt={theme.name}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{theme.name}</h3>
            <p className="text-sm opacity-90 mb-4">{theme.description}</p>
            
            <motion.div
              className="flex items-center gap-2 text-sm font-medium"
              whileHover={{ x: 5 }}
            >
              <span>Explore Collection</span>
              <ArrowRight size={16} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ThemeCard;