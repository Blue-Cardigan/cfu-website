import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';
import dotenv from 'dotenv';

dotenv.config();

// Server-side Stripe client (only used in server components/API routes)
export const stripe = typeof window === 'undefined' 
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    })
  : null;

// Client-side Stripe promise
let stripePromise: any;
export const getStripeJs = () => {
  if (!stripePromise && typeof window !== 'undefined') {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}; 