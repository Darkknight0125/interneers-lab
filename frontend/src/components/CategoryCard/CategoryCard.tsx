import React from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "../../types/product";
import styles from "./CategoryCard.module.scss";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
      onClick={() => navigate(`/categories/${category.id}`)}
    >
      <div className={styles.accentBar} />

      <div className={styles.header}>
        <span className={styles.label}>CATEGORY</span>
        <span className={styles.arrow}>→</span>
      </div>

      <h3 className={styles.title}>{category.title}</h3>

      {category.description && (
        <p className={styles.description}>{category.description}</p>
      )}

      <div className={styles.footer}>
        <span className={styles.date}>
          {new Date(category.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </article>
  );
};

export default CategoryCard;
