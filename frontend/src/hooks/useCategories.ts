import { useState, useEffect, useCallback } from "react";
import { Category, ApiError } from "../types/product";
import { listCategories } from "../services/api";

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCategories();
      setCategories(data);
    } catch (err: unknown) {
      setError(toApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { categories, loading, error, refetch: fetch };
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
