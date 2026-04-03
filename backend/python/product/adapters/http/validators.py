REQUIRED_CREATE_FIELDS = {
    "name",
    "brand",
    "price",
    "description",
    "inventory_quantity",
}

def validate_create_payload(payload):
    """
    Validates request body for product creation.
    Ensures required fields exist and basic types are correct.
    Returns (is_valid, error_message).
    """

    if not isinstance(payload, dict):
        return False, "Payload must be a JSON object"

    missing = REQUIRED_CREATE_FIELDS - payload.keys()
    if missing:
        raise ValueError(f"Missing fields: {', '.join(missing)}")

    return True
