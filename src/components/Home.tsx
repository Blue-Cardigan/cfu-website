'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { RoughNotation } from 'react-rough-notation';

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
      className="relative py-32 overflow-hidden min-h-screen flex items-center justify-center"
    >
      {/* Background Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 1, ease: "easeInOut" },
              scale: { duration: 7, ease: "linear" }
            }}
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
          <span className="relative inline-block z-10">
            <RoughNotation 
              type="highlight" 
              show={true} 
              color="#FCD34D" 
              animationDelay={1000}
              animationDuration={2000}
              multiline={true}
              padding={[10, 20, 10, 20]}
            >
              <span className="relative z-10 px-2">Creatives for Ukraine</span>
            </RoughNotation>
          </span>
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-100 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          A cultural initiative that channels creative talent to raise funds and support Ukraine&apos;s victory.
        </motion.p>
      </div>
    </motion.section>
  );
}; 