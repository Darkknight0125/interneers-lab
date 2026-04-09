from django.urls import path
from product.adapters.http.views import product_views

urlpatterns = [
    path('create/', product_views.create_product_view),
    path('list/', product_views.list_products_view),
    path('get/<str:p_id>/', product_views.get_product_view),
    path('update/<str:p_id>/', product_views.update_product_view),
    path('delete/<str:p_id>/', product_views.delete_product_view),
    path("assign-category/<str:p_id>/", product_views.assign_category_view),
    path("remove-category/<str:p_id>/", product_views.remove_category_view),
    path("category/<str:c_id>/", product_views.products_by_category_view),
    path("filter/", product_views.filter_products_view),
    path("bulk-upload/", product_views.bulk_upload_products_view)
]