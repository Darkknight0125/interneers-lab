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
            details['name'],
            details['brand'],
            details['price'],
            details['description'],
            details['category'],
            details['inventory_quantity'],
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
            'category': changes.get('category', existing_product.category),
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
            category=updated_data['category'],
            inventory_quantity=updated_data['inventory_quantity'],
            p_id=p_id
        )

        return self.repo.edit(p_id, updated_product)