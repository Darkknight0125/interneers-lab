import json

from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt

from product.infrastructure.repositories.mongo.product_repository import (
    MongoProductRepository,
)

from product.adapters.http.validators import validate_create_payload
from product.application.services.product_service import ProductService


# MongoDB repo instance
repo = MongoProductRepository()
service = ProductService(repo)


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
        product = service.create_product(payload)
        return JsonResponse({'product': product.to_dict()}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def get_product_view(request, p_id):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    try:
        product = service.get_product(p_id)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

    if product is None:
        return JsonResponse({"error": "Not found"}, status=404)

    return JsonResponse({'product': product.to_dict()}, status=200)


@csrf_exempt
def list_products_view(request):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    offset = request.GET.get("offset")
    length = request.GET.get("length")

    try:
        if offset is not None:
            offset = int(offset)
            length = int(length) if length else None
            products = service.list_products(offset, length)
        else:
            products = service.list_products()
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
        product = service.update_product(p_id, payload)
        return JsonResponse({'product': product.to_dict()}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def delete_product_view(request, p_id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        service.delete_product(p_id)
        return JsonResponse({"message": "Deleted successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)