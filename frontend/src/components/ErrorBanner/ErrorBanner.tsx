import React from "react";
import { ApiError } from "../../types/product";
import styles from "./ErrorBanner.module.scss";

interface ErrorBannerProps {
  error: ApiError;
  onDismiss?: () => void;
  /** Renders inline (no margin) — useful inside forms */
  inline?: boolean;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  error,
  onDismiss,
  inline = false,
}) => {
  let displayMessage = error.message;
  try {
    const parsed = JSON.parse(error.message);
    if (typeof parsed === "object" && parsed !== null) {
      // Flatten all field errors into one string
      displayMessage = Object.entries(parsed)
        .map(([field, msgs]) =>
          Array.isArray(msgs)
            ? `${field}: ${msgs.join(", ")}`
            : `${field}: ${msgs}`,
        )
        .join(" · ");
    }
  } catch {
    // plain string, use as-is
  }

  return (
    <div className={`${styles.banner} ${inline ? styles.inline : ""}`}>
      <div className={styles.left}>
        <span className={styles.message}>{displayMessage}</span>
      </div>
      {onDismiss && (
        <button
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
