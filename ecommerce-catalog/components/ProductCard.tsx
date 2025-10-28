'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isLowStock = product.inventory < 20;
  const isOutOfStock = product.inventory === 0;
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;
    
    setIsAdding(true);
    addToCart(product);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Product Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-blue-200">
            <svg className="w-20 h-20 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        <span className="absolute top-2 right-2 text-xs px-2 py-1 bg-blue-600 text-white rounded-full shadow-md">
          {product.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          
          <div className="text-right">
            {isOutOfStock ? (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-600 font-semibold rounded">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 font-semibold rounded">
                Only {product.inventory} left
              </span>
            ) : (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-600 font-semibold rounded">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isAdding
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : isAdding ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Added!
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </span>
          )}
        </button>
      </div>
    </Link>
  );
}
