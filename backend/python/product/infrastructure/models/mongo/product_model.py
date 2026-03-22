import mongoengine as me
from datetime import datetime


class ProductModel(me.Document):

    name = me.StringField(required=True, max_length=200)
    brand = me.StringField(required=True, max_length=200)
    price = me.IntField(required=True)
    description = me.StringField(required=True)
    category = me.StringField(required=True)
    inventory_quantity = me.IntField(required=True)

    created_at = me.DateTimeField(default=datetime.now())
    updated_at = me.DateTimeField(default=datetime.now())

    meta = {
        "collection": "products"
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "brand": self.brand,
            "price": self.price,
            "description": self.description,
            "category": self.category,
            "inventory_quantity": self.inventory_quantity,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }