export interface PrintfulProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  store_url: string;
}

export async function getPrintfulProducts(): Promise<PrintfulProduct[]> {
  try {
    const response = await fetch('/api/printful');

    if (!response.ok) {
      throw new Error('Failed to fetch Printful products');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching Printful products:', error);
    return [];
  }
} 