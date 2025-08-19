import React from 'react';
import { motion } from 'framer-motion';
import { themes } from '../data/themes';
import ThemeCard from '../components/ThemeCard';
import { Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="text-purple-600 mr-2" size={32} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Explore Themed Collections
            </h1>
            <Sparkles className="text-pink-600 ml-2" size={32} />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover carefully curated image collections across different themes and aesthetics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <ThemeCard key={theme.id} theme={theme} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;