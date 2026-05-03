// Components never call fetch directly - they call these functions.
import {
  ListProductsResponse,
  SingleProductResponse,
  ListCategoriesResponse,
  SingleCategoryResponse,
  UpdateProductPayload,
  AssignCategoryPayload,
  CreateCategoryPayload,
  UpdateCategoryPayload,
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
  return apiFetch<SingleProductResponse>(`/product/get/${id}/`);
}

/* PUT /product/update/<id> */
export async function updateProduct(
  id: string,
  payload: UpdateProductPayload,
): Promise<SingleProductResponse> {
  return apiFetch<SingleProductResponse>(`/product/update/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/* DELETE /product/delete/<id> */
export async function deleteProduct(id: string): Promise<void> {
  return apiFetch<void>(`/product/delete/${id}/`, { method: "DELETE" });
}

/* POST /product/assign-category/<id>/ */
export async function assignCategory(
  productId: string,
  payload: AssignCategoryPayload,
): Promise<SingleProductResponse> {
  return apiFetch<SingleProductResponse>(
    `/product/assign-category/${productId}/`,
    { method: "POST", body: JSON.stringify(payload) },
  );
}

/* DELETE /product/remove-category/<id>/ */
export async function removeCategory(
  productId: string,
): Promise<SingleProductResponse> {
  return apiFetch<SingleProductResponse>(
    `/product/remove-category/${productId}/`,
    { method: "DELETE" },
  );
}

/* GET /product/category/<category_id>/ */
export async function getProductsByCategory(
  categoryId: string,
): Promise<ListProductsResponse> {
  return apiFetch<ListProductsResponse>(`/product/category/${categoryId}/`);
}

// Category endpoints

/* GET /category/list/ */
export async function listCategories(): Promise<ListCategoriesResponse> {
  return apiFetch<ListCategoriesResponse>("/category/list/");
}

/* GET /category/get/<id>/ */
export async function getCategory(id: string): Promise<SingleCategoryResponse> {
  return apiFetch<SingleCategoryResponse>(`/category/get/${id}/`);
}

/* POST /category/create/ */
export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<SingleCategoryResponse> {
  return apiFetch<SingleCategoryResponse>("/category/create/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* PUT /category/update/<id>/ */
export async function updateCategory(
  id: string,
  payload: UpdateCategoryPayload,
): Promise<SingleCategoryResponse> {
  return apiFetch<SingleCategoryResponse>(`/category/update/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/* DELETE /category/delete/<id>/ */
export async function deleteCategory(id: string): Promise<void> {
  return apiFetch<void>(`/category/delete/${id}/`, { method: "DELETE" });
}

// Filter endpoint

export interface FilterParams {
  search?: string;
  in_stock?: boolean;
  sort_by?: string;
  order?: "asc" | "desc";
  offset?: number;
  length?: number;
  category_ids?: string[];
}

/* GET /product/filter/ */
export async function filterProducts(
  params: FilterParams,
): Promise<ListProductsResponse> {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.in_stock !== undefined)
    query.append("in_stock", String(params.in_stock));
  if (params.sort_by) query.append("sort_by", params.sort_by);
  if (params.order) query.append("order", params.order);
  // Append each category id as a separate param: &category_ids=x&category_ids=y
  params.category_ids?.forEach((id) => query.append("category_ids", id));
  query.append("offset", String(params.offset ?? 0));
  query.append("length", String(params.length ?? 100));
  return apiFetch<ListProductsResponse>(`/product/filter/?${query.toString()}`);
}
