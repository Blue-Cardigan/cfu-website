import { env } from '@/env.mjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    // Log the items being processed
    console.log('Processing checkout items:', items);

    // First, fetch the product details to get the sync variant IDs
    const productDetails = await Promise.all(
      items.map(async (item: { productId: number; variantId: string; size: string }) => {
        const printfulResponse = await fetch(`https://api.printful.com/store/products/${item.productId}`, {
          headers: {
            'Authorization': `Bearer ${env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!printfulResponse.ok) {
          throw new Error('Failed to fetch product details');
        }

        const productData = await printfulResponse.json();
        console.log('Product data:', productData);

        const syncVariant = productData.result.sync_variants.find(
          (v: any) => v.size === item.size
        );

        if (!syncVariant) {
          throw new Error(`No sync variant found for size ${item.size}`);
        }

        return {
          sync_variant_id: syncVariant.id,
          quantity: 1,
        };
      })
    );

    // Create draft order in Printful
    const orderResponse = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: {
          name: 'Customer',
          address1: '19749 Dearborn St',
          city: 'Chatsworth',
          state_code: 'CA',
          country_code: 'US',
          zip: '91311',
        },
        items: productDetails,
        payment: {
          method: 'paypal',
          return_url: `${env.NEXT_PUBLIC_BASE_URL}/shop?success=true`,
          cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/shop?canceled=true`,
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('Printful API error:', errorData);
      throw new Error(errorData.result || 'Failed to create order');
    }

    const orderData = await orderResponse.json();
    console.log('Order created successfully:', orderData);

    // Get the dashboard URL from the response
    const dashboardUrl = orderData.result.dashboard_url;
    if (!dashboardUrl) {
      console.error('No dashboard URL found in response:', orderData);
      throw new Error('No dashboard URL found in response');
    }

    // Return the dashboard URL for payment
    return NextResponse.json({ 
      approvalUrl: dashboardUrl,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 