import json

from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt

from product.infrastructure.repositories.in_memory.product_repository import (
    InfrastructureRepository,
)

from product.adapters.http.validators import validate_create_payload

from product.application.use_cases.create_product import create_product
from product.application.use_cases.get_product import get_product
from product.application.use_cases.list_products import list_products
from product.application.use_cases.update_product import update_product
from product.application.use_cases.delete_product import delete_product

# in-memory repo instance
repo = InfrastructureRepository()


@csrf_exempt
def create_product_view(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        payload = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    try:
        validate_create_payload(payload)
        product = create_product(repo, payload)
        return JsonResponse({'product': product.to_dict()}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def get_product_view(request, p_id):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    product = get_product(repo, p_id)

    if product is None:
        return JsonResponse({"error": "Not found"}, status=404)

    return JsonResponse({'product': product.to_dict()}, status=200)


@csrf_exempt
def list_products_view(request):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    page_no = request.GET.get("page_no")
    page_size = request.GET.get("page_size")

    try:
        if page_no is not None:
            page_no = int(page_no)
            page_size = int(page_size) if page_size else 10
            products = list_products(repo, page_no, page_size)
        else:
            products = list_products(repo)

        data = [product.to_dict() for product in products]

        return JsonResponse(data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def update_product_view(request, p_id):
    if request.method != "PUT":
        return HttpResponseNotAllowed(["PUT"])

    try:
        payload = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    try:
        product = update_product(repo, p_id, payload)
        return JsonResponse({'product': product.to_dict()}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def delete_product_view(request, p_id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        delete_product(repo, p_id)
        return JsonResponse({"message": "Deleted successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)