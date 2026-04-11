// CONFIG
const API_BASE = "http://127.0.0.1:8000";

// STATE
let allProducts = [];

// DOM REFERENCES
const productGrid = document.getElementById("product-grid");
const skeletonGrid = document.getElementById("skeleton-grid");
const errorState = document.getElementById("error-state");
const emptyState = document.getElementById("empty-state");
const productCount = document.getElementById("product-count");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const retryBtn = document.getElementById("retry-btn");
const modalOverlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");
const toast = document.getElementById("toast");
const chips = document.querySelectorAll(".chip");

/**
 * Fetches all products from the backend API.
 * Filters set in parameters by checking the values of search/sort/in stock fields.
 */
async function fetchProducts() {
  showSkeleton();

  const query = searchInput.value.trim();
  const activeChip =
    document.querySelector(".chip.active")?.dataset.filter || "all";
  const sortVal = sortSelect.value;

  // Build query params
  const params = new URLSearchParams();

  // Search
  if (query) params.append("search", query);

  // Stock filter
  if (activeChip === "in_stock") params.append("in_stock", "true");
  if (activeChip === "out_of_stock") params.append("in_stock", "false");

  // Sorting
  if (sortVal === "price_asc") {
    params.append("sort_by", "price");
    params.append("order", "asc");
  }
  if (sortVal === "price_desc") {
    params.append("sort_by", "price");
    params.append("order", "desc");
  }
  if (sortVal === "name") {
    params.append("sort_by", "name");
    params.append("order", "asc");
  }

  const url = `${API_BASE}/product/filter/?${params.toString()}`;

  console.group("📡 API FILTER CALL");
  console.log("URL:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    console.log("Filtered response:", data);
    console.groupEnd();

    const products = data.products || data;

    renderProducts(products);
    updateCount(products.length);

    showToast(`Loaded ${products.length} products`);
  } catch (err) {
    console.error("Fetch failed:", err);
    console.groupEnd();
    showError();
    showToast(err.message, true);
  }
}

/**
 * Renders the current `filtered` array as product cards into the DOM.
 * This is the core dynamic rendering.
 */
function renderProducts(products) {
  // Clear existing cards
  productGrid.innerHTML = "";

  if (products.length === 0) {
    hideSkeleton();
    showEmpty();
    updateCount(0);
    return;
  }

  // Build a card for each product and append to the grid
  products.forEach((product, index) => {
    const card = createProductCard(product, index);
    productGrid.appendChild(card);
  });

  hideSkeleton();
  hideEmpty();
  productGrid.classList.remove("hidden");
  updateCount(products.length);

  console.log(`Rendered ${products.length} cards into #product-grid`);
}

/**
 * Builds and returns a single product card <div> element.
 * This is pure DOM manipulation.
 */
function createProductCard(product, index) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.setAttribute("data-id", product.id);
  card.style.animationDelay = `${Math.min(index * 0.03, 0.35)}s`;

  // Category tag
  const categoryHTML = product.category
    ? `<span class="card-category">${escapeHTML(product.category.title)}</span>`
    : `<span class="card-no-category">No category</span>`;

  // Stock badge
  const inStock = product.inventory_quantity > 0;
  const badgeClass = inStock ? "in-stock" : "out-of-stock";
  const badgeText = inStock ? "In Stock" : "Out of Stock";

  // Price formatting
  const priceFormatted = formatPrice(product.price);

  card.innerHTML = `
    <div class="card-header">
      <div class="card-brand">${escapeHTML(product.brand)}</div>
      <div class="card-name">${escapeHTML(product.name)}</div>
    </div>
    <div class="card-body">
      <p class="card-description">${escapeHTML(product.description)}</p>
      ${categoryHTML}
      <div class="card-inventory">
        QTY&nbsp;<span>${product.inventory_quantity}</span>
      </div>
    </div>
    <div class="card-footer">
      <div class="card-price">
        <span class="card-price-currency">₹</span>${priceFormatted}
      </div>
      <span class="stock-badge ${badgeClass}">${badgeText}</span>
    </div>
  `;

  // Click -> open detail modal
  card.addEventListener("click", () => openModal(product));

  return card;
}

// MODAL
function openModal(product) {
  const inStock = product.inventory_quantity > 0;
  const badgeClass = inStock ? "in-stock" : "out-of-stock";
  const badgeText = inStock ? "In Stock" : "Out of Stock";
  const priceFormatted = formatPrice(product.price);
  const categoryText = product.category
    ? product.category.title
    : "Uncategorized";

  modalBody.innerHTML = `
    <div class="modal-brand">${escapeHTML(product.brand)}</div>
    <div class="modal-name">${escapeHTML(product.name)}</div>
    <div class="modal-price">₹${priceFormatted}</div>
    <hr class="modal-divider" />
    <div class="modal-row">
      <span class="modal-label">Category</span>
      <span class="modal-value">${escapeHTML(categoryText)}</span>
    </div>
    <div class="modal-row">
      <span class="modal-label">Inventory</span>
      <span class="modal-value">${product.inventory_quantity} units</span>
    </div>
    <div class="modal-row">
      <span class="modal-label">Stock Status</span>
      <span class="modal-value">
        <span class="stock-badge ${badgeClass}">${badgeText}</span>
      </span>
    </div>
    <div class="modal-row">
      <span class="modal-label">Product ID</span>
      <span class="modal-value" style="font-size:10px;color:var(--text-muted)">${product.id}</span>
    </div>
    <hr class="modal-divider" />
    <p class="modal-description">${escapeHTML(product.description)}</p>
  `;

  modalOverlay.classList.remove("hidden");
  console.log("Product detail opened:", product);
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

// TOAST
let toastTimer = null;

function showToast(message, isError = false) {
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = isError ? "toast error" : "toast";
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 3000);
}

// UI STATE HELPERS

function showSkeleton() {
  skeletonGrid.classList.remove("hidden");
  productGrid.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.add("hidden");
}

function hideSkeleton() {
  skeletonGrid.classList.add("hidden");
}

function showError() {
  hideSkeleton();
  productGrid.classList.add("hidden");
  errorState.classList.remove("hidden");
  emptyState.classList.add("hidden");
  updateCount(0);
}

function showEmpty() {
  emptyState.classList.remove("hidden");
}

function hideEmpty() {
  emptyState.classList.add("hidden");
}

function updateCount(n) {
  productCount.textContent = n;
}

// UTILITY HELPERS

/** Format a number as price string: 90000 → "90,000" */
function formatPrice(price) {
  return price.toLocaleString("en-IN");
}

/**
 * Escape user/API data before injecting into innerHTML.
 * Prevents XSS. Always do this!
 */
function escapeHTML(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// EVENT LISTENERS

// Search - debounced so we don't re-filter on every keystroke
let searchDebounce = null;
searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(fetchProducts, 300);
});

// Sort
sortSelect.addEventListener("change", fetchProducts);

// Stock filter chips
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    fetchProducts();
  });
});

// Modal close - button
modalClose.addEventListener("click", closeModal);

// Modal close - clicking the dark overlay
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Modal close - Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Retry button
retryBtn.addEventListener("click", fetchProducts);

// Expose state to the browser console for exploration
window.allProducts = allProducts;

// INIT
fetchProducts();
