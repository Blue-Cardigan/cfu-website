import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const Donate = () => {
  return (
    <motion.section
      id="donate"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16"
    >
      <h2 className="text-3xl font-bold text-blue-600 mb-12">Support Our <span className="bg-yellow-300 px-2">Cause</span></h2>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Your donation helps us support Ukrainian artists and creatives in the UK. Every contribution makes a difference.
      </p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          className="bg-blue-600 text-white px-12 py-6 rounded-full text-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Donate Now
        </Button>
      </motion.div>
    </motion.section>
  );
};