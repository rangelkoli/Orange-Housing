from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import Ad
from datetime import date

@require_GET
def get_ads(request):
    """
    Fetch all active advertisements.
    Ads are considered active if their expiration date is today or in the future.
    """
    today = date.today()
    # Fetch all ads that haven't expired
    ads = Ad.objects.filter(expires__gte=today).values(
        'id', 
        'name', 
        'phone', 
        'description', 
        'url', 
        'expires', 
        'logo'
    )
    
    return JsonResponse({'ads': list(ads)})
