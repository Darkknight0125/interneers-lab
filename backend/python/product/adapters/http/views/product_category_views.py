import json

from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt

from product.adapters.http.views.product_views import category_service


@csrf_exempt
def create_category_view(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        payload = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    try:
        category = category_service.create_category(payload)
        return JsonResponse({"category": category.to_dict()}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def get_category_view(request, c_id):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    try:
        category = category_service.get_category(c_id)

        if category is None:
            return JsonResponse({"error": "Category not found"}, status=404)

        return JsonResponse({"category": category.to_dict()}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def list_categories_view(request):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    try:
        categories = category_service.list_categories()
        data = [c.to_dict() for c in categories]
        return JsonResponse(data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def update_category_view(request, c_id):
    if request.method != "PUT":
        return HttpResponseNotAllowed(["PUT"])

    try:
        payload = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    try:
        category = category_service.update_category(c_id, payload)
        return JsonResponse({"category": category.to_dict()}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def delete_category_view(request, c_id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        category_service.delete_category(c_id)
        return JsonResponse({"message": "Category deleted"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)