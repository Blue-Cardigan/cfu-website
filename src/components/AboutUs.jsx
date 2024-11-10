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
          Creatives for Ukraine UK is a non-profit organisation dedicated to supporting Ukraine during the war, through art and creativity. Our mission is to provide a platform for talented individuals to showcase their work, connect with the local community, and support Ukraine through art and creativity.
        </p>
        <p className="text-gray-600 mb-6">
          We organise events, exhibitions, and workshops to promote Ukrainian culture and raise awareness about the ongoing situation in Ukraine. Through our initiatives, we aim to foster cultural exchange, create opportunities for Ukrainian creatives, and contribute to the vibrant artistic landscape of the UK.
        </p>
        <p className="text-gray-600">
          Your support helps us continue our mission and make a positive impact on the lives of Ukrainians.
        </p>
      </div>
    </motion.section>
  );
};