import React, { useState, useEffect, useCallback } from "react";
import { Product, SortOption, StockFilter } from "../../types/product";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductList.module.scss";
import { filterProducts } from "../../services/api";
import Spinner from "../Spinner/Spinner";
import ErrorBanner from "../ErrorBanner/ErrorBanner";

interface ProductListProps {
  /**
   * When provided, every filter/sort API call includes
   * category_ids=[categoryId] — scoping results to that category.
   * When absent, the full product catalogue is queried.
   */
  categoryId?: string;
  hideControls?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  categoryId,
  hideControls = false,
}) => {
  // Filter state
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("");

  // Fetch result state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    status?: number;
    message: string;
  } | null>(null);

  // Single fetch function used by both contexts
  const doFetch = useCallback(
    async (s: string, stock: StockFilter, sort: SortOption) => {
      setLoading(true);
      setError(null);
      try {
        let in_stock: boolean | undefined;
        if (stock === "in_stock") in_stock = true;
        if (stock === "out_of_stock") in_stock = false;

        let sort_by: string | undefined;
        let order: "asc" | "desc" | undefined;
        if (sort === "price_asc") {
          sort_by = "price";
          order = "asc";
        }
        if (sort === "price_desc") {
          sort_by = "price";
          order = "desc";
        }
        if (sort === "name") {
          sort_by = "name";
          order = "asc";
        }

        const data = await filterProducts({
          search: s,
          in_stock,
          sort_by,
          order,
          // If a categoryId is given it is always included — this is the
          // only difference between the /products page and a category page.
          ...(categoryId ? { category_ids: [categoryId] } : {}),
        });

        setProducts(data);
      } catch (err: any) {
        setError({
          status: err?.status,
          message: err?.message ?? "Failed to load products",
        });
      } finally {
        setLoading(false);
      }
    },
    [categoryId], // re-create only when the scoping category changes
  );

  // Trigger fetch on mount and whenever filters change
  useEffect(() => {
    const t = setTimeout(
      () => doFetch(search, stockFilter, sortBy),
      search ? 300 : 0, // debounce only when user is typing
    );
    return () => clearTimeout(t);
  }, [search, stockFilter, sortBy, doFetch]);

  return (
    <div className={styles.wrapper}>
      {/* Controls */}
      {!hideControls && (
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.chips}>
            {(
              [
                { value: "all", label: "All" },
                { value: "in_stock", label: "In Stock" },
                { value: "out_of_stock", label: "Out of Stock" },
              ] as { value: StockFilter; label: string }[]
            ).map(({ value, label }) => (
              <button
                key={value}
                className={`${styles.chip} ${
                  stockFilter === value ? styles.chipActive : ""
                }`}
                onClick={() => setStockFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="">Sort by</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="name">Name A–Z</option>
          </select>

          <span className={styles.count}>
            {loading ? <Spinner size="sm" /> : products.length}
          </span>
        </div>
      )}

      {/* Error */}
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}

      {/* Loading skeletons */}
      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && products.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>◻</span>
          <p>No products found.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && products.length > 0 && (
        <div className={styles.grid}>
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
