import { NextRequest, NextResponse } from 'next/server';
import { updateProduct, getProductById } from '@/lib/data';
import { validateApiKey } from '@/lib/auth';

// PUT /api/products/update/[id] - Update an existing product (protected)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!validateApiKey(apiKey)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    const existingProduct = getProductById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = updateProduct(id, body);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    // Trigger revalidation for ISR pages
    await fetch(`${request.nextUrl.origin}/api/revalidate?path=/products/${updatedProduct.slug}`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey || '',
      },
    }).catch(() => {
      // Ignore revalidation errors
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
