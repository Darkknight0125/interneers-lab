# Product & Category API

This document describes all available APIs, including Products, Categories, relationships, filtering, and bulk operations.

---

# Product Object Structure

| Field              | Type     | Required | Description                                      |
| ------------------ | -------- | -------- | ------------------------------------------------ |
| id                 | string   | Yes      | MongoDB ObjectId                                 |
| name               | string   | Yes      | Product name (≤ 200 chars)                       |
| brand              | string   | Yes      | Brand name (non-empty)                           |
| price              | integer  | Yes      | Product price (non-negative)                     |
| description        | string   | Yes      | Product description                              |
| inventory_quantity | integer  | Yes      | Quantity available (non-negative)                |
| category           | object   | No       | Category object (`id`, `title`) or `null`        |
| created_at         | datetime | Yes      | Creation timestamp                               |
| updated_at         | datetime | Yes      | Last updated timestamp                           |

---

# Category Object Structure

| Field      | Type     | Description              |
|------------|----------|--------------------------|
| id         | string   | MongoDB ObjectId         |
| title      | string   | Category title           |
| description| string   | Category description     |
| created_at | datetime | Creation timestamp       |
| updated_at | datetime | Last updated timestamp   |

---

# PRODUCT APIs

## 1. Create Product
POST /product/create/

### Request Body
```json
{
  "name": "Laptop",
  "brand": "Dell",
  "price": 90000,
  "description": "Gaming laptop",
  "inventory_quantity": 10,
  "category_id": "optional"
}
```

### Success (201)
```json
{ "product": { ... } }
```

### Errors
- 400 Invalid JSON
- 400 Missing fields
- 400 Validation failure
- 400 Invalid category_id

---

## 2. Get Product
GET /product/get/<p_id>

### Success (200)
```json
{ "product": { ... } }
```

### Errors
- 400 Invalid ID format
- 404 Product not found

---

## 3. List Products
GET /product/list/?offset=0&length=10

### Errors
- 400 Invalid offset
- 400 Invalid length

---

## 4. Update Product
PUT /product/update/<p_id>

### Request Body (Partial)
```json
{
  "price": 85000
}
```

### Errors
- 400 Invalid JSON
- 400 Invalid field
- 400 Validation failure
- 400 Invalid product id

---

## 5. Delete Product
DELETE /product/delete/<p_id>

### Errors
- 400 Invalid product id

---

## 6. Assign Category
POST /product/assign-category/<p_id>/

### Request Body
```json
{
  "category_id": "cat123"
}
```

### Errors
- 400 Missing category_id
- 400 Invalid ID format
- 400 Category not found
- 400 Product not found

---

## 7. Remove Category
DELETE /product/remove-category/<p_id>/

### Errors
- 400 Invalid product id

---

## 8. Get Products by Category
GET /product/category/<c_id>/

### Errors
- 400 Invalid category id

---

## 9. Filter Products
GET /product/filter/

### Query Params
min_price, max_price, brand, category_ids, in_stock, search, sort_by, order

### Errors
- 400 Invalid query params

---

## 10. Bulk Upload
POST /product/bulk-upload/

### Form Data
file: CSV

### Errors
- 400 Missing file
- 400 Invalid CSV

---

# CATEGORY APIs

## 11. Create Category
POST /category/create/

### Request Body
```json
{
  "title": "Electronics",
  "description": "Devices"
}
```

### Errors
- 400 Invalid title
- 400 Validation failure

---

## 12. List Categories
GET /category/list/

---

## 13. Get Category
GET /category/get/<c_id>/

### Errors
- 404 Category not found

---

## 14. Update Category
PUT /category/update/<c_id>/

### Request Body
```json
{
  "title": "New Title"
}
```

### Errors
- 400 Validation failure
- 400 Invalid category id

---

## 15. Delete Category
DELETE /category/delete/<c_id>/

### Errors
- 400 Invalid category id

---

# Common Errors

- 400 Invalid JSON
- 400 Validation failure
- 400 Invalid ID format
- 404 Resource not found
- 405 Method not allowed

---

# Notes

- IDs are MongoDB ObjectIds
- Category is optional
- Bulk upload validates row-wise
