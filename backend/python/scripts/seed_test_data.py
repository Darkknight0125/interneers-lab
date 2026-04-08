from product.infrastructure.models.mongo.product_model import ProductModel
from product.infrastructure.models.mongo.product_category_model import ProductCategoryModel


def seed():

    ProductModel.objects.delete()
    ProductCategoryModel.objects.delete()

    # Create categories
    electronics = ProductCategoryModel(
        title="Electronics",
        description="Devices"
    ).save()

    food = ProductCategoryModel(
        title="Food",
        description="Edibles"
    ).save()

    clothing = ProductCategoryModel(
        title="Clothing",
        description="Wearables"
    ).save()

    # Create products
    for i in range(10):
        ProductModel(
            name=f"Product {i}",
            brand="BrandX",
            price=100 + i,
            description="Test product",
            inventory_quantity=10,
            category=electronics if i % 2 == 0 else food
        ).save()

    print("Seeded test data.")