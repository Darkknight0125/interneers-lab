import mongoengine as me
from datetime import datetime


class ProductCategoryModel(me.Document):

    title = me.StringField(required=True, unique=True)
    description = me.StringField()

    created_at = me.DateTimeField(default=datetime.now())
    updated_at = me.DateTimeField(default=datetime.now())

    meta = {
        "collection": "product_categories"
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }