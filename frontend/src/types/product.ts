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

export interface SingleCategoryResponse {
  category: Category;
}

// Mutation payloads
export interface UpdateProductPayload {
  name?: string;
  brand?: string;
  price?: number;
  description?: string;
  inventory_quantity?: number;
}

export interface AssignCategoryPayload {
  category_id: string;
}

export interface CreateCategoryPayload {
  title: string;
  description: string;
}

export interface UpdateCategoryPayload {
  title?: string;
  description?: string;
}

// Shared error shape (matches apiFetch throw)

export interface ApiError {
  status?: number;
  message: string;
}

// UI helper types
export type SortOption = "price_asc" | "price_desc" | "name" | "";
export type StockFilter = "all" | "in_stock" | "out_of_stock";
