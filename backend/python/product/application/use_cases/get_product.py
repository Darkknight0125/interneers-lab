def get_product(repo, p_id):
    '''
    This function expects a product id and gets the corresponding product entity. 
    '''
    product = repo.get(p_id)
    return product
