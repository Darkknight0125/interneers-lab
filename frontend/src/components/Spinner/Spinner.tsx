import React from "react";
import styles from "./Spinner.module.scss";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md" }) => (
  <span className={`${styles.spinner} ${styles[size]}`} aria-label="Loading" />
);

export default Spinner;
