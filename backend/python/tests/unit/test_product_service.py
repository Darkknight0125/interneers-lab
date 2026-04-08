import pytest
from unittest.mock import MagicMock

from product.application.services.product_service import ProductService


def test_create_product_success():

    mock_repo = MagicMock()

    service = ProductService(mock_repo)

    payload = {
        "name": "Laptop",
        "brand": "Dell",
        "price": 90000,
        "description": "Gaming",
        "inventory_quantity": 10,
        "category_id": None
    }

    mock_repo.save.return_value = "saved_product"

    result = service.create_product(payload)

    assert result == "saved_product"
    mock_repo.save.assert_called_once()


@pytest.mark.parametrize(
    "payload",
    [
        # invalid brand
        {
            "name": "Laptop",
            "brand": "",
            "price": 90000,
            "description": "Gaming",
            "inventory_quantity": 10
        },
        # invalid price
        {
            "name": "Laptop",
            "brand": "Dell",
            "price": -10,
            "description": "Gaming",
            "inventory_quantity": 10
        },
        # invalid inventory
        {
            "name": "Laptop",
            "brand": "Dell",
            "price": 100,
            "description": "Gaming",
            "inventory_quantity": -1
        },
    ]
)
def test_create_product_invalid(payload):

    mock_repo = MagicMock()
    service = ProductService(mock_repo)

    with pytest.raises(ValueError):
        service.create_product(payload)


def test_update_product_success():

    mock_repo = MagicMock()
    service = ProductService(mock_repo)

    existing = MagicMock()
    existing.name = "Old"
    existing.brand = "Dell"
    existing.price = 100
    existing.description = "desc"
    existing.inventory_quantity = 5
    existing.category = None

    mock_repo.get.return_value = existing
    mock_repo.edit.return_value = "updated_product"

    changes = {"name": "New"}

    result = service.update_product("id", changes)

    assert result == "updated_product"
    mock_repo.edit.assert_called_once()


@pytest.mark.parametrize(
    "changes",
    [
        # invalid brand
        {
            "brand": "",
            "price": 90000,
        },
        # invalid price
        {
            "price": -10,
            "description": "Gaming",
        },
        # invalid inventory
        {
            "inventory_quantity": -1
        },
    ]
)
def test_update_product_invalid(changes):

    mock_repo = MagicMock()
    service = ProductService(mock_repo)

    existing = MagicMock()
    existing.name = "Old"
    existing.brand = "Dell"
    existing.price = 100
    existing.description = "desc"
    existing.inventory_quantity = 5
    existing.category = None

    mock_repo.get.return_value = existing

    with pytest.raises(ValueError):
        service.update_product("id", changes)


def test_assign_product_to_category():

    mock_repo = MagicMock()
    service = ProductService(mock_repo)

    mock_repo.assign_category.return_value = "updated"

    result = service.assign_product_to_category("p1", "c1")

    assert result == "updated"
    mock_repo.assign_category.assert_called_once_with("p1", "c1")