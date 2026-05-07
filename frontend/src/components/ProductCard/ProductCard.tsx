import React from "react";
import { Product } from "../../types/product";
import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  product: Product;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

// helpers
function formatPrice(price: number): string {
  return price.toLocaleString("en-IN");
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isExpanded,
  onToggle,
}) => {
  const inStock = product.inventory_quantity > 0;

  return (
    <article
      className={`${styles.card} ${isExpanded ? styles.expanded : ""}`}
      onClick={() => onToggle(product.id)}
      aria-expanded={isExpanded}
    >
      {/* Left accent bar - CSS only, scales on expand */}
      <div className={styles.accentBar} />

      {/* Collapsed header (always visible) */}
      <div className={styles.cardMain}>
        <div className={styles.cardTop}>
          <div className={styles.meta}>
            <span className={styles.brand}>{product.brand}</span>
            {product.category && (
              <span className={styles.category}>{product.category.title}</span>
            )}
          </div>
          <span
            className={`${styles.stockBadge} ${
              inStock ? styles.inStock : styles.outOfStock
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.cardBottom}>
          <span className={styles.price}>
            <span className={styles.currency}>₹</span>
            {formatPrice(product.price)}
          </span>
          <span
            className={`${styles.chevron} ${isExpanded ? styles.chevronUp : ""}`}
          >
            ↓
          </span>
        </div>
      </div>

      {/* Expanded detail panel */}
      {isExpanded && (
        <div
          className={styles.detail}
          onClick={(e) => e.stopPropagation()} // don't collapse on detail click
        >
          <div className={styles.detailDivider} />

          <p className={styles.description}>{product.description}</p>

          <div className={styles.detailGrid}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Inventory</span>
              <span className={styles.detailValue}>
                {product.inventory_quantity} units
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Category</span>
              <span className={styles.detailValue}>
                {product.category ? product.category.title : "—"}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Created</span>
              <span className={styles.detailValue}>
                {new Date(product.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>ID</span>
              <span className={`${styles.detailValue} ${styles.idValue}`}>
                {product.id}
              </span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default ProductCard;
