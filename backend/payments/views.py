import os
import stripe
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from listings.models import Listing
from users.models import User

# Initialize Stripe with your secret key
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')
# You should set this price ID in your .env file or hardcode it if it's fixed
# For dynamic prices, you can pass it from frontend or look it up
SUBSCRIPTION_PRICE_ID = os.getenv('STRIPE_SUBSCRIPTION_PRICE_ID') 

# Helper to capture payment method from Setup Intent
def _handle_setup_intent(session):
    setup_intent_id = session.get('setup_intent')
    listing_ids_str = session.get('metadata', {}).get('listing_ids')
    
    if not setup_intent_id or not listing_ids_str:
        print("WEBHOOK WARNING: Missing setup_intent or listing_ids for setup mode")
        return

    try:
        setup_intent = stripe.SetupIntent.retrieve(setup_intent_id)
        payment_method_id = setup_intent.payment_method
        
        print(f"WEBHOOK SETUP CAPTURED: PM {payment_method_id} for Listings {listing_ids_str}")
        
        for l_id in listing_ids_str.split(','):
            l_id = l_id.strip()
            if l_id:
                try:
                    listing = Listing.objects.get(id=l_id)
                    listing.stripe_payment_method_id = payment_method_id
                    listing.approval_status = 'pending' # Ready for admin review
                    listing.save()
                    print(f"Listing {l_id} payment method saved.")
                except Listing.DoesNotExist:
                    continue
    except Exception as e:
        print(f"WEBHOOK ERROR processing setup intent: {e}")



