from django.urls import path
from product.adapters.http.views import product_category_views

urlpatterns = [
    path("create/", product_category_views.create_category_view),
    path("list/", product_category_views.list_categories_view),
    path("get/<str:c_id>/", product_category_views.get_category_view),
    path("update/<str:c_id>/", product_category_views.update_category_view),
    path("delete/<str:c_id>/", product_category_views.delete_category_view),
]