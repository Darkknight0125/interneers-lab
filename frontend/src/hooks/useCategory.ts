// Fetches only the category metadata (title, description, dates).
// Products for the category are fetched independently by ProductList

import { useState, useEffect, useCallback } from "react";
import { Category, ApiError } from "../types/product";
import { getCategory } from "../services/api";

interface UseCategoryResult {
  category: Category | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function useCategory(id: string): UseCategoryResult {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCategory(id);
      setCategory(data.category);
    } catch (err: unknown) {
      setError(toApiError(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { category, loading, error, refetch: fetch };
}

function toApiError(err: unknown): ApiError {
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    return {
      status: typeof e.status === "number" ? e.status : undefined,
      message:
        typeof e.message === "string" ? e.message : "Something went wrong",
    };
  }
  if (err instanceof Error) return { message: err.message };
  return { message: "Unknown error occurred" };
}
