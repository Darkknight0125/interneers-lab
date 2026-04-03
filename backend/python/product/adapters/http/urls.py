from django.urls import path
from product.adapters.http import views

urlpatterns = [
    path('create/', views.create_product_view),
    path('list/', views.list_products_view),
    path('get/<str:p_id>', views.get_product_view),
    path('update/<str:p_id>', views.update_product_view),
    path('delete/<str:p_id>', views.delete_product_view),
]