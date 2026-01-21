'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Feature {
  title: string;
  description: string;
}

export const AboutUs = () => {
  const features: Feature[] = [
    {
      title: "Our Mission",
      description: "Supporting Ukraine through art and creativity, providing a platform for talented individuals to showcase their work."
    },
    {
      title: "What We Do",
      description: "Organise events, exhibitions, and workshops to promote Ukrainian culture and raise awareness."
    },
    {
      title: "Our Impact",
      description: "Foster cultural exchange, create opportunities for Ukrainian creatives, and contribute to the UK's artistic landscape."
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
          className="text-4xl font-bold text-brand-blue mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          About <span className="bg-brand-yellow px-3 py-1 rounded-lg">Us</span>
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
              <h3 className="text-xl font-semibold text-brand-blue mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}; 