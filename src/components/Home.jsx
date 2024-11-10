import React from 'react';
import { motion } from 'framer-motion';

export const Home = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.section
      id="home"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative py-24 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#FFD700_1px,transparent_1px),linear-gradient(to_bottom,#FFD700_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-4xl mx-auto text-center px-4">
        <motion.h2 
          className="text-5xl md:text-6xl font-bold text-blue-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to <span className="bg-yellow-300 px-3 py-1 rounded-lg">Creatives for Ukraine</span>
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          A cultural initiative that channels creative talent to raise funds and support Ukraine's victory.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => scrollToSection('upcoming')}
            className="group relative px-8 py-4 rounded-full text-lg font-semibold bg-blue-600 text-white overflow-hidden transition-all hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">View Upcoming Events</span>
            <div className="absolute inset-0 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </motion.button>

          <motion.button
            onClick={() => scrollToSection('newsletter')}
            className="group relative px-8 py-4 rounded-full text-lg font-semibold border-2 border-blue-600 text-blue-600 overflow-hidden transition-all hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 group-hover:text-white">Stay Updated</span>
            <div className="absolute inset-0 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};