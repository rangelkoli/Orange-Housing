from django.urls import path
from . import views
from . import social_views

urlpatterns = [
    path('', views.listing_list, name='listing_list'),
    path('<int:listing_id>/', views.listing_detail, name='listing_detail'),
    path('create/', views.listing_create, name='listing_create'),
    path('update/<int:listing_id>/', views.listing_update, name='listing_update'),
    path('edit/<int:listing_id>/', views.listing_detail_for_edit, name='listing_detail_for_edit'),
    # Type-specific listing endpoints
    path('rentals/', views.rentals_list, name='rentals_list'),
    path('sublets/', views.sublets_list, name='sublets_list'),
    path('rooms/', views.rooms_list, name='rooms_list'),
    path('featured/', views.featured_list, name='featured_list'),
    path('landlord/', views.landlord_listings, name='landlord_listings'),
    # Admin approval endpoints
    path('admin/pending/', views.admin_pending_listings, name='admin_pending_listings'),
    path('admin/approve/<int:listing_id>/', views.admin_approve_listing, name='admin_approve_listing'),
    path('admin/reject/<int:listing_id>/', views.admin_reject_listing, name='admin_reject_listing'),
    path('admin/request-changes/<int:listing_id>/', views.admin_request_changes, name='admin_request_changes'),
    path('<int:listing_id>/post-social/', social_views.post_listing_to_socials, name='post_social'),

]

