import React from 'react';
import { motion } from 'framer-motion';

export const AboutUs = () => {
  const features = [
    {
      title: "Our Mission",
      description: "Supporting Ukraine through art and creativity, providing a platform for talented individuals to showcase their work.",
      icon: "🎨"
    },
    {
      title: "What We Do",
      description: "Organize events, exhibitions, and workshops to promote Ukrainian culture and raise awareness.",
      icon: "🎭"
    },
    {
      title: "Our Impact",
      description: "Foster cultural exchange, create opportunities for Ukrainian creatives, and contribute to the UK's artistic landscape.",
      icon: "🌟"
    }
  ];

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-24 relative"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-blue-600 mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          About <span className="bg-yellow-300 px-3 py-1 rounded-lg">Us</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="bg-blue-50 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-lg text-gray-600 leading-relaxed">
            Your support helps us continue our mission and make a positive impact on the lives of Ukrainians.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};