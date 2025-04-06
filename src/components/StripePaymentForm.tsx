'use client';

import React, { useState, useEffect } from 'react';
import { 
  PaymentElement,
  useStripe, 
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { getStripeJs } from '@/lib/stripe';
import { useCart } from '@/contexts/CartContext';

interface PaymentFormProps {
  clientSecret: string;
  returnUrl: string;
}

function PaymentForm({ clientSecret, returnUrl }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useCart();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
      });

      if (error) {
        toast.error(error.message || 'An error occurred during payment');
      } else {
        // Clear the cart on successful payment
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Pay now'}
      </button>
    </form>
  );
}

interface StripePaymentFormProps {
  amount: number;
  onSuccess?: () => void;
  metadata?: Record<string, string>;
}

export function StripePaymentForm({ amount, onSuccess, metadata }: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripeInitialized, setStripeInitialized] = useState(false);

  // Initialize Stripe
  useEffect(() => {
    // Make sure we're in the browser environment
    if (typeof window !== 'undefined') {
      setStripeInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!stripeInitialized) return;

    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/stripe/payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'gbp',
            metadata,
          }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        setError((err as Error).message || 'Failed to initialize payment');
        toast.error((err as Error).message || 'Failed to initialize payment');
      } finally {
        setIsLoading(false);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, metadata, stripeInitialized]);

  if (!stripeInitialized) {
    return <div className="text-center py-4">Initializing payment system...</div>;
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading payment form...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (!clientSecret) {
    return <div className="text-center py-4">Unable to initialize payment</div>;
  }

  const returnUrl = `${window.location.origin}/shop?payment_status=success`;
  const stripePromise = getStripeJs();

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm clientSecret={clientSecret} returnUrl={returnUrl} />
    </Elements>
  );
} 