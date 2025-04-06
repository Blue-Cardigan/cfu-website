import { env } from '@/env.mjs';
import { NextResponse } from 'next/server';

// Validates that the request contains all necessary data
function validateRequest(data: any) {
  const { items, address } = data;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return 'Missing or invalid items data';
  }
  
  if (!address) {
    return 'Missing address data';
  }
  
  const requiredAddressFields = ['name', 'address1', 'city', 'state_code', 'country_code', 'zip', 'email'];
  for (const field of requiredAddressFields) {
    if (!address[field]) {
      return `Missing required address field: ${field}`;
    }
  }
  
  return null; // No errors
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the request
    const validationError = validateRequest(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    
    const { items, address, is_free_order = false, discount_percentage = 0 } = data;
    
    // Convert discount percentage to a number if it's not already
    const discountPercent = typeof discount_percentage === 'string' 
      ? parseInt(discount_percentage, 10) 
      : discount_percentage;
    
    // Check if this is effectively a free order (100% discount)
    const isFreeOrder = is_free_order || discountPercent >= 100;
    
    // Fetch product details to get the sync variant IDs
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

    // Create the request body for Printful API
    const requestBody: any = {
      recipient: {
        name: address.name,
        address1: address.address1,
        address2: address.address2 || '',
        city: address.city,
        state_code: address.state_code,
        country_code: address.country_code,
        zip: address.zip,
        email: address.email,
        phone: address.phone || '',
      },
      items: productDetails,
    };

    // For free or discounted orders, add special instructions
    if (discountPercent > 0) {
      const discountNote = isFreeOrder 
        ? 'Free Order - 100% Discount Applied' 
        : `Order with ${discountPercent}% discount applied`;
      
      requestBody.retail_costs = {
        discount: `${discountPercent}%`,
        total: isFreeOrder ? '0.00' : undefined
      };
      
      requestBody.gift = {
        subject: discountNote
      };
      
      // Add notes about discount for fulfillment team
      requestBody.packing_slip = {
        message: discountNote
      };
    }

    // Create order in Printful with the provided address
    const orderResponse = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('Printful API error:', errorData);
      throw new Error(errorData.result || 'Failed to create order');
    }

    const orderData = await orderResponse.json();
    console.log('Printful order created successfully:', orderData);

    // For free orders, we need to confirm the order to proceed with fulfillment
    if (isFreeOrder) {
      try {
        const confirmResponse = await fetch(`https://api.printful.com/orders/${orderData.result.id}/confirm`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!confirmResponse.ok) {
          const errorData = await confirmResponse.json();
          console.error('Failed to confirm free order:', errorData);
          // We'll still return success for the order creation
        } else {
          const confirmData = await confirmResponse.json();
          console.log('Free order confirmed successfully:', confirmData);
        }
      } catch (confirmError) {
        console.error('Error confirming free order:', confirmError);
        // We'll still return success for the order creation
      }
    }

    return NextResponse.json({ 
      success: true,
      order_id: orderData.result.id,
      is_free_order: isFreeOrder,
      discount_applied: discountPercent
    });
  } catch (error) {
    console.error('Error creating Printful order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create Printful order' },
      { status: 500 }
    );
  }
} 