'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import type { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 12;

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div>
      <div className="mb-8 space-y-4">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery}
          placeholder="Search by name or description..."
        />
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Showing {showAll ? filteredProducts.length : Math.min(INITIAL_DISPLAY_COUNT, filteredProducts.length)} of {filteredProducts.length} products
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAll ? filteredProducts : filteredProducts.slice(0, INITIAL_DISPLAY_COUNT)).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* See More Button */}
          {filteredProducts.length > INITIAL_DISPLAY_COUNT && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {showAll ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Show Less
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    See More ({filteredProducts.length - INITIAL_DISPLAY_COUNT} more)
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
