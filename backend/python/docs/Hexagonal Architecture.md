# Architecture Overview - Hexagonal Architecture

This project follows **Hexagonal Architecture (Ports and Adapters)** to
separate business logic from frameworks and infrastructure.

The main goal of this architecture is to ensure that the **core business
logic remains independent** from external systems such as HTTP
frameworks, databases, or third-party services.

This allows components like storage or APIs to be replaced without
affecting the core logic.

------------------------------------------------------------------------

# Why Hexagonal Architecture?

Traditional layered architectures often tightly couple business logic
with frameworks like Django or with database models.

Hexagonal architecture solves this by enforcing a **clear dependency
direction**:

External Systems → Adapters → Application → Domain

The **Domain layer stays at the center** and has no dependencies on
frameworks or infrastructure.

Benefits include:

-   Framework independence
-   Easy replacement of storage layers
-   Improved testability
-   Clear separation of responsibilities
-   Maintainable codebase as complexity grows

------------------------------------------------------------------------

# Layer Overview

The application is divided into the following layers:

    product/
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── adapters/

Each layer has a clearly defined responsibility.

------------------------------------------------------------------------

# 1. Domain Layer

## Purpose

The **Domain layer represents the core business logic** of the
application.

It defines:

-   Business entities
-   Business rules
-   Repository contracts (ports)

This layer must remain **completely independent of frameworks**.

It does not know anything about:

-   Django
-   HTTP
-   Databases
-   JSON

------------------------------------------------------------------------

## Contents

    domain/
    ├── entities/
    │   └── product.py
    └── ports/
        └── product_repository.py

### Entities

Entities represent real business objects.

Example:

    Product

The entity contains:

-   Product attributes
-   Domain validation rules

Entities guarantee that **invalid business objects cannot exist**.

------------------------------------------------------------------------

### Ports

Ports define **interfaces that the domain expects external systems to
implement**.

Example:

    ProductRepository

The repository port defines methods such as:

-   save
-   get
-   list_all
-   list_paginated
-   edit
-   delete

Ports only define contracts --- they do not implement behavior.

------------------------------------------------------------------------

# 2. Application Layer

## Purpose

The Application layer contains **Use Cases**.

Use cases describe **how the system behaves in response to user
actions**.

Examples:

-   Create product
-   Get product
-   List products
-   Update product
-   Delete product

------------------------------------------------------------------------

## Responsibilities

Use cases perform:

-   Application orchestration
-   Entity creation
-   Merging update data
-   Calling repository methods

They **do not handle**:

-   HTTP requests
-   JSON parsing
-   Database queries

------------------------------------------------------------------------

## Structure

    application/
    └── use_cases/
        ├── create_product.py
        ├── get_product.py
        ├── list_products.py
        ├── update_product.py
        └── delete_product.py

Each file contains a single use case function.

------------------------------------------------------------------------

# 3. Infrastructure Layer

## Purpose

The Infrastructure layer provides **concrete implementations of domain
ports**.

It contains code that interacts with external systems such as:

-   Databases
-   File systems
-   APIs

------------------------------------------------------------------------

## Structure

    infrastructure/
    └── repositories/
        └── in_memory/
            └── product_repository.py

------------------------------------------------------------------------

## Responsibilities

The repository implementation is responsible for:

-   Storing entities
-   Retrieving entities
-   Pagination logic
-   Assigning product IDs

Infrastructure **must not implement business logic**.

------------------------------------------------------------------------

# 4. Adapters Layer

## Purpose

Adapters connect external systems with the application.

Examples:

-   HTTP APIs
-   CLI interfaces
-   Message queues

In this project, adapters handle **HTTP requests using Django**.

------------------------------------------------------------------------

## Structure

    adapters/
    └── http/
        ├── views.py
        ├── urls.py
        └── validators.py

------------------------------------------------------------------------

## Views

Views act as the **HTTP entry points**.

Responsibilities:

-   Receive HTTP requests
-   Parse JSON payloads
-   Call validators
-   Invoke use cases
-   Format HTTP responses

Views contain **no business logic**.

------------------------------------------------------------------------

## Validators

Validators perform **API-level validation**.

They ensure:

-   Required fields exist
-   Payload structure is correct
-   Field types are valid

They do **not enforce domain rules**, which remain inside entities.

------------------------------------------------------------------------

# Request Workflow

Client Request\
↓\
Django URL Router\
↓\
HTTP View (Adapter)\
↓\
Request Validator\
↓\
Application Use Case\
↓\
Domain Entity\
↓\
Repository Port\
↓\
Infrastructure Repository\
↓\
Response returned to client

------------------------------------------------------------------------

product)`.
7.  Infrastructure repository stores product in memory.
8.  Response is returned to the client.

------------------------------------------------------------------------

# Summary

Hexagonal Architecture ensures:

-   Domain logic is independent of frameworks
-   Infrastructure can be swapped easily
-   Application behavior remains stable
-   Code is modular and maintainable

Business rules remain at the center of the system, while external
systems act as replaceable adapters.