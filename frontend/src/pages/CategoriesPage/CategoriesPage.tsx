import React, { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useMutation } from "../../hooks/useMutation";
import { createCategory } from "../../services/api";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import Spinner from "../../components/Spinner/Spinner";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner";
import styles from "./CategoriesPage.module.scss";

const CategoriesPage: React.FC = () => {
  const { categories, loading, error, refetch } = useCategories();
  const createMut = useMutation(createCategory);

  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const handleCreate = async () => {
    if (!formTitle.trim()) return;
    const res = await createMut.mutate({
      title: formTitle.trim(),
      description: formDesc.trim(),
    });
    if (res) {
      setFormTitle("");
      setFormDesc("");
      setShowForm(false);
      refetch();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormTitle("");
    setFormDesc("");
    createMut.reset();
  };

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageSubtitle}>
            {loading
              ? "…"
              : `${categories.length} categor${categories.length === 1 ? "y" : "ies"}`}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.refreshBtn}
            onClick={refetch}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "↻ Refresh"}
          </button>
          <button
            className={styles.newBtn}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "✕ Cancel" : "+ New Category"}
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className={styles.createForm}>
          <h3 className={styles.formTitle}>New Category</h3>

          {createMut.error && (
            <ErrorBanner error={createMut.error} onDismiss={createMut.reset} />
          )}

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Title *</label>
              <input
                className={styles.input}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Electronics"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <input
                className={styles.input}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Short description…"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.saveBtn}
              onClick={handleCreate}
              disabled={createMut.loading || !formTitle.trim()}
            >
              {createMut.loading ? (
                <>
                  <Spinner size="sm" /> Creating…
                </>
              ) : (
                "Create"
              )}
            </button>
            <button className={styles.cancelBtn} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Page error */}
      {!loading && error && <ErrorBanner error={error} />}

      {/* Loading */}
      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && categories.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>◻</span>
          <p>No categories yet. Create one above.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && categories.length > 0 && (
        <div className={styles.grid}>
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
