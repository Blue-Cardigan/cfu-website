import React from 'react';
import { motion } from 'framer-motion';

export const AboutUs = () => {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-16"
    >
      <h2 className="text-3xl font-bold text-blue-600 mb-12 text-center">About <span className="bg-yellow-300 px-2">Us</span></h2>
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 mb-6">
          Creatives for Ukraine UK is a non-profit organization dedicated to supporting Ukrainian artists and creatives who have found refuge in the United Kingdom. Our mission is to provide a platform for these talented individuals to showcase their work, connect with the local community, and rebuild their lives through art and creativity.
        </p>
        <p className="text-gray-600 mb-6">
          We organize various events, exhibitions, and workshops to promote Ukrainian culture and raise awareness about the ongoing situation in Ukraine. Through our initiatives, we aim to foster cultural exchange, create opportunities for Ukrainian creatives, and contribute to the vibrant artistic landscape of the UK.
        </p>
        <p className="text-gray-600">
          Your support helps us continue our mission and make a positive impact on the lives of Ukrainian artists and their families in the UK.
        </p>
      </div>
    </motion.section>
  );
};