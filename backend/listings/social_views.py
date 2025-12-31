import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from .social_utils import MetaSocialManager
from .views import _get_raw_listings, _format_listings_data

@csrf_exempt
def post_listing_to_socials(request, listing_id):
    """
    Triggers automated posting to Instagram and Facebook for a specific listing.
    Can be called via internal trigger OR admin manual retry.
    """
    if request.method not in ['POST', 'GET']: # Allow GET for manual admin trigger for now
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        # 1. Get listing data
        listings = _get_raw_listings(visible='all')
        filtered = [l for l in listings if l['id'] == listing_id]
        
        if not filtered:
            return JsonResponse({'error': 'Listing not found'}, status=404)
        
        listing_raw = filtered[0]
        listing_formatted = _format_listings_data([listing_raw], request)[0]
        
        # 2. Check if posting is requested/already done
        if not listing_raw.get('social_media_posting'):
            return JsonResponse({'error': 'Social media posting not requested for this listing'}, status=400)
            
        # 3. Post to social media
        manager = MetaSocialManager()
        results = manager.post_listing(listing_formatted)
        
        # 4. Update listing status
        social_media_posted = False
        social_media_post_id = None
        social_media_error = None
        
        ig_res = results.get('instagram', {})
        fb_res = results.get('facebook', {})
        
        if 'id' in ig_res or 'id' in fb_res:
            social_media_posted = True
            # Store IDs if available
            ids = []
            if 'id' in ig_res: ids.append(f"ig:{ig_res['id']}")
            if 'id' in fb_res: ids.append(f"fb:{fb_res['id']}")
            social_media_post_id = ", ".join(ids)

        # Collect errors
        errors = []
        if 'error' in ig_res: errors.append(f"Instagram: {ig_res['error']}")
        if 'error' in fb_res: errors.append(f"Facebook: {fb_res['error']}")
        if errors:
            social_media_error = " | ".join(errors)

        # Update Database
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE listings 
                SET social_media_posted = %s, 
                    social_media_post_id = %s, 
                    social_media_error = %s 
                WHERE id = %s
            """, [1 if social_media_posted else 0, social_media_post_id, social_media_error, listing_id])

        return JsonResponse({
            'message': 'Social media posting process completed',
            'results': results,
            'posted': social_media_posted
        })

    except Exception as e:
        import traceback
        return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
