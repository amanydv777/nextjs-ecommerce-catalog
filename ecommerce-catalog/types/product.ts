export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  image?: string;
  lastUpdated: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  image?: string;
}
