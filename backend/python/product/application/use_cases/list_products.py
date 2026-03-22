def list_products(repo, page_no=None, page_size=10):
    '''
    If the page_no is not provided, then it lists all the products.
    Otherwise this function returns paginated list from repository, with page_no and 
    page_size = 10 (default in repo also) 
    '''
    if page_no is not None:
        return repo.list_paginated(page_no, page_size)
    
    return repo.list_all()
