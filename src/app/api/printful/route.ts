import { env } from '@/env.mjs';
import { NextResponse } from 'next/server';

const PRINTFUL_API_KEY = env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = 'https://api.printful.com';

async function getProductDetails(productId: number) {
  const response = await fetch(`${PRINTFUL_API_URL}/store/products/${productId}`, {
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product details for ID ${productId}`);
  }

  return response.json();
}

export async function GET() {
  try {
    const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Printful products');
    }

    const data = await response.json();
    
    // Fetch details for each product
    const productsWithDetails = await Promise.all(
      data.result.map(async (product: any) => {
        try {
          const details = await getProductDetails(product.id);
          // Get the first variant's price from sync_variants
          const firstVariant = details.result.sync_variants[0];
          const price = firstVariant?.retail_price || '0.00';
          
          return {
            id: product.id,
            name: product.name,
            price: `£${price}`,
            image: details.result.sync_product.thumbnail_url || '/placeholder-product.jpg',
            description: details.result.sync_product.name || 'Support Ukraine through art',
            store_url: `https://www.printful.com/uk/${product.id}`,
            variants: details.result.sync_variants.map((variant: any) => ({
              size: variant.size,
              price: `£${variant.retail_price}`,
              available: variant.availability_status === 'active'
            }))
          };
        } catch (error) {
          console.error(`Error fetching details for product ${product.id}:`, error);
          return {
            id: product.id,
            name: product.name,
            price: '£0.00',
            image: '/placeholder-product.jpg',
            description: 'Support Ukraine through art',
            store_url: `https://www.printful.com/uk/${product.id}`,
            variants: []
          };
        }
      })
    );

    return NextResponse.json(productsWithDetails);
  } catch (error) {
    console.error('Error fetching Printful products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
} 