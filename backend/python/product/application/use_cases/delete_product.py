def delete_product(repo, p_id):
    '''
    This function expects a product id and deletes it. 
    '''
    return repo.delete(p_id)