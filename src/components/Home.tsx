'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Add these images to your public folder
const backgroundImages = [
  '/carousel/compressed_1.webp',
  '/carousel/compressed_2.webp',
  '/carousel/compressed_3.webp',
  '/carousel/compressed_4.webp',
  '/carousel/compressed_5.webp',
  '/carousel/compressed_6.webp',
  '/carousel/compressed_7.webp',
  '/carousel/compressed_8.webp',
  // Add more image paths as needed
];

export const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Start the carousel after initial mount
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === backgroundImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.section
      id="home"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative py-24 overflow-hidden min-h-screen"
    >
      {/* Background Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={backgroundImages[currentImageIndex]}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60" /> {/* Darkening overlay */}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#FFD700_1px,transparent_1px),linear-gradient(to_bottom,#FFD700_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center px-4 relative">
        <motion.h2 
          className="text-5xl md:text-6xl font-bold text-blue-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to{" "}
          <span className="relative inline-block">
            <motion.span 
              className="relative z-10 px-3 py-1"
            >
              Creatives for Ukraine
            </motion.span>
            <motion.svg
              viewBox="0 0 300 50"
              className="absolute inset-0 w-full h-full"
              initial="hidden"
              animate="visible"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,25 C75,25 75,25 150,25 C225,25 225,25 300,25"
                fill="none"
                stroke="#FCD34D"
                strokeWidth="40"
                className="stroke-yellow-300"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ 
                  duration: 3,
                  delay: 1.5,
                  ease: "easeInOut"
                }}
              />
            </motion.svg>
          </span>
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-100 mb-12 leading-relaxed"
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
            <span className="relative z-10">View Events</span>
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

          <motion.a
            href="/shop"
            className="group relative px-8 py-4 rounded-full text-lg font-semibold bg-yellow-300 text-blue-600 overflow-hidden transition-all hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Shop Now</span>
            <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
}; 