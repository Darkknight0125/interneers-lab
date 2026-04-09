from product.domain.entities.product_category import ProductCategory


class ProductCategoryService:

    def __init__(self, repo, product_service):
        self.repo = repo
        self.product_service = product_service

    def create_category(self, details):
        '''
        This function expects a dictionary with all the category details and creates a 
        ProductCategory entity and saves it. 
        '''

        title = details["title"]

        # Check if category already exists
        existing_category = self.repo.find_by_title(title)
        if existing_category:
            raise ValueError(f"Category with title '{title}' already exists")
        
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

        # Check uniqueness of title, if being changed
        if "title" in changes:
            category_with_same_title = self.repo.find_by_title(updated_title)

            # Ensure it's not the same category
            if category_with_same_title and category_with_same_title != existing:
                raise ValueError(f"Category with title '{updated_title}' already exists")

        category = ProductCategory(
            updated_title,
            updated_description
        )

        return self.repo.edit(category_id, category)

    def delete_category(self, category_id):
        """
        This function expects a category_id and deletes the corresponding object.
        """
        products = self.product_service.get_products_by_category(category_id)

        for product in products:
            self.product_service.remove_category_from_product(str(product.id))

        # Delete the category
        return self.repo.delete(category_id)