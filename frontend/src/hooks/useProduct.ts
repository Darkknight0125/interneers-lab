import { useState, useEffect, useCallback } from "react";
import { Product, ApiError } from "../types/product";
import { getProduct } from "../services/api";

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function useProduct(id: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProduct(id);
      setProduct(data.product);
    } catch (err: unknown) {
      setError(toApiError(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { product, loading, error, refetch: fetch };
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
