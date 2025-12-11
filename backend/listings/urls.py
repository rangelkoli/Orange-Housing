from django.urls import path
from . import views

urlpatterns = [
    path('', views.listing_list, name='listing_list'),
    path('<int:listing_id>/', views.listing_detail, name='listing_detail'),
    path('create/', views.listing_create, name='listing_create'),
    # Type-specific listing endpoints
    path('rentals/', views.rentals_list, name='rentals_list'),
    path('sublets/', views.sublets_list, name='sublets_list'),
    path('rooms/', views.rooms_list, name='rooms_list'),
    path('featured/', views.featured_list, name='featured_list'),
]
