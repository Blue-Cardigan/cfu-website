'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Cart } from '@/components/Cart';
import { useCart } from '@/contexts/CartContext';
import { getPrintfulProducts, type PrintfulProduct } from '@/lib/printful';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

interface Variant {
  size: string;
  price: string;
  available: boolean;
}

interface ProductWithVariants extends PrintfulProduct {
  variants: Variant[];
  costs?: {
    currency: string;
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
  };
}

// Helper function to format price in GBP
const formatPrice = (price: string) => {
  const numericPrice = parseFloat(price.replace('£', ''));
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(numericPrice);
};

// Loading component for Suspense fallback
const ShopLoading = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  </div>
);

// Main shop content component
const ShopContent = () => {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<number, string>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { dispatch } = useCart();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show success/error messages from URL params
    if (searchParams.get('success')) {
      toast.success('Thank you for your purchase!');
    }
    if (searchParams.get('canceled')) {
      toast.error('Checkout was canceled.');
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = await getPrintfulProducts();
        // Transform Printful products into ProductWithVariants format
        const transformedProducts = fetchedProducts.map(product => ({
          ...product,
          variants: [
            {
              size: 'S',
              price: product.price,
              available: true
            },
            {
              size: 'M',
              price: product.price,
              available: true
            },
            {
              size: 'L',
              price: product.price,
              available: true
            }
          ]
        }));
        setProducts(transformedProducts);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleSizeSelect = (productId: number, size: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleAddToCart = (product: ProductWithVariants) => {
    const selectedSize = selectedVariants[product.id];
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const selectedVariant = product.variants.find(v => v.size === selectedSize);
    if (!selectedVariant) {
      toast.error('Selected size is not available');
      return;
    }

    // Log the product data for debugging
    console.log('Product data:', product);

    // Use the size as the variant identifier since we don't have sync_variants
    const variantId = selectedSize.charCodeAt(0); // Convert size to a number for variantId

    // Log the variant information for debugging
    console.log('Adding to cart:', {
      productId: product.id,
      variantId,
      size: selectedSize,
      price: selectedVariant.price
    });

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        name: product.name,
        price: selectedVariant.price,
        image: product.image,
        size: selectedVariant.size,
        variantId: variantId,
      },
    });

    toast.success('Added to cart');
    setIsCartOpen(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-16 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <motion.h1 
                className="text-4xl font-bold text-blue-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Support Through <span className="bg-yellow-300 px-3 py-1 rounded-lg">Art</span>
              </motion.h1>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Cart
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {useCart().state.items.length}
                </span>
              </button>
            </div>
            
            <motion.p 
              className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Every purchase supports our mission to help Ukraine through art and creativity.
              All proceeds go directly to humanitarian aid and cultural initiatives.
            </motion.p>

            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
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
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      
                      {/* Size Selection Dropdown */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Size
                        </label>
                        <select
                          value={selectedVariants[product.id] || ''}
                          onChange={(e) => handleSizeSelect(product.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option key={`${product.id}-default`} value="">Choose a size</option>
                          {product.variants
                            .filter(variant => {
                              if (!variant || !variant.size) {
                                console.warn('Invalid variant data:', {
                                  variant,
                                  productId: product.id,
                                  productName: product.name
                                });
                                return false;
                              }
                              return true;
                            })
                            .map((variant) => (
                              <option
                                key={variant.size}
                                value={variant.size}
                                disabled={!variant.available}
                              >
                                {variant.size} - {formatPrice(variant.price)}
                                {!variant.available && ' (Out of Stock)'}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {selectedVariants[product.id]
                            ? formatPrice(product.variants.find(v => v.size === selectedVariants[product.id])?.price || '£0')
                            : formatPrice(product.price)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>

                      {/* Shipping Information */}
                      {product.costs && (
                        <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                          <p>Shipping: {formatPrice(product.costs.shipping)}</p>
                          <p>Tax: {formatPrice(product.costs.tax)}</p>
                          <p className="font-semibold">Total: {formatPrice(product.costs.total)}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </main>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

// Main page component with Suspense
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent />
    </Suspense>
  );
} 