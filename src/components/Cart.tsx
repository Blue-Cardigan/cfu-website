'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { StripePaymentForm } from './StripePaymentForm';
import { AddressForm, AddressData } from './AddressForm';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to format price
const formatPrice = (price: number) => {
  return `£${price.toFixed(2)}`;
};

// Valid discount codes
const DISCOUNT_CODES = {
  'FREE100': 100, // 100% discount
  'HALF50': 50,   // 50% discount
};

export function Cart({ isOpen, onClose }: CartProps) {
  const { state, dispatch } = useCart();
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useLocalStorage<AddressData | null>('shipping_address', null);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountError, setDiscountError] = useState('');

  const subtotal = state.items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('£', ''));
    return sum + price;
  }, 0);

  const discountAmount = (subtotal * appliedDiscount) / 100;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    
    if (!code) {
      setDiscountError('Please enter a discount code');
      return;
    }
    
    if (code in DISCOUNT_CODES) {
      const discountPercent = DISCOUNT_CODES[code as keyof typeof DISCOUNT_CODES];
      setAppliedDiscount(discountPercent);
      setDiscountError('');
      toast.success(`Discount of ${discountPercent}% applied!`);
    } else {
      setDiscountError('Invalid discount code');
      setAppliedDiscount(0);
    }
  };

  const handleCheckout = () => {
    // If 100% discount is applied, we don't need payment, just address
    if (appliedDiscount === 100) {
      if (!shippingAddress) {
        setShowAddressForm(true);
      } else {
        // Process the free order directly
        processFreeOrder();
      }
    } else {
      // Regular flow for orders with payment
      if (!shippingAddress) {
        setShowAddressForm(true);
      } else {
        setShowStripePayment(true);
      }
    }
  };

  const processFreeOrder = async () => {
    try {
      // Create Printful order directly with 100% discount
      const response = await fetch('/api/printful/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            name: item.name,
            size: item.size,
            price: item.price,
            productId: item.productId,
            variantId: item.variantId,
          })),
          address: shippingAddress,
          is_free_order: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error processing free order');
      }

      // Handle successful order
      toast.success('Your free order has been placed!');
      handlePaymentSuccess();
    } catch (error) {
      console.error('Error processing free order:', error);
      toast.error('Failed to process your order. Please try again.');
    }
  };

  const handleAddressSubmit = (addressData: AddressData) => {
    setShippingAddress(addressData);
    setShowAddressForm(false);
    
    // If 100% discount, process free order immediately after address collection
    if (appliedDiscount === 100) {
      processFreeOrder();
    } else {
      setShowStripePayment(true);
    }
  };

  const handlePaymentSuccess = () => {
    // Close the cart after successful payment
    onClose();
    // Clear the cart
    dispatch({ type: 'CLEAR_CART' });
    // Reset discount
    setAppliedDiscount(0);
    setDiscountCode('');
  };

  const getPaymentMetadata = () => {
    return {
      items: JSON.stringify(
        state.items.map(item => ({
          name: item.name,
          size: item.size,
          price: item.price,
          productId: item.productId,
          variantId: item.variantId,
        }))
      ),
      shipping_address: JSON.stringify(shippingAddress),
      discount_applied: appliedDiscount.toString(),
    };
  };

  const renderCheckoutContent = () => {
    if (showAddressForm) {
      return (
        <AddressForm 
          onSubmit={handleAddressSubmit} 
          onCancel={() => setShowAddressForm(false)} 
        />
      );
    }
    
    if (showStripePayment) {
      return (
        <div className="space-y-4">
          <button
            onClick={() => setShowStripePayment(false)}
            className="text-blue-600 hover:underline mb-2 block"
          >
            ← Back
          </button>
          <StripePaymentForm
            amount={total}
            metadata={getPaymentMetadata()}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleApplyDiscount}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-r-full hover:bg-gray-300"
          >
            Apply
          </button>
        </div>
        
        {discountError && (
          <p className="text-red-500 text-sm">{discountError}</p>
        )}
        
        {appliedDiscount > 0 && (
          <div className="text-green-600 font-medium">
            {appliedDiscount}% discount applied!
          </div>
        )}
        
        <button
          onClick={handleCheckout}
          className="w-full bg-[#635bff] text-white py-3 rounded-full hover:bg-[#4c45e4] transition-colors"
        >
          {appliedDiscount === 100 ? 'Place Free Order' : 'Checkout'}
        </button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {state.items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {state.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="relative w-20 h-20">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">Size: {item.size}</p>
                          <p className="text-blue-600 font-medium">{formatPrice(parseFloat(item.price.replace('£', '')))}</p>
                        </div>
                        <button
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: index })}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <div className="flex flex-col space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Subtotal:</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                          <span>Discount ({appliedDiscount}%):</span>
                          <span>-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="font-bold">Total:</span>
                        <span className="text-xl font-bold">{formatPrice(total)}</span>
                      </div>
                    </div>
                    
                    {renderCheckoutContent()}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 