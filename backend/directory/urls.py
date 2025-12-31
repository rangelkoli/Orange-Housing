from django.urls import path
from . import views

urlpatterns = [
    # General directory endpoints
    path('', views.directory_list, name='directory_list'),
    path('<int:directory_id>/', views.directory_detail, name='directory_detail'),
    
    # Category-specific endpoints
    path('landlords/', views.landlord_list, name='landlord_list'),
    path('complexes/', views.complex_list, name='complex_list'),
    path('managers/', views.manager_list, name='manager_list'),
    path('team-syracuse/', views.team_syracuse_list, name='team_syracuse_list'),
    path('businesses/', views.business_list, name='business_list'),
]
