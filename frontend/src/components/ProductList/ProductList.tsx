import React, { useState, useEffect } from "react";
import { Product, SortOption, StockFilter } from "../../types/product";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductList.module.scss";
import { filterProducts } from "../../services/api";

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  // Expand / collapse state
  // Only one card is expanded at a time. null = all collapsed.
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Filter / sort state
  const [search, setSearch] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("");

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {};

      if (search) params.search = search;

      if (stockFilter === "in_stock") params.in_stock = true;
      if (stockFilter === "out_of_stock") params.in_stock = false;

      if (sortBy === "price_asc") {
        params.sort_by = "price";
        params.order = "asc";
      }
      if (sortBy === "price_desc") {
        params.sort_by = "price";
        params.order = "desc";
      }
      if (sortBy === "name") {
        params.sort_by = "name";
        params.order = "asc";
      }

      const res = await filterProducts(params);

      const products = res || [];

      console.log("Filtered API response:", products);

      setData(products);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchFilteredProducts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, stockFilter, sortBy]);

  useEffect(() => {
    fetchFilteredProducts();
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Controls bar */}
      <div className={styles.controls}>
        {/* Search */}
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

        {/* Stock filter chips */}
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

        {/* Sort */}
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

        {/* Count */}
        <span className={styles.count}>
          {data.length}
          <span className={styles.countOf}> / {products.length}</span>
        </span>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Product list */}
      {data.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>◻</span>
          <p>No products match your filters.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {data.map((product, index) => (
            <div key={product.id}>
              <ProductCard
                product={product}
                isExpanded={expandedId === product.id}
                onToggle={handleToggle}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
