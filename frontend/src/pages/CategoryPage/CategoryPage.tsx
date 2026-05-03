import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategory } from "../../hooks/useCategory";
import { useMutation } from "../../hooks/useMutation";
import { updateCategory, deleteCategory } from "../../services/api";
import { UpdateCategoryPayload } from "../../types/product";
import ProductList from "../../components/ProductList/ProductList";
import Spinner from "../../components/Spinner/Spinner";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner";
import styles from "./CategoryPage.module.scss";

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface FormState {
  title: string;
  description: string;
}

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { category, loading, error, refetch } = useCategory(id!);

  const updateMut = useMutation(updateCategory);
  const deleteMut = useMutation(deleteCategory);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState<FormState>({ title: "", description: "" });

  useEffect(() => {
    if (category) {
      setForm({ title: category.title, description: category.description });
    }
  }, [category]);

  const handleSave = async () => {
    if (!category) return;
    const payload: UpdateCategoryPayload = {
      title: form.title,
      description: form.description,
    };
    const res = await updateMut.mutate(category.id, payload);
    if (res) {
      refetch();
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (category)
      setForm({ title: category.title, description: category.description });
    updateMut.reset();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!category) return;
    const res = await deleteMut.mutate(category.id);
    if (res !== null) navigate("/categories");
  };

  return (
    <div className={styles.page}>
      {/* Back nav */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back to Categories
      </button>

      {/* Loading */}
      {loading && (
        <div className={styles.centerState}>
          <Spinner size="lg" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className={styles.centerState}>
          <ErrorBanner error={error} />
          <button className={styles.retryBtn} onClick={refetch}>
            ↻ Retry
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && category && (
        <>
          {/* Category header card */}
          <div className={styles.headerCard}>
            <div className={styles.headerTop}>
              <span className={styles.catLabel}>CATEGORY</span>
              <div className={styles.headerActions}>
                {!isEditing && (
                  <>
                    <button
                      className={styles.editBtn}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                    {!showDeleteConfirm ? (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Delete
                      </button>
                    ) : (
                      <div className={styles.confirmRow}>
                        <span className={styles.confirmText}>Sure?</span>
                        <button
                          className={styles.confirmYes}
                          onClick={handleDelete}
                          disabled={deleteMut.loading}
                        >
                          {deleteMut.loading ? <Spinner size="sm" /> : "Yes"}
                        </button>
                        <button
                          className={styles.confirmNo}
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          No
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* View mode */}
            {!isEditing && (
              <div className={styles.viewMode}>
                <h1 className={styles.catTitle}>{category.title}</h1>
                {category.description && (
                  <p className={styles.catDesc}>{category.description}</p>
                )}
                <div className={styles.catMeta}>
                  <span>Created {fmtDate(category.created_at)}</span>
                  <span>·</span>
                  <span>Updated {fmtDate(category.updated_at)}</span>
                  <span>·</span>
                </div>
              </div>
            )}

            {/* Edit mode */}
            {isEditing && (
              <div className={styles.editMode}>
                {updateMut.error && (
                  <ErrorBanner
                    error={updateMut.error}
                    onDismiss={updateMut.reset}
                  />
                )}
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Title *</label>
                    <input
                      className={styles.input}
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Description</label>
                    <input
                      className={styles.input}
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={updateMut.loading || !form.title.trim()}
                  >
                    {updateMut.loading ? (
                      <>
                        <Spinner size="sm" /> Saving…
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {deleteMut.error && (
              <ErrorBanner
                error={deleteMut.error}
                onDismiss={deleteMut.reset}
                inline
              />
            )}
          </div>

          <div className={styles.productsSection}>
            <h2 className={styles.sectionTitle}>Products in this category</h2>

            {/* ProductList fetches its own data scoped to this category */}
            <ProductList categoryId={id} />
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
