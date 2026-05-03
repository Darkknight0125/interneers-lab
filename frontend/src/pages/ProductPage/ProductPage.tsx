import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import { useCategories } from "../../hooks/useCategories";
import { useMutation } from "../../hooks/useMutation";
import {
  updateProduct,
  assignCategory,
  removeCategory,
  deleteProduct,
} from "../../services/api";
import { UpdateProductPayload } from "../../types/product";
import CategoryBadge from "../../components/CategoryBadge/CategoryBadge";
import Spinner from "../../components/Spinner/Spinner";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner";
import styles from "./ProductPage.module.scss";

// helpers
function formatPrice(n: number) {
  return n.toLocaleString("en-IN");
}
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Form state shape
interface FormState {
  name: string;
  brand: string;
  price: string;
  description: string;
  inventory_quantity: string;
  categoryId: string; // "" = no category, "REMOVE" = explicitly remove
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { product, loading, error, refetch } = useProduct(id!);
  const { categories, loading: catsLoading } = useCategories();

  const updateMut = useMutation(updateProduct);
  const assignMut = useMutation(assignCategory);
  const removeMut = useMutation(removeCategory);
  const deleteMut = useMutation(deleteProduct);

  // UI mode
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [form, setForm] = useState<FormState>({
    name: "",
    brand: "",
    price: "",
    description: "",
    inventory_quantity: "",
    categoryId: "",
  });

