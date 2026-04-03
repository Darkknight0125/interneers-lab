from product.domain.ports.product_repository import ProductRepository
from product.infrastructure.models.mongo.product_model import ProductModel
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId


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

        doc = ProductModel(
            name=product.name,
            brand=product.brand,
            price=product.price,
            description=product.description,
            category=product.category,
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

        doc.name = product.name
        doc.brand = product.brand
        doc.price = product.price
        doc.description = product.description
        doc.category = product.category
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