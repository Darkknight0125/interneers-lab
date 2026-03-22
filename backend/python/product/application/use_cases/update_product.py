from product.domain.entities.product import Product

def update_product(repo, p_id, changes):
    '''
    This function expects the id of the product and the changes, as a dictionary, with attribute name as key and update as value.
    It creates a new product object with updated details, to enforce domain level validation on new changes.
    '''
    existing_product = repo.get(p_id)

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

    return repo.edit(p_id, updated_product)
