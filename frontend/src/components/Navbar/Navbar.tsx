import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.bracket}>[</span>
          RIPPLING
          <span className={styles.bracket}>]</span>
          <span className={styles.logoSub}>inventory</span>
        </div>

        <ul className={styles.links}>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Categories
            </NavLink>
          </li>
        </ul>

        <div className={styles.statusDot} title="Backend connected" />
      </nav>
    </header>
  );
};

export default Navbar;
