import React from "react";
import { useProducts } from "../../hooks/useProducts";
import ProductList from "../../components/ProductList/ProductList";
import styles from "./ProductsPage.module.scss";

// Skeleton cards shown while loading
const SkeletonGrid: React.FC = () => (
  <div className={styles.skeletonGrid}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className={styles.skeletonCard} />
    ))}
  </div>
);

const ProductsPage: React.FC = () => {
  const { products, loading, error, refetch } = useProducts();

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.pageSubtitle}>
            Live inventory from the Django backend
          </p>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={refetch}
          disabled={loading}
        >
          {loading ? "Loading…" : "↻ Refresh"}
        </button>
      </div>

      {/* Loading state */}
      {loading && <SkeletonGrid />}

      {/* Error state */}
      {!loading && error && (
        <div className={styles.errorBox}>
          <span className={styles.errorCode}>{error?.status ?? "ERR"}</span>
          <div>
            <p className={styles.errorMsg}>{error?.message}</p>
          </div>
          <button className={styles.retryBtn} onClick={refetch}>
            ↻ Retry
          </button>
        </div>
      )}

      {/* Product list */}
      {!loading && !error && <ProductList products={products} />}
    </div>
  );
};

export default ProductsPage;
