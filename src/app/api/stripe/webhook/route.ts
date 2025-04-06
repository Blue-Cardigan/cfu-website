import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// This is a server component, so we create Stripe instance here directly
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event;

    // Verify webhook signature and extract the event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err) {
      const error = err as Error;
      console.error('Webhook signature verification failed:', error.message);
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` },
        { status: 400 }
      );
    }

    // Handle the event based on its type
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful:', paymentIntent.id);
        // Handle successful payment here (e.g., fulfill the order)
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        console.log('Payment failed:', failedPaymentIntent.id);
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process webhook' },
      { status: 500 }
    );
  }
} 