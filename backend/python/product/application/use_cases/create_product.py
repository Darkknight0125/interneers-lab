from product.domain.entities.product import Product

def create_product(repo, details):
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
    
    return repo.save(product)

