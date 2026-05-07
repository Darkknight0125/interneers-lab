import React from "react";
import ProductList from "../../components/ProductList/ProductList";
import styles from "./ProductsPage.module.scss";

const ProductsPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.pageSubtitle}>
            Live inventory · click a product to view or edit
          </p>
        </div>
      </div>

      <ProductList />
    </div>
  );
};

export default ProductsPage;
