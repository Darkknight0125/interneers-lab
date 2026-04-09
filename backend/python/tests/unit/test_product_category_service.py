import pytest
from unittest.mock import MagicMock

from product.application.services.product_category_service import ProductCategoryService


def test_create_category_success():

    mock_repo = MagicMock()
    product_service = MagicMock()

    category_service = ProductCategoryService(mock_repo, product_service)

    payload = {
        "title": "ABC",
        "description": "DEF"
    }

    mock_repo.find_by_title.return_value = None
    mock_repo.save.return_value = "saved_category"

    result = category_service.create_category(payload)

    assert result == "saved_category"
    mock_repo.save.assert_called_once()


@pytest.mark.parametrize(
    "payload",
    [
        {"title": "", "description": "Devices"},
        {"title": "   ", "description": "Devices"},
        {"title": None, "description": "Devices"},
        {"title": "Electrical", "description": -1},
        {"title": 100, "description": "Devices"},
    ]
)
def test_create_category_invalid(payload):

    mock_repo = MagicMock()
    product_service = MagicMock()
    service = ProductCategoryService(mock_repo, product_service)

    with pytest.raises(ValueError):
        service.create_category(payload)


def test_update_category():

    mock_repo = MagicMock()
    product_service = MagicMock()
    service = ProductCategoryService(mock_repo, product_service)

    existing = MagicMock()
    existing.title = "Old"
    existing.description = "Old desc"

    mock_repo.get.return_value = existing
    mock_repo.find_by_title.return_value = None
    mock_repo.edit.return_value = "updated"

    result = service.update_category("id", {"title": "New"})

    assert result == "updated"

@pytest.mark.parametrize(
    "changes",
    [
        {"title": "", "description": "Devices"},
        {"title": "   ", "description": "Devices"},
        {"title": None, "description": "Devices"},
        {"title": "Electrical", "description": -1},
        {"title": 100, "description": "Devices"},
    ]
)
def test_update_category_invalid(changes):

    mock_repo = MagicMock()
    product_service = MagicMock()
    service = ProductCategoryService(mock_repo, product_service)

    existing = MagicMock()
    existing.title = "Old"
    existing.description = "Old desc"

    mock_repo.get.return_value = existing

    with pytest.raises(ValueError):
        service.update_category("id", changes)


def test_delete_category():

    mock_category_repo = MagicMock()
    mock_product_service = MagicMock()
    
    category_service = ProductCategoryService(mock_category_repo, mock_product_service)
    
    # Setup return values
    product1 = MagicMock()
    product1.id = "prod1"
    product2 = MagicMock()
    product2.id = "prod2"

    mock_product_service.get_products_by_category.return_value = [product1, product2]
    mock_category_repo.delete.return_value = True

    result = category_service.delete_category("id")

    assert result is True
    mock_category_repo.delete.assert_called_once_with("id")
    
    # Ensure remove_category_from_product is called for each product
    mock_product_service.remove_category_from_product.assert_any_call("prod1")
    mock_product_service.remove_category_from_product.assert_any_call("prod2")
    assert mock_product_service.remove_category_from_product.call_count == 2