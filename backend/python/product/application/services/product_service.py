from product.domain.entities.product import Product


class ProductService:

    def __init__(self, repo):
        self.repo = repo

    def create_product(self, details):
        '''
        This function expects a dictionary with all the product details and creates a product 
        entity and saves it. 
        '''
        product = Product(
            name=details['name'],
            brand=details['brand'],
            price=details['price'],
            description=details['description'],
            category_id=details.get('category_id'),
            inventory_quantity=details['inventory_quantity'],
        )
        
        return self.repo.save(product)

    def get_product(self, p_id):
        '''
        This function expects a product id and gets the corresponding product entity. 
        '''
        product = self.repo.get(p_id)
        return product


    def list_products(self, offset=None, length=None):
        '''
        If the offset is not provided, then it lists all the products.
        Otherwise this function returns paginated list from repository, with offset and 
        length.
        If length is None, it gives list from offset till end.
        '''
        if offset is not None:
            return self.repo.list_paginated(offset, length)
        
        return self.repo.list_all()


    def delete_product(self, p_id):
        '''
        This function expects a product id and deletes it. 
        '''
        return self.repo.delete(p_id)

    def update_product(self, p_id, changes):
        '''
        This function expects the id of the product and the changes, as a dictionary, with attribute name as key and update as value.
        It creates a new product object with updated details, to enforce domain level validation on new changes.
        Cannot edit category_id through this route as we have seperate route especially for that.
        '''
        existing_product = self.repo.get(p_id)

        if existing_product is None:
            raise ValueError("Invalid product id")

        # Merge old values with new changes
        updated_data = {
            'name': changes.get('name', existing_product.name),
            'brand': changes.get('brand', existing_product.brand),
            'price': changes.get('price', existing_product.price),
            'description': changes.get('description', existing_product.description),
            'category_id': str(existing_product.category.id) if existing_product.category else None,
            'inventory_quantity': changes.get(
                'inventory_quantity', existing_product.inventory_quantity
            ),
        }

        # Recreate entity (runs domain validation again)
        updated_product = Product(
            name=updated_data['name'],
            brand=updated_data['brand'],
            price=updated_data['price'],
            description=updated_data['description'],
            category_id=updated_data['category_id'],
            inventory_quantity=updated_data['inventory_quantity'],
            p_id=p_id
        )

        return self.repo.edit(p_id, updated_product)
    
    def assign_product_to_category(self, product_id, category_id):
        """
        This function expects the product_id and category_id and assigns the category to the product.
        """
        return self.repo.assign_category(product_id, category_id)

    def remove_product_from_category(self, product_id):
        """
        This function expects a product_id and removes the assigned category.
        If product already has no category, then it throws a ValueError.
        """
        return self.repo.remove_category(product_id)

    def get_products_by_category(self, category_id):
        """
        This function expects a category_id and lists all products belonging to that category.
        """
        return self.repo.get_by_category(category_id)

    def filter_products(self, filters):
        """
        This function expects a dictionary of filters, that may include:
        1. min_price
        2. max_price
        3. brand
        4. category_ids
        5. in_stock
        6. search
        7. sort_by

        It returns a list after applying provided filters.
        """
        return self.repo.filter_products(filters)