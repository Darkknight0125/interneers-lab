class ProductCategory:
    '''
    This is the product category entity, with various attributes.
    '''

    def __init__(self, title, description):

        if not isinstance(title, str) or not title.strip():
            raise ValueError("Invalid category title")

        if not isinstance(description, str):
            raise ValueError("Invalid category description")

        self.title = title.strip()
        self.description = description.strip()

    def to_dict(self):
        return {
            "title": self.title,
            "description": self.description,
        }