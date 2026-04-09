from product.domain.ports.product_category_repository import ProductCategoryRepository
from product.infrastructure.models.mongo.product_category_model import ProductCategoryModel
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId


class MongoProductCategoryRepository(ProductCategoryRepository):
    """
    MongoDB repository implementation based on ProductCategoryRepository interface.
    """

    def _validate_object_id(self, category_id):
        try:
            return ObjectId(category_id)
        except (InvalidId, TypeError):
            raise TypeError("Invalid category id format")

    def save(self, category):

        doc = ProductCategoryModel(
            title=category.title,
            description=category.description
        )

        doc.save()
        return doc
    
    def find_by_title(self, title):
        """
        Returns a category document if a category with given title exists, else None.
        """
        return ProductCategoryModel.objects(title=title).first()

    def get(self, category_id):

        obj_id = self._validate_object_id(category_id)
        doc = ProductCategoryModel.objects(id=obj_id).first()

        if not doc:
            return None
        
        return doc

    def list_all(self):
        return list(ProductCategoryModel.objects())

    def edit(self, category_id, category):

        obj_id = self._validate_object_id(category_id)
        doc = ProductCategoryModel.objects(id=obj_id).first()

        if not doc:
            raise ValueError("Category not found")

        doc.title = category.title
        doc.description = category.description
        doc.updated_at = datetime.now()

        doc.save()
        return doc

    def delete(self, category_id):

        obj_id = self._validate_object_id(category_id)
        doc = ProductCategoryModel.objects(id=obj_id).first()

        if not doc:
            raise ValueError("Category not found")

        doc.delete()
        return True