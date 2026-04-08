import pytest
from django.test import Client

client = Client()


@pytest.mark.django_db
def test_create_product(seed_data):

    categories = client.get("/category/list/").json()
    c_id = categories[0]["id"]

    response = client.post(
        "/product/create/",
        data={
            "name": "Laptop",
            "brand": "Dell",
            "price": 90000,
            "description": "Gaming",
            "inventory_quantity": 10,
            "category_id": c_id
        },
        content_type="application/json"
    )

    assert response.status_code == 201
    assert "product" in response.json()


@pytest.mark.django_db
def test_get_product(seed_data):

    products = client.get("/product/list/").json()
    p_id = products[0]["id"]

    response = client.get(f"/product/get/{p_id}/")

    assert response.status_code == 200


@pytest.mark.django_db
def test_update_product(seed_data):

    products = client.get("/product/list/").json()
    p_id = products[0]["id"]

    response = client.put(
        f"/product/update/{p_id}/",
        data={"name": "Updated"},
        content_type="application/json"
    )

    assert response.status_code == 200


@pytest.mark.django_db
def test_delete_product(seed_data):

    products = client.get("/product/list/").json()
    p_id = products[0]["id"]

    response = client.delete(f"/product/delete/{p_id}/")

    assert response.status_code == 200


@pytest.mark.django_db
def test_assign_category(seed_data):

    products = client.get("/product/list/").json()
    categories = client.get("/category/list/").json()

    p_id = products[0]["id"]
    c_id = categories[0]["id"]

    response = client.post(
        f"/product/assign-category/{p_id}/",
        data={"category_id": c_id},
        content_type="application/json"
    )

    assert response.status_code == 200


@pytest.mark.django_db
def test_remove_category(seed_data):

    products = client.get("/product/list/").json()
    p_id = products[0]["id"]

    response = client.delete(f"/product/remove-category/{p_id}/")

    assert response.status_code == 200


@pytest.mark.django_db
def test_products_by_category(seed_data):

    categories = client.get("/category/list/").json()
    c_id = categories[0]["id"]

    response = client.get(f"/product/category/{c_id}/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.django_db
def test_filter_products(seed_data):

    response = client.get(
        "/product/filter/?min_price=100&max_price=105&in_stock=true"
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)