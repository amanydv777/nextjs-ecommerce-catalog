import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/data';
import { validateApiKey } from '@/lib/auth';
import type { Product } from '@/types/product';

// GET /api/products - Fetch all products
export async function GET() {
  try {
    const products = getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Add a new product (protected)
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!validateApiKey(apiKey)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const { name, slug, description, price, category, inventory, image } = body;
    
    if (!name || !slug || !description || price === undefined || !category || inventory === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newProduct = addProduct({
      name,
      slug,
      description,
      price: Number(price),
      category,
      inventory: Number(inventory),
      image: image || undefined,
    });

    // Trigger revalidation for ISR pages
    await fetch(`${request.nextUrl.origin}/api/revalidate?path=/products/${slug}`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey || '',
      },
    }).catch(() => {
      // Ignore revalidation errors
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
