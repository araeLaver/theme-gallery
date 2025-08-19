import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Palette, Heart, Star } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Camera,
      title: 'High Quality Images',
      description: 'Carefully selected high-resolution images for every theme'
    },
    {
      icon: Palette,
      title: 'Multiple Themes',
      description: 'Diverse collection of themes from nature to abstract art'
    },
    {
      icon: Heart,
      title: 'Curated Collections',
      description: 'Hand-picked images that perfectly represent each theme'
    },
    {
      icon: Star,
      title: 'Regular Updates',
      description: 'New themes and images added regularly'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            About Theme Gallery
          </h1>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Welcome to Theme Gallery, your destination for beautifully curated image collections. 
              We believe that images tell stories, evoke emotions, and inspire creativity. 
              Our platform brings together stunning visuals organized by themes, making it easy 
              to find the perfect imagery for your projects or simply to enjoy visual art.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              Each theme in our gallery is carefully crafted to represent a unique aesthetic, 
              mood, or concept. From the serene beauty of nature to the vibrant energy of urban 
              landscapes, from minimalist elegance to abstract creativity - we have something 
              for every visual preference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold mb-4">Start Exploring</h2>
            <p className="text-lg opacity-90">
              Dive into our themed collections and discover visual inspiration
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;