@csrf_exempt
@api_view(['POST'])
@permission_classes([])
def create_checkout_session(request):

    """
    Creates a Stripe Checkout Session for one or multiple listing subscriptions.
    Expects 'items' in the POST data: 
    [
        {'listing_id': 123, 'type': 'standard' | 'featured', 'social_media': true},
        ...
    ]
    Optionally accepts 'listing_id' (legacy single item).
    """
    data = request.data
    user_id = data.get('user_id')
    if not user_id:
         return JsonResponse({'error': 'user_id is required'}, status=400)

    user = get_object_or_404(User, pk=user_id)
    
    # Parse items
    items = data.get('items', [])
    # Support legacy single item format
    if not items and data.get('listing_id'):
        items = [{
            'listing_id': data.get('listing_id'), 
            'type': data.get('type', 'standard'),
            'social_media': data.get('social_media', False)
        }]
        
    if not items:
        return JsonResponse({'error': 'No items provided'}, status=400)

    # Validate listings and build line items
    line_items = []
    listing_ids = []
    
    # Price mapping
    PRICES = {
        'standard': os.getenv('STRIPE_PRICE_STANDARD') or os.getenv('STRIPE_SUBSCRIPTION_PRICE_ID'),
        'featured': os.getenv('STRIPE_PRICE_FEATURED')
    }
    
    for item in items:
        l_id = item.get('listing_id')
        p_type = item.get('type', 'standard')
        
        if not l_id:
            continue
            
        # Verify ownership
        try:
             listing = Listing.objects.get(id=l_id, user=user)
        except Listing.DoesNotExist:
             return JsonResponse({'error': f'Listing {l_id} not found or access denied'}, status=404)
             
        # Update listing preference
        listing.social_media_posting = bool(item.get('social_media', False))
        listing.save()
             
        price_id = PRICES.get(p_type)
        if not price_id:
            return JsonResponse({'error': f'Price for {p_type} not configured'}, status=500)
            
        line_items.append({
            'price': price_id,
            'quantity': 1,
        })
        listing_ids.append(str(l_id))

    if not line_items:
        return JsonResponse({'error': 'No valid items to subscribe'}, status=400)

    listing_ids_str = ",".join(listing_ids)


    
    # 1. Update/Create Stripe Customer for the User
    try:
        stripe_customer_id = user.stripe_customer_id
        if not stripe_customer_id:
            # Create a new Customer in Stripe
            customer = stripe.Customer.create(
                email=user.user_email,
                name=f"{user.first_name} {user.last_name}",
                metadata={
                    'user_id': user.user_id
                }
            )


            stripe_customer_id = customer.id
            user.stripe_customer_id = stripe_customer_id
            user.save()
        
        # 2. Create Checkout Session
        # 2. Create Checkout Session in SETUP mode
        # We don't subscribe yet, we just save card for future off-session charge
        checkout_session = stripe.checkout.Session.create(
            customer=stripe_customer_id,
            payment_method_types=['card'],
            mode='setup',
            success_url=f"{settings.FRONTEND_URL}/landlord/dashboard?success=true&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/landlord/dashboard?canceled=true",
            metadata={
                'listing_ids': listing_ids_str,
                'user_id': user.user_id,
                'setup_for_approval': 'true'
            }
        )


        
        return JsonResponse({'url': checkout_session.url})
        
    except Exception as e:
        print(f"DEBUG: SUBSCRIPTION_PRICE_ID used: {SUBSCRIPTION_PRICE_ID}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)




@csrf_exempt
def stripe_webhook(request):
    """
    Handles Stripe webhooks to update listing status.
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        print("WEBHOOK ERROR: Invalid payload")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        print(f"WEBHOOK ERROR: Signature verification failed. Header: {sig_header}")
        return HttpResponse(status=400)

    print(f"WEBHOOK RECEIVED: {event['type']}")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Check mode
        mode = session.get('mode')
        if mode == 'setup':
            _handle_setup_intent(session)
            return HttpResponse(status=200)
            
        # SUBSCRIPTION MODE (Legacy or if we mix modes)
        subscription_id = session.get('subscription')

        
        if listing_ids_str and subscription_id:
            print(f"WEBHOOK ACTIVATING: Listings {listing_ids_str} with Sub {subscription_id}")
            for l_id in listing_ids_str.split(','):
                if l_id.strip():
                    _activate_listing(l_id.strip(), subscription_id)
        else:
            print(f"WEBHOOK WARNING: Missing metadata. ids={listing_ids_str}, sub={subscription_id}")

    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        listing_ids_str = subscription.get('metadata', {}).get('listing_ids')
        
        # Legacy fallback
        if not listing_ids_str:
            single_id = subscription.get('metadata', {}).get('listing_id')
            if single_id:
                listing_ids_str = str(single_id)
        
        if listing_ids_str:
             for l_id in listing_ids_str.split(','):
                l_id = l_id.strip()
                if l_id:
                    _deactivate_listing(l_id)

            
    # Add other events like invoice.payment_failed if needed

    return HttpResponse(status=200)

def _activate_listing(listing_id, subscription_id):
    try:
        listing = Listing.objects.get(id=listing_id)
        listing.is_public = True
        listing.stripe_subscription_id = subscription_id
        listing.save()
        print(f"Listing {listing_id} activated.")
    except Listing.DoesNotExist:
        print(f"Error: Listing {listing_id} not found during activation.")

def _deactivate_listing(listing_id):
    try:
        listing = Listing.objects.get(id=listing_id)
        listing.is_public = False
        listing.stripe_subscription_id = None # Or keep it for history
        listing.save()
        print(f"Listing {listing_id} deactivated.")
    except Listing.DoesNotExist:
        print(f"Error: Listing {listing_id} not found during deactivation.")

@api_view(['GET'])
@permission_classes([]) # Relaxing for demo, in prod use IsAuthenticated
def get_subscription_details(request):
    """
    Fetches subscription details from Stripe for a given listing.
    """
    listing_id = request.query_params.get('listing_id')
    user_id = request.query_params.get('user_id')
    
    if not listing_id or not user_id:
         return JsonResponse({'error': 'listing_id and user_id are required'}, status=400)
    
    listing = get_object_or_404(Listing, id=listing_id)
    if not listing.stripe_subscription_id:
        return JsonResponse({'error': 'No active subscription found'}, status=404)
        
    try:
        sub = stripe.Subscription.retrieve(listing.stripe_subscription_id)
        
        return JsonResponse({
            'status': sub.status,
            'current_period_end': sub.current_period_end,
            'cancel_at_period_end': sub.cancel_at_period_end,
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([])
def cancel_subscription(request):
    """
    Cancels a Stripe subscription for a listing.
    """
    data = request.data
    listing_id = data.get('listing_id')
    user_id = data.get('user_id')

    if not listing_id or not user_id:
         return JsonResponse({'error': 'listing_id and user_id are required'}, status=400)

    listing = get_object_or_404(Listing, id=listing_id)
    if not listing.stripe_subscription_id:
         return JsonResponse({'error': 'No active subscription found'}, status=404)

    try:
        # Cancel at period end
        stripe.Subscription.modify(
            listing.stripe_subscription_id,
            cancel_at_period_end=True
        )
        return JsonResponse({'status': 'canceled'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([])
def sync_subscriptions(request):
    """
    Manually syncs users subscriptions from Stripe to local DB.
    Useful if webhooks fail.
    """
    user_id = request.data.get('user_id')
    if not user_id:
         return JsonResponse({'error': 'user_id is required'}, status=400)
    
    user = get_object_or_404(User, pk=user_id)
    if not user.stripe_customer_id:
         # No customer ID means no subscriptions yet usually
         return JsonResponse({'message': 'No Stripe customer record found', 'updated': 0})

    try:
        # List active subscriptions for the customer
        subscriptions = stripe.Subscription.list(
            customer=user.stripe_customer_id,
            status='active',
            limit=100
        )
        
        updated_count = 0
        
        for sub in subscriptions.auto_paging_iter():
            listing_ids_str = sub.metadata.get('listing_ids')
            
            # Legacy fallback
            if not listing_ids_str:
                single_id = sub.metadata.get('listing_id')
                if single_id:
                    listing_ids_str = str(single_id)
            
            if listing_ids_str:
                for l_id in listing_ids_str.split(','):
                    l_id = l_id.strip()
                    if l_id:
                        # Update the listing
                        try:
                            listing = Listing.objects.get(id=l_id)
                            # Only update if different
                            if not listing.is_public or listing.stripe_subscription_id != sub.id:
                                listing.is_public = True
                                listing.stripe_subscription_id = sub.id
                                listing.save()
                                updated_count += 1
                        except Listing.DoesNotExist:
                            continue
                            
        return JsonResponse({'message': 'Sync complete', 'updated': updated_count})
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([])
def create_portal_session(request):
    """
    Creates a Stripe Billing Portal session for the user.
    """
    user_id = request.data.get('user_id')
    if not user_id:
        return JsonResponse({'error': 'user_id is required'}, status=400)
    
    user = get_object_or_404(User, pk=user_id)
    if not user.stripe_customer_id:
        return JsonResponse({'error': 'No Stripe customer record found. Please subscribe to a listing first.'}, status=400)
    
    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=user.stripe_customer_id,
            return_url=f"{settings.FRONTEND_URL}/landlord/billing",
        )
        return JsonResponse({'url': portal_session.url})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
