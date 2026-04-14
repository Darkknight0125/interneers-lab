// Custom hook that owns the async lifecycle of fetching products.
// Returns { products, loading, error, refetch }.

import { useState, useEffect, useCallback } from "react";
import { Product } from "../types/product";
import { listProducts } from "../services/api";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: {
    status?: number;
    message: string;
  } | null;
  refetch: () => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{
    status?: number;
    message: string;
  } | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProducts();
      console.log(data);
      setProducts(data);
      console.log("[useProducts] Loaded:", data.length, "products");
    } catch (err: any) {
      console.error("[useProducts] Raw error:", err);

      if (err?.status || err?.message) {
        // API error (structured)
        setError({
          status: err.status,
          message: err.message || "Something went wrong",
        });
      } else if (err instanceof Error) {
        // JS error (network, runtime, etc.)
        setError({
          message: err.message,
        });
      } else {
        // Unknown fallback
        setError({
          message: "Unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { products, loading, error, refetch: fetch };
}
