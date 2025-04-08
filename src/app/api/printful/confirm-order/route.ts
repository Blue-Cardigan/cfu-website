import { env } from '@/env.mjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the request
    if (!data.order_id) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }
    
    const { order_id, payment } = data;
    
    // Create the confirmation payload
    const confirmPayload: any = {};
    
    // Add payment information if provided
    if (payment) {
      confirmPayload.payment = {
        gateway: payment.gateway || 'manual',
        transaction_id: payment.transaction_id || `MANUAL-${new Date().getTime()}`
      };
    }
    
    // Confirm the order in Printful
    const confirmResponse = await fetch(`https://api.printful.com/orders/${order_id}/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(confirmPayload),
    });
    
    if (!confirmResponse.ok) {
      const errorData = await confirmResponse.json();
      console.error('Failed to confirm Printful order:', errorData);
      return NextResponse.json(
        { error: errorData.result || 'Failed to confirm order' },
        { status: confirmResponse.status }
      );
    }
    
    const confirmData = await confirmResponse.json();
    console.log('Printful order confirmed successfully:', confirmData);
    
    return NextResponse.json({
      success: true,
      order_id: order_id,
      confirmation: confirmData.result
    });
  } catch (error) {
    console.error('Error confirming Printful order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to confirm Printful order' },
      { status: 500 }
    );
  }
} 