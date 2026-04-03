import scripts.bootstrap
from product.infrastructure.models.mongo.product_category_model import ProductCategoryModel

def seed_categories():

    categories = [
        {"title": "Food", "description": "Food items"},
        {"title": "Electronics", "description": "Electronic items"},
        {"title": "Clothing", "description": "Apparel"},
        {"title": "Kitchen", "description": "Kitchen essentials"},
    ]

    created = 0

    for cat in categories:
        if not ProductCategoryModel.objects(title=cat["title"]).first():
            ProductCategoryModel(**cat).save()
            created += 1

    print(f"Seed completed. Created {created} categories.")


if __name__ == "__main__":
    seed_categories()