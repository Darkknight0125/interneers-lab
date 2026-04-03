import scripts.bootstrap
from product.infrastructure.models.mongo.product_model import ProductModel
from product.infrastructure.models.mongo.product_category_model import ProductCategoryModel
from bson.dbref import DBRef


def migrate():

    products = ProductModel.objects()
    created_categories = {}

    for product in products:

        raw_category = product._data.get("category")

        # Already migrated, or category is None
        if isinstance(raw_category, ProductCategoryModel):
            continue

        if raw_category is None:
            continue

        if isinstance(raw_category, DBRef):
            old_category = str(raw_category.id)
        else:
            old_category = str(raw_category).strip()
        key = old_category.lower()

        # Reuse category if already created
        if key in created_categories:
            category_doc = created_categories[key]
        else:
            category_doc = ProductCategoryModel.objects(
                title__iexact=old_category
            ).first()

            if not category_doc:
                category_doc = ProductCategoryModel(
                    title=old_category,
                    description="Migrated category"
                )
                category_doc.save()

            created_categories[key] = category_doc

        product.category = category_doc
        product.save()

    print("Migration completed.")


if __name__ == "__main__":
    migrate()