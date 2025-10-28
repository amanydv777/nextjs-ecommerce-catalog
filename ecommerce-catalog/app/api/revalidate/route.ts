import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { validateApiKey } from '@/lib/auth';

// POST /api/revalidate - On-demand ISR revalidation (protected)
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!validateApiKey(apiKey)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    revalidatePath(path);
    
    return NextResponse.json({ 
      revalidated: true, 
      path,
      now: Date.now() 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
