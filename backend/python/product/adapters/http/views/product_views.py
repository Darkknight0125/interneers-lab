import json
import csv
from io import TextIOWrapper

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
    

@csrf_exempt
def assign_category_view(request, p_id):

    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        payload = json.loads(request.body)
        category_id = payload.get("category_id")

        if not category_id:
            return JsonResponse({"error": "category_id required"}, status=400)

        product = service.assign_product_to_category(p_id, category_id)
        return JsonResponse({"product": product.to_dict()}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@csrf_exempt
def remove_category_view(request, p_id):

    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        product = service.remove_product_from_category(p_id)
        return JsonResponse({"product": product.to_dict()}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

def products_by_category_view(request, c_id):

    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    try:
        products = service.get_products_by_category(c_id)
        data = [p.to_dict() for p in products]
        return JsonResponse(data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def filter_products_view(request):

    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    try:
        filters = {}

        if request.GET.get("min_price"):
            filters["min_price"] = int(request.GET.get("min_price"))

        if request.GET.get("max_price"):
            filters["max_price"] = int(request.GET.get("max_price"))

        if request.GET.get("brand"):
            filters["brand"] = request.GET.get("brand")

        if request.GET.get("category_ids"):
            filters["category_ids"] = request.GET.get("category_ids").split(",")

        if request.GET.get("in_stock"):
            filters["in_stock"] = request.GET.get("in_stock") == "true"

        if request.GET.get("search"):
            filters["search"] = request.GET.get("search")

        if request.GET.get("sort_by"):
            filters["sort_by"] = request.GET.get("sort_by")
            filters["order"] = request.GET.get("order", "asc")

        products = service.filter_products(filters)
        data = [p.to_dict() for p in products]
        return JsonResponse(data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@csrf_exempt
def bulk_upload_products_view(request):

    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    if "file" not in request.FILES:
        return JsonResponse({"error": "CSV file required"}, status=400)

    file = request.FILES["file"]
    if not file.name.lower().endswith(".csv"):
        return JsonResponse({"error": "Only .csv files are allowed"}, status=400)

    try:
        decoded_file = TextIOWrapper(file, encoding="utf-8")
        reader = csv.DictReader(decoded_file)

        success_count = 0
        errors = []

        for idx, row in enumerate(reader, start=1):
            try:
                payload = {
                    "name": row.get("name"),
                    "brand": row.get("brand"),
                    "price": int(row.get("price")),
                    "description": row.get("description"),
                    "inventory_quantity": int(row.get("inventory_quantity")),
                    "category_id": row.get("category_id") or None
                }

                service.create_product(payload)
                success_count += 1

            except Exception as e:
                errors.append({
                    "row": idx,
                    "error": str(e)
                })

        return JsonResponse({
            "success_count": success_count,
            "error_count": len(errors),
            "errors": errors
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)