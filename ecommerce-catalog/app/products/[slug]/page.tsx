import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getProductBySlug } from '@/lib/data';
import type { Product } from '@/types/product';

// ISR: Generate static pages for all products at build time
export async function generateStaticParams() {
  const products = getProducts();
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  
  return {
    title: `${product.name} - CartCraft`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }
  
  const isLowStock = product.inventory < 20;
  const isOutOfStock = product.inventory === 0;
  const lastUpdatedDate = new Date(product.lastUpdated).toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative h-96 bg-white border border-gray-200 rounded-lg overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-blue-200">
                  <svg className="w-32 h-32 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  ${product.price.toFixed(2)}
                </div>
                {isOutOfStock ? (
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                    Only {product.inventory} left!
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    In Stock: {product.inventory}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Description
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Product Details
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Product ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-sm text-gray-900">${product.price.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Inventory</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.inventory} units</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lastUpdatedDate}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This page uses Incremental Static Regeneration (ISR) 
                with a revalidation period of 60 seconds. The page is pre-generated at build time 
                and automatically regenerated when data changes or after 60 seconds.
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
