from product.domain.ports.product_repository import ProductRepository
from product.infrastructure.models.mongo.product_model import ProductModel
from product.infrastructure.models.mongo.product_category_model import ProductCategoryModel
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from mongoengine.queryset.visitor import Q


class MongoProductRepository(ProductRepository):
    """
    MongoDB repository implementation based on ProductRepository interface.
    """

    def _validate_object_id(self, product_id):
        """Validate and convert string to ObjectId."""
        try:
            return ObjectId(product_id)
        except (InvalidId, TypeError):
            raise TypeError("Invalid product id format")

    def save(self, product):

        category_doc = None

        if product.category_id:
            cat_id = self._validate_object_id(product.category_id)
            category_doc = ProductCategoryModel.objects(id=cat_id).first()

            if not category_doc:
                raise ValueError("Category not found")

        doc = ProductModel(
            name=product.name,
            brand=product.brand,
            price=product.price,
            description=product.description,
            category=category_doc,
            inventory_quantity=product.inventory_quantity
        )

        doc.save()
        return doc

    def get(self, product_id):

        obj_id = self._validate_object_id(product_id)
        doc = ProductModel.objects(id=obj_id).first()

        if not doc:
            return None

        return doc

    def list_all(self):
        return list(ProductModel.objects())

    def list_paginated(self, offset, length):

        if not isinstance(offset, int):
            raise TypeError("Offset must be an integer")

        if length is not None:
            if not isinstance(length, int):
                raise TypeError("Length must be an integer")
            if length <= 0:
                raise ValueError("Length must be positive")

        total_products = ProductModel.objects.count()
        if offset < 0:
            offset += total_products

        if offset >= total_products or offset < 0:
            raise ValueError("Invalid offset amount")

        if length is not None:
            return list(ProductModel.objects.skip(offset).limit(length))
        else:
            return list(ProductModel.objects.skip(offset))

    def edit(self, product_id, product):

        obj_id = self._validate_object_id(product_id)
        doc = ProductModel.objects(id=obj_id).first()

        if not doc:
            raise ValueError("Product not found")
        
        category_doc = None

        if product.category_id:
            cat_id = self._validate_object_id(product.category_id)
            category_doc = ProductCategoryModel.objects(id=cat_id).first()

            if not category_doc:
                raise ValueError("Category not found")

        doc.name = product.name
        doc.brand = product.brand
        doc.price = product.price
        doc.description = product.description
        doc.category = category_doc
        doc.inventory_quantity = product.inventory_quantity
        doc.updated_at = datetime.now()

        doc.save()
        return doc

    def delete(self, product_id):

        obj_id = self._validate_object_id(product_id)
        doc = ProductModel.objects(id=obj_id).first()

        if not doc:
            raise ValueError("Product not found")

        doc.delete()
        return True
    
    def assign_category(self, product_id, category_id):

        p_id = self._validate_object_id(product_id)
        c_id = self._validate_object_id(category_id)

        product = ProductModel.objects(id=p_id).first()
        if not product:
            raise ValueError("Product not found")

        category = ProductCategoryModel.objects(id=c_id).first()
        if not category:
            raise ValueError("Category not found")

        product.category = category
        product.updated_at = datetime.now()
        product.save()

        return product
    
    def remove_category(self, product_id):

        p_id = self._validate_object_id(product_id)

        product = ProductModel.objects(id=p_id).first()
        if not product:
            raise ValueError("Product not found")
        
        if product.category is None:
            raise ValueError("Product already does not have a category")

        product.category = None
        product.updated_at = datetime.now()
        product.save()

        return product
    
    def get_by_category(self, category_id):

        c_id = self._validate_object_id(category_id)
        return list(ProductModel.objects(category=c_id))

    def filter_products(self, filters):

        query = ProductModel.objects

        if "min_price" in filters:
            query = query.filter(price__gte=filters["min_price"])

        if "max_price" in filters:
            query = query.filter(price__lte=filters["max_price"])

        if "brand" in filters:
            query = query.filter(brand=filters["brand"])

        if "category_ids" in filters:
            category_ids = [
                self._validate_object_id(cid)
                for cid in filters["category_ids"]
            ]
            query = query.filter(category__in=category_ids)

        if "in_stock" in filters:
            if filters["in_stock"]:
                query = query.filter(inventory_quantity__gt=0)
            else:
                query = query.filter(inventory_quantity=0)

        if "search" in filters:
            search = filters["search"]
            query = query.filter(
                Q(name__icontains=search) | Q(brand__icontains=search)
            )

        if "sort_by" in filters:
            order = filters.get("order", "asc")
            field = filters["sort_by"]

            if order == "desc":
                field = f"-{field}"

            query = query.order_by(field)

        return list(query)