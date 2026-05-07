// Components never call fetch directly - they call these functions.
import {
  ListProductsResponse,
  SingleProductResponse,
  ListCategoriesResponse,
} from "../types/product";

const API_BASE = process.env.REACT_APP_API_BASE ?? "http://127.0.0.1:8000";

// Generic fetch wrapper

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;

  console.log(`[API] ${options?.method ?? "GET"} ${url}`);

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw {
      status: res.status,
      message: text,
    };
  }

  return res.json() as Promise<T>;
}

// Product endpoints

/* GET /product/list/ */
export async function listProducts(
  offset = 0,
  length = 100,
): Promise<ListProductsResponse> {
  return apiFetch<ListProductsResponse>(
    `/product/list/?offset=${offset}&length=${length}`,
  );
}

/* GET /product/get/<id> */
export async function getProduct(id: string): Promise<SingleProductResponse> {
  return apiFetch<SingleProductResponse>(`/product/get/${id}`);
}

// Category endpoints

/* GET /category/list/ */
export async function listCategories(): Promise<ListCategoriesResponse> {
  return apiFetch<ListCategoriesResponse>("/category/list/");
}

export interface FilterParams {
  search?: string;
  in_stock?: boolean;
  sort_by?: string;
  order?: "asc" | "desc";
  offset?: number;
  length?: number;
}

export async function filterProducts(
  params: FilterParams,
): Promise<ListProductsResponse> {
  const query = new URLSearchParams();

  if (params.search) query.append("search", params.search);

  if (params.in_stock !== undefined) {
    query.append("in_stock", String(params.in_stock));
  }

  if (params.sort_by) query.append("sort_by", params.sort_by);
  if (params.order) query.append("order", params.order);

  query.append("offset", String(params.offset ?? 0));
  query.append("length", String(params.length ?? 100));

  return apiFetch<ListProductsResponse>(`/product/filter/?${query.toString()}`);
}
