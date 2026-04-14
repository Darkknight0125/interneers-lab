import React from "react";
import styles from "./CategoriesPage.module.scss";

const CategoriesPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Categories</h1>
      <p className={styles.sub}>Coming in a future week.</p>
    </div>
  );
};

export default CategoriesPage;