  // Populate form when product loads / editing starts
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        brand: product.brand,
        price: String(product.price),
        description: product.description,
        inventory_quantity: String(product.inventory_quantity),
        categoryId: product.category?.id ?? "",
      });
    }
  }, [product]);

  // Handlers

  const handleField = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!product) return;

    // 1. Update scalar fields
    const payload: UpdateProductPayload = {
      name: form.name,
      brand: form.brand,
      price: Number(form.price),
      description: form.description,
      inventory_quantity: Number(form.inventory_quantity),
    };
    const updated = await updateMut.mutate(product.id, payload);
    if (!updated) return; // error already in updateMut.error

    // 2. Handle category change
    const originalCatId = product.category?.id ?? "";
    if (form.categoryId !== originalCatId) {
      if (form.categoryId === "" || form.categoryId === "REMOVE") {
        const res = await removeMut.mutate(product.id);
        if (!res) return;
      } else {
        const res = await assignMut.mutate(product.id, {
          category_id: form.categoryId,
        });
        if (!res) return;
      }
    }

    refetch();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!product) return;
    const res = await deleteMut.mutate(product.id);
    if (res !== null) navigate("/products");
  };

  const handleCancel = () => {
    if (product) {
      setForm({
        name: product.name,
        brand: product.brand,
        price: String(product.price),
        description: product.description,
        inventory_quantity: String(product.inventory_quantity),
        categoryId: product.category?.id ?? "",
      });
    }
    updateMut.reset();
    assignMut.reset();
    removeMut.reset();
    setIsEditing(false);
  };

  const isSaving = updateMut.loading || assignMut.loading || removeMut.loading;
  const saveError = updateMut.error ?? assignMut.error ?? removeMut.error;

  return (
    <div className={styles.page}>
      {/* Back nav */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Page-level loading */}
      {loading && (
        <div className={styles.centerState}>
          <Spinner size="lg" />
        </div>
      )}

      {/* Page-level error */}
      {!loading && error && (
        <div className={styles.centerState}>
          <ErrorBanner error={error} />
          <button className={styles.retryBtn} onClick={refetch}>
            ↻ Retry
          </button>
        </div>
      )}

      {/* Main content */}
      {!loading && !error && product && (
        <div className={styles.layout}>
          {/* Left column: identity */}
          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <span className={styles.sideLabel}>Brand</span>
              <span className={styles.sideBrand}>{product.brand}</span>

              <span className={styles.sideLabel}>Price</span>
              <span className={styles.sidePrice}>
                <span className={styles.currency}>₹</span>
                {formatPrice(product.price)}
              </span>

              <span className={styles.sideLabel}>Stock</span>
              <span
                className={`${styles.stockBadge} ${
                  product.inventory_quantity > 0
                    ? styles.inStock
                    : styles.outOfStock
                }`}
              >
                {product.inventory_quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>

              <span className={styles.sideLabel}>Inventory</span>
              <span className={styles.sideValue}>
                {product.inventory_quantity} units
              </span>

              <span className={styles.sideLabel}>Category</span>
              <span className={styles.sideValue}>
                {product.category ? (
                  <CategoryBadge
                    id={product.category.id}
                    title={product.category.title}
                  />
                ) : (
                  <span className={styles.noCategory}>Uncategorized</span>
                )}
              </span>

              <span className={styles.sideLabel}>Created</span>
              <span className={styles.sideValue}>
                {fmtDate(product.created_at)}
              </span>

              <span className={styles.sideLabel}>Updated</span>
              <span className={styles.sideValue}>
                {fmtDate(product.updated_at)}
              </span>

              <span className={styles.sideLabel}>ID</span>
              <span className={styles.sideId}>{product.id}</span>
            </div>

            {/* Delete */}
            {!isEditing && (
              <div className={styles.dangerZone}>
                <span className={styles.dangerLabel}>Danger Zone</span>
                {!showDeleteConfirm ? (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Product
                  </button>
                ) : (
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmText}>Are you sure?</span>
                    <button
                      className={styles.confirmYes}
                      onClick={handleDelete}
                      disabled={deleteMut.loading}
                    >
                      {deleteMut.loading ? (
                        <Spinner size="sm" />
                      ) : (
                        "Yes, delete"
                      )}
                    </button>
                    <button
                      className={styles.confirmNo}
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
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
            )}
          </aside>

          {/* Right column: main content */}
          <main className={styles.main}>
            {/* Header */}
            <div className={styles.mainHeader}>
              {isEditing ? (
                <span className={styles.editingTag}>✎ Editing</span>
              ) : (
                <span className={styles.viewTag}>{product.brand}</span>
              )}

              <div className={styles.headerActions}>
                {!isEditing && (
                  <button
                    className={styles.editBtn}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* VIEW MODE */}
            {!isEditing && (
              <div className={styles.viewMode}>
                <h1 className={styles.productName}>{product.name}</h1>
                <p className={styles.productDesc}>{product.description}</p>
              </div>
            )}

            {/* EDIT MODE */}
            {isEditing && (
              <div className={styles.editMode}>
                {saveError && (
                  <ErrorBanner
                    error={saveError}
                    onDismiss={() => {
                      updateMut.reset();
                      assignMut.reset();
                      removeMut.reset();
                    }}
                  />
                )}

                <div className={styles.formGrid}>
                  {/* Name */}
                  <div className={styles.fieldFull}>
                    <label className={styles.label}>Name</label>
                    <input
                      className={styles.input}
                      name="name"
                      value={form.name}
                      onChange={handleField}
                      maxLength={200}
                    />
                  </div>

                  {/* Brand */}
                  <div className={styles.field}>
                    <label className={styles.label}>Brand</label>
                    <input
                      className={styles.input}
                      name="brand"
                      value={form.brand}
                      onChange={handleField}
                    />
                  </div>

                  {/* Price */}
                  <div className={styles.field}>
                    <label className={styles.label}>Price (₹)</label>
                    <input
                      className={styles.input}
                      name="price"
                      type="number"
                      min={0}
                      value={form.price}
                      onChange={handleField}
                    />
                  </div>

                  {/* Inventory */}
                  <div className={styles.field}>
                    <label className={styles.label}>Inventory Qty</label>
                    <input
                      className={styles.input}
                      name="inventory_quantity"
                      type="number"
                      min={0}
                      value={form.inventory_quantity}
                      onChange={handleField}
                    />
                  </div>

                  {/* Category */}
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Category
                      {catsLoading && <Spinner size="sm" />}
                    </label>
                    <select
                      className={styles.select}
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleField}
                      disabled={catsLoading}
                    >
                      <option value="">— No Category —</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className={styles.fieldFull}>
                    <label className={styles.label}>Description</label>
                    <textarea
                      className={styles.textarea}
                      name="description"
                      value={form.description}
                      onChange={handleField}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Form actions */}
                <div className={styles.formActions}>
                  <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Spinner size="sm" /> Saving…
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
