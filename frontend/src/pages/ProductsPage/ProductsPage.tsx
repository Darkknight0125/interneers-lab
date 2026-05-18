import React, { useState, useCallback } from "react";
import ProductList from "../../components/ProductList/ProductList";
import CreateProductModal from "../../components/CreateProductModal/CreateProductModal";
import styles from "./ProductsPage.module.scss";

const ProductsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  // Increment this to signal ProductList to re-fetch after a create
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.pageSubtitle}>
            Live inventory · click a product to view or edit
          </p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          + Add Product
        </button>
      </div>

      {/* key prop forces ProductList to remount & re-fetch after a create */}
      <ProductList key={refreshKey} />

      {showModal && (
        <CreateProductModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
};

export default ProductsPage;
