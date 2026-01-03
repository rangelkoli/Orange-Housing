from django.urls import path
from . import views

urlpatterns = [
    path('create-checkout-session/', views.create_checkout_session, name='create-checkout-session'),
    path('webhook/', views.stripe_webhook, name='stripe-webhook'),
    path('subscription-details/', views.get_subscription_details, name='subscription-details'),
    path('cancel-subscription/', views.cancel_subscription, name='cancel-subscription'),
    path('sync-subscriptions/', views.sync_subscriptions, name='sync-subscriptions'),
    path('create-portal-session/', views.create_portal_session, name='create-portal-session'),
]

