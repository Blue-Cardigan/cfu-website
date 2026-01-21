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
  onSuccess?: () => void;
}

function PaymentForm({ clientSecret, returnUrl, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'error'>('idle');
  const { dispatch } = useCart();

  useEffect(() => {
    if (stripe) {
      // Check the payment intent status on component mount
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent?.status === 'succeeded') {
          setPaymentStatus('succeeded');
          toast.success('Payment succeeded!');
          if (onSuccess) onSuccess();
          dispatch({ type: 'CLEAR_CART' });
          
          // Redirect to success page after a short delay
          setTimeout(() => {
            window.location.href = `${window.location.origin}/shop?payment_status=success`;
          }, 1500);
        }
      });
    }
  }, [stripe, clientSecret, dispatch, onSuccess]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        redirect: 'if_required',
      });

      if (error) {
        setPaymentStatus('error');
        toast.error(error.message || 'An error occurred during payment');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentStatus('succeeded');
        toast.success('Payment succeeded!');
        dispatch({ type: 'CLEAR_CART' });
        if (onSuccess) onSuccess();
        
        // Redirect to success page after a short delay
        setTimeout(() => {
          window.location.href = `${window.location.origin}/shop?payment_status=success`;
        }, 1500);
      }
    } catch (err) {
      setPaymentStatus('error');
      const error = err as Error;
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentStatus === 'succeeded') {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
        <p className="text-sm text-gray-500">Redirecting to order confirmation...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        disabled={isLoading || !stripe || !elements || paymentStatus === 'processing'}
        className="w-full bg-brand-blue text-white py-3 rounded-full hover:bg-brand-darkBlue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading || paymentStatus === 'processing' ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Pay now'
        )}
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
    return <div className="text-center py-4">Initialising payment system...</div>;
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
      <PaymentForm clientSecret={clientSecret} returnUrl={returnUrl} onSuccess={onSuccess} />
    </Elements>
  );
} 