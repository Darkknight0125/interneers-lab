class Product:
    '''
    This is the product entity, with various attributes.
    '''
    def __init__(self, name, brand, price, description, inventory_quantity, category_id=None, p_id=None):

        if not isinstance(name, str) or len(name) > 200:
            raise ValueError('Invalid name attribute')
        
        if not isinstance(brand, str) or len(brand) > 200:
            raise ValueError('Invalid brand attribute')
        
        if not isinstance(price, int) or price < 0:
            raise ValueError('Invalid price attribute')
        
        if not isinstance(description, str) or len(description) > 2000:
            raise ValueError('Invalid description attribute')
        
        if not isinstance(inventory_quantity, int) or inventory_quantity < 0:
            raise ValueError('Invalid inventory_quantity attribute')
        
        self.p_id = p_id
        self.name = name
        self.brand = brand
        self.price = price
        self.description = description
        self.category_id = category_id
        self.inventory_quantity = inventory_quantity

    def to_dict(self):
        return {
            "id": self.p_id,
            "name": self.name,
            "brand": self.brand,
            "price": self.price,
            "description": self.description,
            "category_id": self.category_id,
            "inventory_quantity": self.inventory_quantity,
        }