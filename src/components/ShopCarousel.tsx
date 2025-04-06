'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getPrintfulProducts, type PrintfulProduct } from '@/lib/printful';

interface ShopCarouselProps {
  title?: string;
  subtitle?: string;
}

export const ShopCarousel = ({ title = "Shop our Collection", subtitle = "Support Ukraine through art" }: ShopCarouselProps) => {
  const [products, setProducts] = useState<PrintfulProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 3;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getPrintfulProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Handle next and previous page
  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  // Get current products
  const getCurrentProducts = () => {
    const startIndex = currentPage * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
  };

  // Format price for display
  const formatPrice = (price: string) => {
    return price;
  };

  return (
    <section className="py-16 bg-gray-50 overflow-hidden relative">
      {/* Visual Separator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-blue-500 opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No products found. Please check back later.
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            {totalPages > 1 && (
              <>
                <button 
                  onClick={prevPage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                  aria-label="Previous products"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextPage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                  aria-label="Next products"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4"
              >
                {getCurrentProducts().map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="relative h-64">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-bold">{formatPrice(product.price)}</span>
                        <Link 
                          href="/shop" 
                          className="px-4 py-2 bg-yellow-300 text-blue-600 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full ${currentPage === index ? 'bg-blue-600' : 'bg-gray-300'} transition-colors`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}; 