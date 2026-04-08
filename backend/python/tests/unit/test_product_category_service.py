import pytest
from unittest.mock import MagicMock

from product.application.services.product_category_service import ProductCategoryService


def test_create_category_success():

    mock_repo = MagicMock()
    service = ProductCategoryService(mock_repo)

    payload = {
        "title": "Electronics",
        "description": "Devices"
    }

    mock_repo.save.return_value = "saved_category"

    result = service.create_category(payload)

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
    service = ProductCategoryService(mock_repo)

    with pytest.raises(ValueError):
        service.create_category(payload)


def test_update_category():

    mock_repo = MagicMock()
    service = ProductCategoryService(mock_repo)

    existing = MagicMock()
    existing.title = "Old"
    existing.description = "Old desc"

    mock_repo.get.return_value = existing
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
    service = ProductCategoryService(mock_repo)

    existing = MagicMock()
    existing.title = "Old"
    existing.description = "Old desc"

    mock_repo.get.return_value = existing

    with pytest.raises(ValueError):
        service.update_category("id", changes)

def test_delete_category():

    mock_repo = MagicMock()
    service = ProductCategoryService(mock_repo)

    mock_repo.delete.return_value = True

    result = service.delete_category("id")

    assert result is True
    mock_repo.delete.assert_called_once_with("id")