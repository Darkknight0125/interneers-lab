from django.apps import AppConfig
from django.conf import settings
from product.infrastructure.db.mongo import connect_to_mongo


class ProductConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "product"

    def ready(self):
        connect_to_mongo(
            db=settings.MONGO_DB,
            host=settings.MONGO_URI
        )
