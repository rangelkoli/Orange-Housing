from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("login/", views.login, name="login"),
    path("update-password/", views.update_password, name="update_password"),
    path("change-password/", views.change_password, name="change_password"),
]
