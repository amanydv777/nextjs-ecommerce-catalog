import fs from 'fs';
import path from 'path';
import type { Product } from '@/types/product';

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

export function getProducts(): Product[] {
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getProducts();
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find((product) => product.id === id);
}

export function saveProducts(products: Product[]): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
}

export function addProduct(product: Omit<Product, 'id' | 'lastUpdated'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: (Math.max(...products.map(p => parseInt(p.id))) + 1).toString(),
    lastUpdated: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Product | null {
  const products = getProducts();
  const index = products.findIndex((product) => product.id === id);
  
  if (index === -1) {
    return null;
  }
  
  products[index] = {
    ...products[index],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  
  saveProducts(products);
  return products[index];
}

export function getInventoryStats() {
  const products = getProducts();
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.inventory < 20);
  const outOfStockItems = products.filter(p => p.inventory === 0);
  const totalInventory = products.reduce((sum, p) => sum + p.inventory, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.inventory), 0);
  
  return {
    totalProducts,
    lowStockItems,
    outOfStockItems,
    totalInventory,
    totalValue,
  };
}
