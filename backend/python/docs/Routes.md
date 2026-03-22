# Product API

This document describes the available Product APIs, expected request fields, responses, and possible error cases.

---

# Product Object Structure

A product contains the following fields:

| Field              | Type    | Required | Description                        |
| ------------------ | ------- | -------- | ---------------------------------- |
| name               | string  | Yes      | Product name (≤ 200 chars)         |
| brand              | string  | Yes      | Brand name (≤ 200 chars)           |
| price              | integer | Yes      | Product price (non-negative)       |
| description        | string  | Yes      | Product description (≤ 2000 chars) |
| category           | string  | Yes      | Product category (≤ 200 chars)     |
| inventory_quantity | integer | Yes      | Quantity available (non-negative)  |

---

# 1. Create Product

## Endpoint

```
POST /product/create/
```

## Request Body

```json
{
  "name": "Laptop",
  "brand": "Dell",
  "price": 90000,
  "description": "Gaming laptop",
  "category": "Electronics",
  "inventory_quantity": 10
}
```

## Success Response — 201

```json
{
  "product": {
    "id": 0,
    "name": "Laptop",
    "brand": "Dell",
    "price": 90000,
    "description": "Gaming laptop",
    "category": "Electronics",
    "inventory_quantity": 10
  }
}
```

## Possible Errors

| Status | Error                     |
| ------ | ------------------------- |
| 400    | Invalid JSON              |
| 400    | Missing fields            |
| 400    | Invalid field types       |
| 400    | Domain validation failure |

---

# 2. Get Product

## Endpoint

```
GET /get/<p_id>
```

## Success Response — 200

```json
{
  "product": {
    "id": 0,
    "name": "Laptop",
    "brand": "Dell",
    "price": 90000,
    "description": "Gaming laptop",
    "category": "Electronics",
    "inventory_quantity": 10
  }
}
```

## Possible Errors

| Status | Error     |
| ------ | --------- |
| 404    | Not found |

---

# 3. List Products

## Endpoint

```
GET /list/
```

## Optional Query Params

```
?page_no=1&page_size=10
```

If `page_no` is not provided, all products are returned.

---

## Success Response — 200

```json
[
  {
    "id": 0,
    "name": "Laptop",
    "brand": "Dell",
    "price": 90000,
    "description": "Gaming laptop",
    "category": "Electronics",
    "inventory_quantity": 10
  }
]
```

## Possible Errors

| Status | Error             |
| ------ | ----------------- |
| 400    | Invalid page_no   |
| 400    | Invalid page_size |

---

# 4. Update Product

## Endpoint

```
PUT /update/<p_id>
```

## Request Body (Partial Allowed)

```json
{
  "price": 85000,
  "inventory_quantity": 8
}
```

## Success Response — 200

```json
{
  "product": {
    "id": 0,
    "name": "Laptop",
    "brand": "Dell",
    "price": 85000,
    "description": "Gaming laptop",
    "category": "Electronics",
    "inventory_quantity": 8
  }
}
```

## Possible Errors

| Status | Error              |
| ------ | ------------------ |
| 400    | Invalid JSON       |
| 400    | Invalid field name |
| 400    | Validation failure |
| 400    | Invalid product id |

---

# 5. Delete Product

## Endpoint

```
DELETE /delete/<p_id>
```

## Success Response — 200

```json
{
  "message": "Deleted successfully"
}
```

## Possible Errors

| Status | Error              |
| ------ | ------------------ |
| 400    | Invalid product id |

---

# Method Restrictions

Each endpoint only accepts its intended HTTP method:

| Route          | Method |
| -------------- | ------ |
| /create/       | POST   |
| /get/<p_id>    | GET    |
| /list/         | GET    |
| /update/<p_id> | PUT    |
| /delete/<p_id> | DELETE |

Invalid methods return:

```
405 Method Not Allowed
```

---