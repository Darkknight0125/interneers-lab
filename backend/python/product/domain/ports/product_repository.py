class ProductRepository:
    '''
    This is the product repository (port), which provides a contract and abstract functions to be implemented
    by the adapters/components.
    '''
    def save(self, product):
        raise NotImplementedError

    def get(self, product_id):
        raise NotImplementedError

    def list_all(self):
        raise NotImplementedError

    def list_paginated(self, offset, length=10):
        raise NotImplementedError

    def edit(self, product_id, product):
        raise NotImplementedError

    def delete(self, product_id):
        raise NotImplementedError
    
    def assign_category(self, product_id, category_id):
        raise NotImplementedError
    
    def remove_category(self, product_id):
        raise NotImplementedError
    
    def get_by_category(self, category_id):
        raise NotImplementedError

    def filter_products(self, filters):
        raise NotImplementedError