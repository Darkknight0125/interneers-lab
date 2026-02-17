from django.contrib import admin
from django.urls import path
from django.http import HttpResponse

def hello_world(request):
    return HttpResponse("Hello, world! This is our interneers-lab Django server" 
                + ", and this function has been modified for week-1 starters-0 change.")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/', hello_world),
]
