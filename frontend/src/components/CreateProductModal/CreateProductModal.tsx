import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { useMutation } from "../../hooks/useMutation";
import { createProduct, bulkUploadProducts } from "../../services/api";
import {
  CreateProductPayload,
  BulkUploadResponse,
  BulkUploadError,
} from "../../types/product";
import Spinner from "../Spinner/Spinner";
import ErrorBanner from "../ErrorBanner/ErrorBanner";
import styles from "./CreateProductModal.module.scss";

type Tab = "single" | "bulk";

interface CreateProductModalProps {
  onClose: () => void;
  onCreated: () => void; // called after successful single create or bulk upload
}

interface SingleForm {
  name: string;
  brand: string;
  price: string;
  description: string;
  inventory_quantity: string;
  category_id: string;
}

const EMPTY_FORM: SingleForm = {
  name: "",
  brand: "",
  price: "",
  description: "",
  inventory_quantity: "",
  category_id: "",
};

const CSV_HEADERS =
  "name,brand,price,description,inventory_quantity,category_id";
const CSV_EXAMPLE = `${CSV_HEADERS}\nLaptop,Dell,90000,Gaming laptop,10,\nMouse,Logitech,2500,Wireless mouse,50,`;

function downloadTemplate() {
  const blob = new Blob([CSV_EXAMPLE], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  onClose,
  onCreated,
}) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("single");

  const { categories, loading: catsLoading } = useCategories();
  const createMut = useMutation(createProduct);

  const [form, setForm] = useState<SingleForm>(EMPTY_FORM);

  const handleField = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSingleSubmit = async () => {
    const payload: CreateProductPayload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      inventory_quantity: Number(form.inventory_quantity),
      ...(form.category_id ? { category_id: form.category_id } : {}),
    };
    const res = await createMut.mutate(payload);
    if (res) {
      onCreated();
      navigate(`/products/${res.product.id}`);
    }
  };

  const singleValid =
    form.name.trim() &&
    form.brand.trim() &&
    form.price !== "" &&
    Number(form.price) >= 0 &&
    form.inventory_quantity !== "" &&
    Number(form.inventory_quantity) >= 0;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState<{
    status?: number;
    message: string;
  } | null>(null);
  const [bulkResult, setBulkResult] = useState<BulkUploadResponse | null>(null);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".csv")) setCsvFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCsvFile(file);
  };

  const handleBulkSubmit = async () => {
    if (!csvFile) return;
    setBulkLoading(true);
    setBulkError(null);
    setBulkResult(null);
    try {
      const res = await bulkUploadProducts(csvFile);
      setBulkResult(res);
      if (res.success_count > 0) onCreated();
    } catch (err: any) {
      setBulkError({
        status: err?.status,
        message: err?.message ?? "Upload failed",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Add Product</h2>
            <p className={styles.subtitle}>Create one or import many</p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "single" ? styles.tabActive : ""}`}
            onClick={() => setTab("single")}
          >
            Single Product
          </button>
          <button
            className={`${styles.tab} ${tab === "bulk" ? styles.tabActive : ""}`}
            onClick={() => setTab("bulk")}
          >
            Bulk CSV Upload
          </button>
        </div>

        {/* Tab: Single */}
        {tab === "single" && (
          <div className={styles.body}>
            {createMut.error && (
              <ErrorBanner
                error={createMut.error}
                onDismiss={createMut.reset}
              />
            )}

            <div className={styles.formGrid}>
              <div className={styles.fieldFull}>
                <label className={styles.label}>Name *</label>
                <input
                  className={styles.input}
                  name="name"
                  value={form.name}
                  onChange={handleField}
                  placeholder="e.g. Gaming Laptop"
                  maxLength={200}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Brand *</label>
                <input
                  className={styles.input}
                  name="brand"
                  value={form.brand}
                  onChange={handleField}
                  placeholder="e.g. Dell"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Price (₹) *</label>
                <input
                  className={styles.input}
                  name="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={handleField}
                  placeholder="90000"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Inventory Qty *</label>
                <input
                  className={styles.input}
                  name="inventory_quantity"
                  type="number"
                  min={0}
                  value={form.inventory_quantity}
                  onChange={handleField}
                  placeholder="10"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Category
                  {catsLoading && <Spinner size="sm" />}
                </label>
                <select
                  className={styles.select}
                  name="category_id"
                  value={form.category_id}
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

              <div className={styles.fieldFull}>
                <label className={styles.label}>Description *</label>
                <textarea
                  className={styles.textarea}
                  name="description"
                  value={form.description}
                  onChange={handleField}
                  placeholder="Short product description…"
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.submitBtn}
                onClick={handleSingleSubmit}
                disabled={createMut.loading || !singleValid}
              >
                {createMut.loading ? (
                  <>
                    <Spinner size="sm" /> Creating…
                  </>
                ) : (
                  "Create Product"
                )}
              </button>
              <button className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tab: Bulk */}
        {tab === "bulk" && (
          <div className={styles.body}>
            {/* Template download hint */}
            <div className={styles.templateRow}>
              <span className={styles.templateText}>
                CSV must have headers:&nbsp;
                <code className={styles.code}>{CSV_HEADERS}</code>
              </span>
              <button className={styles.templateBtn} onClick={downloadTemplate}>
                ↓ Download template
              </button>
            </div>

            {/* Drop zone */}
            {!bulkResult && (
              <div
                className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""} ${csvFile ? styles.dropZoneHasFile : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className={styles.hiddenInput}
                  onChange={handleFileSelect}
                />
                {csvFile ? (
                  <div className={styles.fileChosen}>
                    <span className={styles.fileIcon}>📄</span>
                    <span className={styles.fileName}>{csvFile.name}</span>
                    <span className={styles.fileSize}>
                      {(csvFile.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      className={styles.clearFile}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCsvFile(null);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className={styles.dropPrompt}>
                    <span className={styles.dropIcon}>↑</span>
                    <span className={styles.dropText}>
                      Drop CSV here or click to browse
                    </span>
                    <span className={styles.dropSub}>.csv files only</span>
                  </div>
                )}
              </div>
            )}

            {/* Errors from API */}
            {bulkError && (
              <ErrorBanner
                error={bulkError}
                onDismiss={() => setBulkError(null)}
              />
            )}

            {/* Results panel */}
            {bulkResult && (
              <div className={styles.results}>
                <div className={styles.resultStats}>
                  <div className={styles.resultStat}>
                    <span
                      className={
                        styles.resultStatNum + " " + styles.statSuccess
                      }
                    >
                      {bulkResult.success_count}
                    </span>
                    <span className={styles.resultStatLabel}>Imported</span>
                  </div>
                  <div className={styles.resultDivider} />
                  <div className={styles.resultStat}>
                    <span
                      className={`${styles.resultStatNum} ${bulkResult.error_count > 0 ? styles.statError : styles.statSuccess}`}
                    >
                      {bulkResult.error_count}
                    </span>
                    <span className={styles.resultStatLabel}>Failed</span>
                  </div>
                </div>

                {bulkResult.errors.length > 0 && (
                  <div className={styles.errorRows}>
                    <p className={styles.errorRowsTitle}>Row errors:</p>
                    <div className={styles.errorList}>
                      {bulkResult.errors.map((e: BulkUploadError) => (
                        <div key={e.row} className={styles.errorRow}>
                          <span className={styles.errorRowNum}>
                            Row {e.row}
                          </span>
                          <span className={styles.errorRowMsg}>{e.error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className={styles.uploadAgainBtn}
                  onClick={() => {
                    setBulkResult(null);
                    setCsvFile(null);
                  }}
                >
                  Upload another file
                </button>
              </div>
            )}

            {/* Submit */}
            {!bulkResult && (
              <div className={styles.actions}>
                <button
                  className={styles.submitBtn}
                  onClick={handleBulkSubmit}
                  disabled={bulkLoading || !csvFile}
                >
                  {bulkLoading ? (
                    <>
                      <Spinner size="sm" /> Uploading…
                    </>
                  ) : (
                    "Upload CSV"
                  )}
                </button>
                <button className={styles.cancelBtn} onClick={onClose}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProductModal;
