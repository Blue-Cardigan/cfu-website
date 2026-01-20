import Stripe from 'stripe';
import { NextResponse } from 'next/server';

// This is a server component, so we create Stripe instance here directly
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil', // Updated to match latest type definition
});

export async function POST(request: Request) {
  try {
    const { amount, currency = 'usd', metadata } = await request.json();

    // Validate the request
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be at least 1' },
        { status: 400 }
      );
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the client secret
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 