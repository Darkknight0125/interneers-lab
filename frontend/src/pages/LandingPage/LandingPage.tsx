import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.scss";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const touchStartY = useRef<number>(0);

  const goToProducts = () => {
    if (leaving) return;
    setLeaving(true);
    // Wait for the exit animation, then navigate
    setTimeout(() => navigate("/products"), 700);
  };

  // Wheel (desktop)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) goToProducts(); // scroll down = enter
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving]);

  // Touch (mobile)
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (delta > 40) goToProducts(); // swipe up
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving]);

  return (
    <div className={`${styles.landing} ${leaving ? styles.leaving : ""}`}>
      {/* Animated grid lines */}
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={styles.gridLine}
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>

      {/* Floating accent orbs */}
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />

      {/* Main content */}
      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          RIPPLING · INTERNEERS LAB 2025
        </div>

        <h1 className={styles.headline}>
          <span className={styles.headlineLine1}>Product</span>
          <span className={styles.headlineLine2}>Catalogue</span>
        </h1>

        <p className={styles.subline}>
          Full-stack inventory management.
          <br />
          Django × React × TypeScript.
        </p>

        <button className={styles.enterBtn} onClick={goToProducts}>
          <span className={styles.enterBtnText}>Enter</span>
          <span className={styles.enterBtnArrow}>↓</span>
        </button>

        <p className={styles.scrollHint}>or scroll down</p>
      </div>

      {/* Bottom ticker */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className={styles.tickerItem}>
              PRODUCTS · CATEGORIES · INVENTORY · BRANDS · CATALOGUE ·&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
