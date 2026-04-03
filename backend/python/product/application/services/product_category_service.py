from product.domain.entities.product_category import ProductCategory


class ProductCategoryService:

    def __init__(self, repo):
        self.repo = repo

    def create_category(self, details):
        '''
        This function expects a dictionary with all the category details and creates a 
        ProductCategory entity and saves it. 
        '''
        category = ProductCategory(
            details["title"],
            details.get("description", "")
        )

        return self.repo.save(category)

    def get_category(self, category_id):
        """
        This function expects a category_id and returns the corresponding category object.
        """
        return self.repo.get(category_id)

    def list_categories(self):
        """
        This function lists all saved category objects.
        """
        return self.repo.list_all()

    def update_category(self, category_id, changes):
        """
        This function expects a category_id and a dictionary of changes, creates a new
        ProductCategory object with new details, and saves it.
        """
        existing = self.repo.get(category_id)

        if not existing:
            raise ValueError("Category not found")

        updated_title = changes.get("title", existing.title)
        updated_description = changes.get("description", existing.description)

        category = ProductCategory(
            updated_title,
            updated_description
        )

        return self.repo.edit(category_id, category)

    def delete_category(self, category_id):
        """
        This function expects a category_id and deletes the corresponding object.
        """
        return self.repo.delete(category_id)