import { getProducts } from '@/lib/data';
import ProductList from '@/components/ProductList';

// SSG: This page is statically generated at build time
export default function Home() {
  const products = getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Product Catalog
          </h1>
          <p className="text-gray-600">
            Browse our collection of products. This page uses Static Site Generation (SSG).
          </p>
        </div>
        
        <ProductList products={products} />
      </div>
    </div>
  );
}
