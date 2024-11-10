import React from 'react';
import { motion } from 'framer-motion';

export const Home = () => {
  return (
    <motion.section
      id="home"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16"
    >
      <h2 className="text-4xl font-bold text-blue-600 mb-4">Welcome to <span className="bg-yellow-300 px-2">Creatives for Ukraine</span></h2>
      <p className="text-xl text-gray-600 mb-8">A cultural initiative that channels creative talent to raise funds and support Ukraine's victory.</p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <a
          href="#donate"
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Support Our Cause
        </a>
      </motion.div>
    </motion.section>
  );
};