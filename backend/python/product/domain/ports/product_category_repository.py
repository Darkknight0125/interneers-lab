class ProductCategoryRepository:
    '''
    This is the product category repository (port), which provides a contract and abstract functions to be implemented
    by the adapters/components.
    '''

    def save(self, category):
        raise NotImplementedError

    def get(self, category_id):
        raise NotImplementedError

    def list_all(self):
        raise NotImplementedError

    def edit(self, category_id, category):
        raise NotImplementedError

    def delete(self, category_id):
        raise NotImplementedError