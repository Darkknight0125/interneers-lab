import pytest
from django.test import Client

client = Client()


@pytest.mark.django_db
def test_create_category():

    response = client.post(
        "/category/create/",
        data={
            "title": "Gym",
            "description": "Gym accessories"
        },
        content_type="application/json"
    )

    assert response.status_code == 201
    assert "category" in response.json()


@pytest.mark.django_db
def test_list_categories(seed_data):

    response = client.get("/category/list/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.django_db
def test_get_category(seed_data):

    categories = client.get("/category/list/").json()
    c_id = categories[0]["id"]

    response = client.get(f"/category/get/{c_id}/")

    assert response.status_code == 200
    assert response.json()["category"]["id"] == c_id


@pytest.mark.django_db
def test_delete_category(seed_data):

    categories = client.get("/category/list/").json()
    c_id = categories[0]["id"]

    response = client.delete(f"/category/delete/{c_id}/")

    assert response.status_code == 200


