import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/product";
import CategoryBadge from "../CategoryBadge/CategoryBadge";
import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  product: Product;
  index?: number;
}

// helpers
function formatPrice(price: number): string {
  return price.toLocaleString("en-IN");
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const inStock = product.inventory_quantity > 0;

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className={styles.accentBar} />

      <div className={styles.cardMain}>
        <div className={styles.cardTop}>
          <div className={styles.meta}>
            <span className={styles.brand}>{product.brand}</span>
            {product.category && (
              <CategoryBadge
                id={product.category.id}
                title={product.category.title}
              />
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

        <p className={styles.description}>{product.description}</p>

        <div className={styles.cardBottom}>
          <span className={styles.price}>
            <span className={styles.currency}>₹</span>
            {formatPrice(product.price)}
          </span>
          <span className={styles.viewHint}>View →</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
