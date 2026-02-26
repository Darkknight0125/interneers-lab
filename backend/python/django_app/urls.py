from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse, JsonResponse

def hello_world(request):
    return HttpResponse("Hello, world! This is our interneers-lab Django server" 
                + ", and this function has been modified for week-1 starters-0 change.")

def hello_name(request):
    """
    This function recieves a request object and returns 'Hello, {name}!' in JSON format.
    It extracts the name from query parameter called 'name' in request object.
    """
    name = request.GET.get('name', 'User')
    return JsonResponse({
        'message': f'Hello, {name}!'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello_world/', hello_world),
    path('hello/', hello_name),
    # Example usage: /hello/?name=Bob
    # returns {"message": "Hello, Bob!"}

    #Product APIs
    path('product/', include("product.adapters.http.urls")),
]
