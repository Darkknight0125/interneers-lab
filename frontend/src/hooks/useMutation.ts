// Generic hook for any write operation (POST / PUT / DELETE).
// Usage:
//   const { mutate, loading, error, reset } = useMutation(updateProduct);
//   await mutate(id, payload);

import { useState, useCallback } from "react";
import { ApiError } from "../types/product";

interface MutationResult<TArgs extends unknown[], TResult> {
  mutate: (...args: TArgs) => Promise<TResult | null>;
  loading: boolean;
  error: ApiError | null;
  reset: () => void;
}

export function useMutation<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
): MutationResult<TArgs, TResult> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const reset = useCallback(() => setError(null), []);

  const mutate = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        return result;
      } catch (err: unknown) {
        const apiErr = toApiError(err);
        setError(apiErr);
        console.error("[useMutation] error:", apiErr);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { mutate, loading, error, reset };
}

// ─── helper ──────────────────────────────────────────────────

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
