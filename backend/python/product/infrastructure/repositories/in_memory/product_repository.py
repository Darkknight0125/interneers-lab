from product.domain.ports.product_repository import ProductRepository

class InfrastructureRepository(ProductRepository):
    '''
    This is repository for implementing in-memory storage using ProductRepository interface.
    '''
    def __init__(self):
        #store will contain all the products, and p_id is incremental primary key
        self.store = {}
        self.p_id = 0

    def save(self, product):
        product.p_id = self.p_id
        self.store[product.p_id] = product
        self.p_id += 1
        return product

    def get(self, product_id):
        return self.store.get(product_id, None)

    def list_all(self):
        product_list = []
        for pid, product in self.store.items():
            product_list.append(product)

        return product_list

    def list_paginated(self, page_no, page_size=10):
        # Raise error if page_no is invalid or no product for that page_no
        if page_no <= 0 or (page_no - 1) * page_size >= len(self.store):
            raise ValueError('Invalid page number')

        start_index = (page_no - 1) * page_size
        end_index = start_index + page_size

        products = list(self.store.values())
        return products[start_index:end_index]

    def edit(self, product_id, product):
        #Use case will provide the edited product, we just need to update in memory
        if product_id not in self.store:
            raise ValueError('Invalid product id')
        
        self.store[product_id] = product
        return product

    def delete(self, product_id):
        if product_id not in self.store:
            raise ValueError('Invalid product id')
        
        del self.store[product_id]
        return True