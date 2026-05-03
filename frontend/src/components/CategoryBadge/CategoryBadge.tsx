import React from "react";
import { Link } from "react-router-dom";
import styles from "./CategoryBadge.module.scss";

interface CategoryBadgeProps {
  id: string;
  title: string;
  /** When true, renders as plain tag (no link) */
  static?: boolean;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  id,
  title,
  static: isStatic = false,
}) => {
  if (isStatic) {
    return <span className={styles.badge}>{title}</span>;
  }

  return (
    <Link
      to={`/categories/${id}`}
      className={`${styles.badge} ${styles.linked}`}
      onClick={(e) => e.stopPropagation()} // don't bubble to parent card
    >
      {title}
      <span className={styles.arrow}>→</span>
    </Link>
  );
};

export default CategoryBadge;
