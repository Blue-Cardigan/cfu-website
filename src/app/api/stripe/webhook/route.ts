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
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

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
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent was successful:', paymentIntent.id);
        
        // Get the order details, shipping address and discount from metadata
        const orderItems = paymentIntent.metadata.items;
        const shippingAddressData = paymentIntent.metadata.shipping_address;
        const discountApplied = parseInt(paymentIntent.metadata.discount_applied || '0', 10);
        
        if (orderItems && shippingAddressData) {
          try {
            // Parse the order items and shipping address
            const items = JSON.parse(orderItems);
            const address = JSON.parse(shippingAddressData);
            
            console.log('Creating Printful order with:', { items, address, discountApplied });
            
            // Create the Printful order
            const printfulResponse = await fetch(new URL('/api/printful/create-order', request.url).toString(), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                items,
                address,
                discount_percentage: discountApplied,
              }),
            });
            
            const printfulResult = await printfulResponse.json();
            
            if (!printfulResponse.ok) {
              console.error('Failed to create Printful order:', printfulResult);
              // Note: We don't throw here to avoid failing the webhook handling
            } else {
              console.log('Printful order created successfully:', printfulResult);
            }
          } catch (error) {
            console.error('Error processing order items:', error);
          }
        } else {
          console.warn('Missing order items or shipping address in payment intent metadata');
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPaymentIntent.id);
        console.log('Failure reason:', failedPaymentIntent.last_payment_error?.message);
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