// TypeScript interfaces that mirror the Django API response shapes.

export interface Category {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  inventory_quantity: number;
  category: Category | null;
  created_at: string;
  updated_at: string;
}

// API response wrappers
export type ListProductsResponse = Product[];

export interface SingleProductResponse {
  product: Product;
}

export type ListCategoriesResponse = Category[];

// UI helper types
export type SortOption = "price_asc" | "price_desc" | "name" | "";
export type StockFilter = "all" | "in_stock" | "out_of_stock";
