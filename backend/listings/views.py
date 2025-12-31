from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.db import connection
from django.conf import settings
import json
from datetime import datetime, date
import stripe
import os

# Initialize Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')




def _get_utilities_for_listings(listing_ids):
    """Get utilities for multiple listings"""
    if not listing_ids:
        return {}
    
    with connection.cursor() as cursor:
        placeholders = ','.join(['%s' for _ in listing_ids])
        cursor.execute(f"""
            SELECT llu.listing_id, u.name 
            FROM listings_listing_utilities llu
            JOIN lookup_utilities u ON llu.utility_id = u.id
            WHERE llu.listing_id IN ({placeholders})
            ORDER BY u.name
        """, listing_ids)
        
        utilities_by_listing = {}
        for row in cursor.fetchall():
            listing_id = row[0]
            name = row[1]
            if listing_id not in utilities_by_listing:
                utilities_by_listing[listing_id] = []
            utilities_by_listing[listing_id].append(name)
        
        return utilities_by_listing


def _update_listing_utilities(listing_id, utilities_data):
    """Update utilities for a listing (handle both legacy codes and new list format)"""
    if utilities_data is None:
        return

    utility_names = []
    
    # Handle legacy codes
    if isinstance(utilities_data, str) or isinstance(utilities_data, int):
        code = str(utilities_data)
        if code == '0' or code.lower() == 'included':
             utility_names = ['Gas', 'Electric', 'Water', 'Heat', 'Internet']
        elif code == '2':
            utility_names = ['Gas']
        elif code == '3':
            utility_names = ['Electric']
        elif code == '4':
             utility_names = ['Gas', 'Electric']
        elif code == '5':
             utility_names = ['Contact Manager']
    
    # Handle list of names
    elif isinstance(utilities_data, list):
        utility_names = utilities_data
    
    with connection.cursor() as cursor:
        # Clear existing
        cursor.execute("DELETE FROM listings_listing_utilities WHERE listing_id = %s", [listing_id])
        
        if not utility_names:
            return

        # Get IDs for names
        placeholders = ','.join(['%s' for _ in utility_names])
        cursor.execute(f"SELECT id FROM lookup_utilities WHERE name IN ({placeholders})", utility_names)
        
        utility_ids = [row[0] for row in cursor.fetchall()]
        
        if utility_ids:
            # Insert
            values_str = ','.join([f"({int(listing_id)}, {int(uid)})" for uid in utility_ids])
            cursor.execute(f"INSERT INTO listings_listing_utilities (listing_id, utility_id) VALUES {values_str}")


def _get_raw_listings(visible=True, type_code=None, filters=None, user_id=None):
    """Get listings directly from database to avoid Django ORM date parsing issues"""
    with connection.cursor() as cursor:
        # Build the query
        query = """
            SELECT 
                l.id, l.listing_title, l.address, l.zip, l.unit, l.beds, l.baths, l.rent, 
                l.pets, l.details, l.date_avail, l.date_created, 
                l.date_expires, l.contact_name, l.contact_number, l.contact_email,
                l.visible, l.featured, l.location, l.perfect_for, l.building_type,
                l.furnished, l.lease_length, l.tenant_lease_end, l.fireplace,
                l.dishwasher, l.laundry, l.porch, l.parking, l.smoking,
                l.is_season, l.total_beds, l.typeCode, l.latLng, l.physicalAddress,
                l.textOk, l.rent_type, l.cover_photo_id, l.user_id,
                l.is_public, l.stripe_subscription_id, l.stripe_payment_link,
                l.approval_status, l.admin_feedback, l.stripe_payment_method_id,
                l.social_media_posting, l.social_media_posted, l.social_media_post_id, l.social_media_error
            FROM listings l
            WHERE 1=1


        """
        params = []
        
        if visible is True:
            query += " AND l.visible = 1"
        elif visible == 'only_invisible':
            query += " AND l.visible = 0"
        # if visible is 'all' or False, we show everything (no filter)
        
        if type_code is not None:
            query += " AND l.typeCode = %s"
            params.append(type_code)

        if user_id is not None:
            query += " AND l.user_id = %s"
            params.append(user_id)
        
        # Apply filters
        if filters:
            # Location filter
            location = filters.get('location')
            if location and location.lower() != 'all':
                query += " AND (l.location LIKE %s OR l.address LIKE %s OR l.physicalAddress LIKE %s)"
                params.extend([f'%{location}%', f'%{location}%', f'%{location}%'])
            
            # Building type filter
            building_type = filters.get('buildingType')
            if building_type and 'all' not in building_type.lower():
                query += " AND l.building_type LIKE %s"
                params.append(f'%{building_type}%')
            
            # Bedrooms filter
            bedrooms = filters.get('bedrooms')
            if bedrooms and bedrooms.lower() != 'all':
                if bedrooms.lower() == 'studio':
                    query += " AND l.beds = 0"
                elif bedrooms.isdigit():
                    query += " AND l.beds = %s"
                    params.append(int(bedrooms))
                elif 'bedroom' in bedrooms.lower():
                    num = ''.join(filter(str.isdigit, bedrooms))
                    if num:
                        if '+' in bedrooms:
                            query += " AND l.beds >= %s"
                            params.append(int(num))
                        else:
                            query += " AND l.beds = %s"
                            params.append(int(num))
            
            # Max rent filter
            max_rent = filters.get('maxRent')
            if max_rent and max_rent.isdigit():
                query += " AND l.rent <= %s"
                params.append(int(max_rent))
            
            # Pets filter
            pets = filters.get('pets')
            if pets and pets.lower() != 'all':
                if 'yes' in pets.lower() or 'allowed' in pets.lower():
                    query += " AND (l.pets LIKE '%yes%' OR l.pets LIKE '%allowed%' OR l.pets = '1')"
                elif 'no' in pets.lower():
                    query += " AND (l.pets LIKE '%no%' OR l.pets IS NULL OR l.pets = '' OR l.pets = '2')"
            
            # Furnished filter
            furnished = filters.get('furnished')
            if furnished and furnished.lower() != 'all':
                if furnished.lower() == 'furnished':
                    query += " AND (l.furnished LIKE '%yes%' OR l.furnished LIKE '%full%' OR l.furnished = 'Yes')"
                elif furnished.lower() == 'unfurnished':
                    query += " AND (l.furnished LIKE '%no%' OR l.furnished LIKE '%unfurnished%' OR l.furnished IS NULL)"
            
            # Search query
            search_query = filters.get('q')
            if search_query:
                query += """ AND (
                    l.address LIKE %s OR 
                    l.physicalAddress LIKE %s OR 
                    l.location LIKE %s OR 
                    l.details LIKE %s OR 
                    l.building_type LIKE %s OR
                    CAST(l.zip AS TEXT) LIKE %s
                )"""
                search_term = f'%{search_query}%'
                params.extend([search_term] * 6)
            
            # Listing type filter
            listing_type = filters.get('type')
            if listing_type:
                type_mapping = {
                    'Rentals': 1,
                    'ShortTerm': 4,
                    'Sublets': 2,
                    'RoomForRent': 3,
                }
                mapped_type = type_mapping.get(listing_type)
                if mapped_type:
                    query += " AND l.typeCode = %s"
                    params.append(mapped_type)
        
        query += " ORDER BY l.featured DESC, l.date_created DESC LIMIT 100"
        
        cursor.execute(query, params)
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def _get_photos_for_listings(listing_ids):
    """Get photos for multiple listings"""
    if not listing_ids:
        return {}
    
    with connection.cursor() as cursor:
        placeholders = ','.join(['%s' for _ in listing_ids])
        cursor.execute(f"""
            SELECT listing_id, name FROM photos 
            WHERE listing_id IN ({placeholders})
            ORDER BY is_main DESC, photo_id ASC
        """, listing_ids)
        
        photos_by_listing = {}
        for row in cursor.fetchall():
            listing_id = row[0]
            name = row[1]  # Use name column which has the actual filename
            if listing_id not in photos_by_listing:
                photos_by_listing[listing_id] = []
            photos_by_listing[listing_id].append(name)
        
        return photos_by_listing


def _safe_date_str(date_value):
    """Safely convert a date value to string, handling invalid dates"""
    if date_value is None:
        return None
    if isinstance(date_value, str):
        if date_value.startswith('0000') or date_value == '':
            return None
        return date_value
    return str(date_value)


def _format_listings_data(listings, request=None):
    """Format raw listing data for API response"""
    if not listings:
        return []
    
    # Get photos for all listings
    listing_ids = [l['id'] for l in listings]
    photos_by_listing = _get_photos_for_listings(listing_ids)
    utilities_by_listing = _get_utilities_for_listings(listing_ids)
    
    placeholder_image = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop"
    
    # Get media URL from settings (supports both local and R2 storage)
    media_url = getattr(settings, 'MEDIA_URL', '/media/')
    
    # Build base URL from request if available (for local storage)
    base_url = ""
    if request and media_url.startswith('/'):
        base_url = f"{request.scheme}://{request.get_host()}"
    
    listings_data = []
    for listing in listings:
        # Get photo paths and convert to full URLs
        photo_paths = photos_by_listing.get(listing['id'], [])
        
        if photo_paths:
            # Convert paths to full URLs
            if media_url.startswith('http'):
                # R2 or external storage - use MEDIA_URL directly
                photo_urls = [f"{media_url}{path}" for path in photo_paths]
            elif base_url:
                # Local storage with request context
                photo_urls = [f"{base_url}{media_url}{path}" for path in photo_paths]
            else:
                # Local storage without request context
                photo_urls = [f"{media_url}{path}" for path in photo_paths]
        else:
            photo_urls = [placeholder_image]

        
        # Build title - use custom title if available, otherwise generate one
        beds = listing.get('beds') or 0
        building_type = listing.get('building_type') or 'Apartment'
        custom_title = listing.get('listing_title')
        title = custom_title if custom_title else f"{beds} Bed {building_type}"
        
        listings_data.append({
            'id': listing['id'],
            'title': title,
            'price': f"${listing.get('rent') or 0}/mo",
            'rent': listing.get('rent'),
            'beds': beds,
            'baths': listing.get('baths') or "1",
            'address': listing.get('address') or 'Address not provided',
            'city': f"Syracuse, NY {listing.get('zip') or '13210'}",
            'zip': listing.get('zip'),
            'images': photo_urls,
            'availableDate': _safe_date_str(listing.get('date_avail')) or 'Available Now',
            'details': listing.get('details'),
            'pets': listing.get('pets'),
            'utilities': utilities_by_listing.get(listing['id'], []),
            'furnished': listing.get('furnished'),
            'laundry': listing.get('laundry'),
            'parking': listing.get('parking'),
            'building_type': listing.get('building_type'),
            'contact_name': listing.get('contact_name'),
            'contact_email': listing.get('contact_email'),
            'contact_number': listing.get('contact_number'),
            'featured': listing.get('featured') or 0,
            'latLng': listing.get('latLng'),
            'typeCode': listing.get('typeCode') or 1,
            'location': listing.get('location'),
            'is_public': bool(listing.get('is_public')),
            'stripe_subscription_id': listing.get('stripe_subscription_id'),
            'stripe_payment_link': listing.get('stripe_payment_link'),
            'visible': listing.get('visible'),
            'status': listing.get('approval_status') or ('approved' if listing.get('visible') else 'pending'),
            'admin_feedback': listing.get('admin_feedback'),
            'payment_method_on_file': bool(listing.get('stripe_payment_method_id')),
            'social_media_posting': bool(listing.get('social_media_posting')),
            'social_media_posted': bool(listing.get('social_media_posted')),
            'social_media_post_id': listing.get('social_media_post_id'),
            'social_media_error': listing.get('social_media_error'),
        })



    
    return listings_data


def listing_list(request):
    """Get all visible listings with their photos, with optional filtering"""
    if request.method == 'GET':
        try:
            filters = {k: v for k, v in request.GET.items()}
            visible_param = request.GET.get('visible')
            visible = True
            if visible_param == 'all':
                visible = False
            elif visible_param == 'false' or visible_param == 'invisible':
                visible = 'only_invisible'
            
            listings = _get_raw_listings(visible=visible, filters=filters)
            listings_data = _format_listings_data(listings, request)
            
            return JsonResponse({
                'listings': listings_data,
                'count': len(listings_data),
                'filters_applied': filters
            })
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def rentals_list(request):
    """Get all visible rental listings (typeCode=1) with optional filtering"""
    if request.method == 'GET':
        try:
            filters = {k: v for k, v in request.GET.items()}
            listings = _get_raw_listings(visible=True, type_code=1, filters=filters)
            listings_data = _format_listings_data(listings, request)
            
            return JsonResponse({
                'listings': listings_data,
                'count': len(listings_data),
                'type': 'rentals',
                'filters_applied': filters
            })
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def sublets_list(request):
    """Get all visible sublet listings (typeCode=2) with optional filtering"""
    if request.method == 'GET':
        try:
            filters = {k: v for k, v in request.GET.items()}
            listings = _get_raw_listings(visible=True, type_code=2, filters=filters)
            listings_data = _format_listings_data(listings, request)
            
            return JsonResponse({
                'listings': listings_data,
                'count': len(listings_data),
                'type': 'sublets',
                'filters_applied': filters
            })
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def rooms_list(request):
    """Get all visible room for rent listings (typeCode=3) with optional filtering"""
    if request.method == 'GET':
        try:
            filters = {k: v for k, v in request.GET.items()}
            listings = _get_raw_listings(visible=True, type_code=3, filters=filters)
            listings_data = _format_listings_data(listings, request)
            
            return JsonResponse({
                'listings': listings_data,
                'count': len(listings_data),
                'type': 'rooms',
                'filters_applied': filters
            })
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def featured_list(request):
    """Get all visible spotlight listings (spotlightListing date is within 30 days or in the future)"""
    if request.method == 'GET':
        try:
            # Calculate date 30 days ago
            from datetime import timedelta
            thirty_days_ago = (date.today() - timedelta(days=30)).isoformat()
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        l.id, l.listing_title, l.address, l.zip, l.unit, l.beds, l.baths, l.rent, 
                        l.utilities, l.pets, l.details, l.date_avail, l.date_created, 
                        l.date_expires, l.contact_name, l.contact_number, l.contact_email,
                        l.visible, l.featured, l.location, l.perfect_for, l.building_type,
                        l.furnished, l.lease_length, l.tenant_lease_end, l.fireplace,
                        l.dishwasher, l.laundry, l.porch, l.parking, l.smoking,
                        l.is_season, l.total_beds, l.typeCode, l.latLng, l.physicalAddress,
                        l.textOk, l.rent_type, l.cover_photo_id, l.user_id, l.spotlightListing
                    FROM listings l
                    WHERE l.visible = 1 
                      AND l.spotlightListing IS NOT NULL 
                      AND l.spotlightListing != '' 
                      AND l.spotlightListing != '0000-00-00'
                      AND l.spotlightListing >= %s
                    ORDER BY l.spotlightListing DESC, l.date_created DESC
                    LIMIT 50
                """, [thirty_days_ago])
                columns = [col[0] for col in cursor.description]
                listings = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            listings_data = _format_listings_data(listings, request)
            
            return JsonResponse({
                'listings': listings_data,
                'count': len(listings_data),
                'type': 'featured'
            })
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def listing_detail(request, listing_id):
    """Get a single listing by ID"""
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        l.id, l.listing_title, l.address, l.zip, l.unit, l.beds, l.baths, l.rent, 
                        l.utilities, l.pets, l.details, l.date_avail, l.date_created, 
                        l.date_expires, l.contact_name, l.contact_number, l.contact_email,
                        l.visible, l.featured, l.location, l.perfect_for, l.building_type,
                        l.furnished, l.lease_length, l.tenant_lease_end, l.fireplace,
                        l.dishwasher, l.laundry, l.porch, l.parking, l.smoking,
                        l.is_season, l.total_beds, l.typeCode, l.latLng, l.physicalAddress,
                        l.textOk, l.rent_type, l.cover_photo_id, l.user_id
                    FROM listings l
                    WHERE l.id = %s
                """, [listing_id])
                
                columns = [col[0] for col in cursor.description]
                row = cursor.fetchone()
                
                if not row:
                    return JsonResponse({'error': 'Listing not found'}, status=404)
                
                listing = dict(zip(columns, row))
            
            # Get photos
            photos = _get_photos_for_listings([listing_id])
            photo_paths = photos.get(listing_id, [])
            
            placeholder_image = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop"
            
            # Get media URL from settings (supports both local and R2 storage)
            media_url = getattr(settings, 'MEDIA_URL', '/media/')
            base_url = f"{request.scheme}://{request.get_host()}"
            
            if photo_paths:
                # Convert paths to full URLs
                if media_url.startswith('http'):
                    # R2 or external storage
                    photo_urls = [f"{media_url}{path}" for path in photo_paths]
                else:
                    # Local storage
                    photo_urls = [f"{base_url}{media_url}{path}" for path in photo_paths]
            else:
                photo_urls = [placeholder_image]
            
            # Get utilities
            utilities_map = _get_utilities_for_listings([listing_id])
            utilities = utilities_map.get(listing_id, [])

            
            beds = listing.get('beds') or 0
            building_type = listing.get('building_type') or 'Apartment'
            custom_title = listing.get('listing_title')
            title = custom_title if custom_title else f"{beds} Bed {building_type}"
            
            listing_data = {
                'id': listing['id'],
                'title': title,
                'price': f"${listing.get('rent') or 0}/mo",
                'rent': listing.get('rent'),
                'beds': beds,
                'baths': listing.get('baths') or "1",
                'address': listing.get('address') or 'Address not provided',
                'city': f"Syracuse, NY {listing.get('zip') or '13210'}",
                'zip': listing.get('zip'),
                'images': photo_urls,
                'availableDate': _safe_date_str(listing.get('date_avail')) or 'Available Now',
                'details': listing.get('details'),
                'pets': listing.get('pets'),
                'utilities': utilities,
                'furnished': listing.get('furnished'),
                'laundry': listing.get('laundry'),
                'parking': listing.get('parking'),
                'building_type': listing.get('building_type'),
                'contact_name': listing.get('contact_name'),
                'contact_email': listing.get('contact_email'),
                'contact_number': listing.get('contact_number'),
                'featured': listing.get('featured') or 0,
                'latLng': listing.get('latLng'),
                'physicalAddress': listing.get('physicalAddress'),
                'lease_length': str(listing.get('lease_length')) if listing.get('lease_length') else None,
                'fireplace': listing.get('fireplace'),
                'dishwasher': listing.get('dishwasher'),
                'porch': listing.get('porch'),
                'smoking': listing.get('smoking'),
                'perfect_for': listing.get('perfect_for'),
                'location': listing.get('location'),
                'date_created': _safe_date_str(listing.get('date_created')),
                'date_expires': _safe_date_str(listing.get('date_expires')),
                'typeCode': listing.get('typeCode') or 1,
            }
            
            return JsonResponse({'listing': listing_data})
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def listing_create(request):
    """Create a new listing"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get user from authentication or request
            user_id = data.get('user_id')
            if not user_id:
                return JsonResponse({'error': 'user_id is required'}, status=400)
            
            # Verify user exists
            with connection.cursor() as cursor:
                cursor.execute("SELECT user_id FROM users WHERE user_id = %s", [user_id])
                if not cursor.fetchone():
                    return JsonResponse({'error': 'User not found'}, status=404)
            
            # Prepare dates
            date_avail = data.get('date_avail') or None
            date_expires = data.get('date_expires')
            if not date_expires:
                # Default to 3 months from now
                from datetime import timedelta
                date_expires = (date.today() + timedelta(days=90)).isoformat()
            
            # Get tenant_lease_end if provided
            tenant_lease_end = data.get('tenant_lease_end') or None

            # Sanitize numeric fields to prevent empty strings being inserted
            def clean_numeric(val):
                if val == "" or val is None:
                    return None
                return val

            lease_length = clean_numeric(data.get('lease_length'))
            rent = clean_numeric(data.get('rent'))
            zip_code = clean_numeric(data.get('zip'))
            beds = clean_numeric(data.get('beds'))
            unit = clean_numeric(data.get('unit'))
            total_beds = clean_numeric(data.get('total_beds'))

            
            # Insert the listing with all fields
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO listings (

                        listing_title, address, zip, unit, beds, baths, rent, pets, details,
                        user_id, date_avail, date_created, date_expires, contact_name,

                        contact_number, contact_email, visible, featured, location,
                        building_type, furnished, laundry, parking, latLng, physicalAddress,
                        typeCode, rent_type, total_beds, perfect_for, lease_length,
                        tenant_lease_end, dishwasher, fireplace, porch, is_season, smoking,
                        house_kitchen, house_chores, house_sleep, house_drink,
                        we_are, we_prefer, my_gender, prefer_gender, textOk, is_public, approval_status, social_media_posting, social_media_posted
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)


                """, [
                    data.get('listing_title'),
                    data.get('address'),

                    zip_code,
                    unit or 0,
                    beds,
                    data.get('baths'),
                    rent,


                    data.get('pets'),
                    data.get('details'),
                    user_id,
                    date_avail,
                    date.today().isoformat(),
                    date_expires,
                    data.get('contact_name', ''),
                    data.get('contact_number'),
                    data.get('contact_email'),
                    0,  # visible=0 until approved
                    data.get('featured', 0),
                    data.get('location'),
                    data.get('building_type'),
                    data.get('furnished'),
                    data.get('laundry'),
                    data.get('parking'),
                    data.get('latLng'),
                    data.get('physicalAddress'),
                    data.get('typeCode', 1),
                    data.get('rent_type', 'perBed'),
                    total_beds,
                    data.get('perfect_for'),
                    lease_length,

                    tenant_lease_end,
                    data.get('dishwasher'),
                    data.get('fireplace'),
                    data.get('porch'),
                    data.get('is_season'),
                    data.get('smoking'),
                    data.get('house_kitchen'),
                    data.get('house_chores'),
                    data.get('house_sleep'),
                    data.get('house_drink'),
                    data.get('we_are'),
                    data.get('we_prefer'),
                    data.get('my_gender'),
                    data.get('prefer_gender'),
                    1 if data.get('textOk') else 0,
                    0, # is_public
                    'draft', # approval_status
                    1 if data.get('social_media_posting') else 0,
                    0 # social_media_posted
                ])

                
                listing_id = cursor.lastrowid
            
            # Create utility relationships
            _update_listing_utilities(listing_id, data.get('utilities'))
            
            # Map typeCode to type name for response
            type_names = {1: 'Rentals', 2: 'Sublets', 3: 'Room for Rent', 4: 'Short Term'}
            type_name = type_names.get(data.get('typeCode', 1), 'Rental')
            
            return JsonResponse({
                'message': 'Listing created successfully',
                'listing': {
                    'id': listing_id,
                    'address': data.get('address'),
                    'type': type_name,
                    'typeCode': data.get('typeCode', 1)
                }
            }, status=201)
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def listing_update(request, listing_id):
    """Update an existing listing - only the owner can update"""
    if request.method == 'PUT' or request.method == 'PATCH':
        try:
            data = json.loads(request.body)
            
            # Get user from request
            user_id = data.get('user_id')
            if not user_id:
                return JsonResponse({'error': 'user_id is required'}, status=400)
            
            # Verify the listing exists and belongs to the user
            with connection.cursor() as cursor:
                cursor.execute("SELECT user_id FROM listings WHERE id = %s", [listing_id])
                row = cursor.fetchone()
                if not row:
                    return JsonResponse({'error': 'Listing not found'}, status=404)
                if row[0] != int(user_id):
                    return JsonResponse({'error': 'You do not have permission to edit this listing'}, status=403)
            
            
            # Update utilities separately
            utility_updated = False
            if 'utilities' in data:
                _update_listing_utilities(listing_id, data['utilities'])
                utility_updated = True
            
            # Build the update query dynamically based on provided fields
            update_fields = []
            params = []
            
            field_mapping = {
                'listing_title': 'listing_title',
                'address': 'address',
                'zip': 'zip',
                'unit': 'unit',
                'beds': 'beds',
                'baths': 'baths',
                'rent': 'rent',
                'pets': 'pets',
                'details': 'details',
                'date_avail': 'date_avail',
                'contact_name': 'contact_name',
                'contact_number': 'contact_number',
                'contact_email': 'contact_email',
                'location': 'location',
                'building_type': 'building_type',
                'furnished': 'furnished',
                'laundry': 'laundry',
                'parking': 'parking',
                'latLng': 'latLng',
                'physicalAddress': 'physicalAddress',
                'typeCode': 'typeCode',
                'rent_type': 'rent_type',
                'total_beds': 'total_beds',
                'perfect_for': 'perfect_for',
                'lease_length': 'lease_length',
                'tenant_lease_end': 'tenant_lease_end',
                'dishwasher': 'dishwasher',
                'fireplace': 'fireplace',
                'porch': 'porch',
                'is_season': 'is_season',
                'smoking': 'smoking',
                'house_kitchen': 'house_kitchen',
                'house_chores': 'house_chores',
                'house_sleep': 'house_sleep',
                'house_drink': 'house_drink',
                'we_are': 'we_are',
                'we_prefer': 'we_prefer',
                'my_gender': 'my_gender',
                'prefer_gender': 'prefer_gender',
                'textOk': 'textOk',
                'social_media_posting': 'social_media_posting',
            }
            
            for key, db_field in field_mapping.items():
                if key in data:
                    value = data[key]
                    # Handle special cases
                    if key == 'textOk':
                        value = 1 if value else 0
                    update_fields.append(f"{db_field} = %s")
                    params.append(value)
            
            if not update_fields:
                if utility_updated:
                    # If only utilities updated, return success
                     return JsonResponse({
                        'message': 'Listing updated successfully',
                        'listing_id': listing_id
                    })
                return JsonResponse({'error': 'No fields to update'}, status=400)
            
            # When a listing is updated, set to invisible for re-review
            update_fields.append("visible = 0")
            
            params.append(listing_id)
            
            with connection.cursor() as cursor:
                query = f"UPDATE listings SET {', '.join(update_fields)} WHERE id = %s"
                cursor.execute(query, params)
            
            return JsonResponse({
                'message': 'Listing updated successfully',
                'listing_id': listing_id
            })
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def listing_detail_for_edit(request, listing_id):
    """Get a single listing by ID for editing - includes all raw field data"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            if not user_id:
                return JsonResponse({'error': 'user_id is required'}, status=400)
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        l.id, l.listing_title, l.address, l.zip, l.unit, l.beds, l.baths, l.rent, 
                        l.utilities, l.pets, l.details, l.date_avail, l.date_created, 
                        l.date_expires, l.contact_name, l.contact_number, l.contact_email,
                        l.visible, l.featured, l.location, l.perfect_for, l.building_type,
                        l.furnished, l.lease_length, l.tenant_lease_end, l.fireplace,
                        l.dishwasher, l.laundry, l.porch, l.parking, l.smoking,
                        l.is_season, l.total_beds, l.typeCode, l.latLng, l.physicalAddress,
                        l.textOk, l.rent_type, l.cover_photo_id, l.user_id,
                        l.house_kitchen, l.house_chores, l.house_sleep, l.house_drink,
                        l.we_are, l.we_prefer, l.my_gender, l.prefer_gender
                    FROM listings l
                    WHERE l.id = %s
                """, [listing_id])
                
                columns = [col[0] for col in cursor.description]
                row = cursor.fetchone()
                
                if not row:
                    return JsonResponse({'error': 'Listing not found'}, status=404)
                
                listing = dict(zip(columns, row))
            
            # Verify ownership
            if listing['user_id'] != int(user_id):
                return JsonResponse({'error': 'You do not have permission to view this listing for editing'}, status=403)
            
            # Get photos
            photos = _get_photos_for_listings([listing_id])
            photo_paths = photos.get(listing_id, [])
            
            # Get media URL from settings (supports both local and R2 storage)
            media_url = getattr(settings, 'MEDIA_URL', '/media/')
            base_url = f"{request.scheme}://{request.get_host()}"
            
            if photo_paths:
                if media_url.startswith('http'):
                    # R2 or external storage
                    photo_urls = [f"{media_url}{path}" for path in photo_paths]
                else:
                    # Local storage
                    photo_urls = [f"{base_url}{media_url}{path}" for path in photo_paths]
            else:
                photo_urls = []
            
            # Return raw data for form population
            listing_data = {
                'id': listing['id'],
                'listing_title': listing.get('listing_title') or '',
                'address': listing.get('address') or '',
                'zip': listing.get('zip') or '',
                'unit': listing.get('unit') or '',
                'beds': listing.get('beds') or '',
                'baths': listing.get('baths') or '',
                'rent': listing.get('rent') or '',
                'utilities': listing.get('utilities') or '',
                'pets': listing.get('pets') or '',
                'details': listing.get('details') or '',
                'date_avail': _safe_date_str(listing.get('date_avail')) or '',
                'contact_name': listing.get('contact_name') or '',
                'contact_email': listing.get('contact_email') or '',
                'contact_number': listing.get('contact_number') or '',
                'location': listing.get('location') or '',
                'building_type': listing.get('building_type') or 'Apartment',
                'furnished': listing.get('furnished') or '',
                'laundry': listing.get('laundry') or '',
                'parking': listing.get('parking') or '',
                'latLng': listing.get('latLng') or '',
                'physicalAddress': listing.get('physicalAddress') or '',
                'typeCode': listing.get('typeCode') or 1,
                'rent_type': listing.get('rent_type') or 'total',
                'total_beds': listing.get('total_beds') or '',
                'perfect_for': listing.get('perfect_for') or '',
                'lease_length': str(listing.get('lease_length')) if listing.get('lease_length') else '',
                'tenant_lease_end': _safe_date_str(listing.get('tenant_lease_end')) or '',
                'dishwasher': listing.get('dishwasher') or '',
                'fireplace': listing.get('fireplace') or '',
                'porch': listing.get('porch') or '',
                'smoking': listing.get('smoking') or '',
                'is_season': listing.get('is_season') or '',
                'textOk': bool(listing.get('textOk')),
                'house_kitchen': listing.get('house_kitchen') or '',
                'house_chores': listing.get('house_chores') or '',
                'house_sleep': listing.get('house_sleep') or '',
                'house_drink': listing.get('house_drink') or '',
                'we_are': listing.get('we_are') or '',
                'we_prefer': listing.get('we_prefer') or '',
                'my_gender': listing.get('my_gender') or '',
                'prefer_gender': listing.get('prefer_gender') or '',
                'images': photo_urls,
            }
            
            return JsonResponse({'listing': listing_data})
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def landlord_listings(request):
    """Get all listings for a specific landlord (user_id)"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            if not user_id:
                return JsonResponse({'error': 'user_id is required'}, status=400)
            
            # Get all listings for the user, including invisible ones
            # Pass visible=False to disable the default "visible=1" filter
            listings = _get_raw_listings(visible=False, user_id=user_id)
            listings_data = _format_listings_data(listings, request)
            
            return JsonResponse({
                'listings': listings_data,
                'count': len(listings_data)
            })
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


# ==================== ADMIN LISTING APPROVAL ENDPOINTS ====================

def _verify_admin(request):
    """Verify if the request is from an admin user (user_level >= 10)"""
    user_id = request.GET.get('admin_user_id') or request.POST.get('admin_user_id')
    if not user_id:
        # Try to get from JSON body
        try:
            data = json.loads(request.body)
            user_id = data.get('admin_user_id')
        except:
            pass
    
    if not user_id:
        return False, "admin_user_id is required"
    
    with connection.cursor() as cursor:
        cursor.execute("SELECT user_level FROM users WHERE user_id = %s", [user_id])
        row = cursor.fetchone()
        if not row:
            return False, "User not found"
        if row[0] < 10:  # user_level >= 10 = admin
            return False, "Insufficient permissions"
    
    return True, None


def admin_pending_listings(request):
    """Get all pending listings for admin review"""
    if request.method == 'GET':
        try:
            # Verify admin
            is_admin, error = _verify_admin(request)
            if not is_admin:
                return JsonResponse({'error': error}, status=403)
            
            # Get all pending listings
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        l.id, l.listing_title, l.address, l.zip, l.unit, l.beds, l.baths, l.rent, 
                        l.utilities, l.pets, l.details, l.date_avail, l.date_created, 
                        l.date_expires, l.contact_name, l.contact_number, l.contact_email,
                        l.visible, l.featured, l.location, l.perfect_for, l.building_type,
                        l.furnished, l.lease_length, l.tenant_lease_end, l.fireplace,
                        l.dishwasher, l.laundry, l.porch, l.parking, l.smoking,
                        l.is_season, l.total_beds, l.typeCode, l.latLng, l.physicalAddress,
                        l.textOk, l.rent_type, l.cover_photo_id, l.user_id,
                        l.stripe_payment_method_id, l.approval_status, l.admin_feedback
                    FROM listings l
                    WHERE l.visible = 0 AND l.approval_status = 'pending'

                    ORDER BY l.date_created DESC
                    LIMIT 100
                """)
                columns = [col[0] for col in cursor.description]
                listings = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            listings_data = _format_listings_data(listings, request)
            
            return JsonResponse({
                'listings': listings_data,
                'count': len(listings_data),
                'type': 'pending'
            })
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def admin_approve_listing(request, listing_id):
    """Approve a pending listing and charge subscription"""
    if request.method == 'POST':
        try:
            # Verify admin
            is_admin, error = _verify_admin(request)
            if not is_admin:
                return JsonResponse({'error': error}, status=403)
            
            # Check listing exists and get payment details
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT visible, stripe_payment_method_id, user_id, typeCode, social_media_posting 
                    FROM listings WHERE id = %s
                """, [listing_id])
                row = cursor.fetchone()
                if not row:
                    return JsonResponse({'error': 'Listing not found'}, status=404)
                
                current_visible, payment_method_id, user_id, type_code, social_media_posting = row
                
                if current_visible == 1:
                    return JsonResponse({'message': 'Listing is already visible', 'listing_id': listing_id})

            # Check if payment method exists (Setup Intent flow)
            if not payment_method_id:
                return JsonResponse({
                    'error': 'No payment method found on file. Landlord must submit payment info first.',
                    'code': 'missing_payment_method'
                }, status=400)


            # Get User to get Customer ID
            with connection.cursor() as cursor:
                cursor.execute("SELECT stripe_customer_id, user_email FROM users WHERE user_id = %s", [user_id])
                user_row = cursor.fetchone()
                stripe_customer_id, user_email = user_row if user_row else (None, None)

            if not stripe_customer_id:
                 return JsonResponse({'error': 'User has no Stripe Customer ID'}, status=400)

            # Determine Price ID
            # Assuming standard price for now, or feature logic
            price_id = os.getenv('STRIPE_PRICE_STANDARD') or os.getenv('STRIPE_SUBSCRIPTION_PRICE_ID')
            if not price_id:
                 return JsonResponse({'error': 'Subscription Price not configured'}, status=500)

            # Social Media Price ID
            social_price_id = os.getenv('STRIPE_PRICE_SOCIAL_MEDIA')
            
            # Build subscription items
            subscription_items = [{'price': price_id}]
            if social_media_posting and social_price_id:
                subscription_items.append({'price': social_price_id})

            # CREATE SUBSCRIPTION & CHARGE
            try:
                # This will charge the card immediately
                subscription = stripe.Subscription.create(
                    customer=stripe_customer_id,
                    items=subscription_items,
                    default_payment_method=payment_method_id,
                    metadata={'listing_ids': str(listing_id)},
                    expand=['latest_invoice.payment_intent']
                )
                
                # Check payment status
                invoice = subscription.latest_invoice
                payment_intent = invoice.payment_intent if invoice else None
                
                if payment_intent and payment_intent.status == 'succeeded':
                     pass # Good
                elif subscription.status != 'active':
                     return JsonResponse({'error': f'Payment failed. Subscription status: {subscription.status}'}, status=400)

            except stripe.error.CardError as e:
                return JsonResponse({'error': f'Card declined: {e.user_message}'}, status=400)
            except stripe.error.InvalidRequestError as e:
                return JsonResponse({'error': f'Stripe request error: {str(e)}'}, status=400)
            except stripe.error.StripeError as e:
                return JsonResponse({'error': f'Stripe service error: {str(e)}'}, status=502)
            except Exception as e:
                import traceback
                return JsonResponse({'error': f'Internal error: {str(e)}', 'traceback': traceback.format_exc()}, status=500)
            
            # Approve the listing (make visible & public)
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE listings 
                    SET visible = 1, 
                        is_public = 1,
                        approval_status = 'approved',
                        stripe_subscription_id = %s
                    WHERE id = %s
                """, [subscription.id, listing_id])
            
            # TRIGGER SOCIAL MEDIA POSTING IF SELECTED
            if social_media_posting:
                try:
                    print(f"DEBUG: Triggering social media post for listing {listing_id}")
                    # Ideally we'd call the manager directly here
                    from .social_utils import MetaSocialManager
                    # Re-fetch formatted data
                    from .views import _get_raw_listings, _format_listings_data
                    raw_listing_data = _get_raw_listings(visible='all', filters={'id': listing_id})
                    if raw_listing_data:
                        formatted = _format_listings_data(raw_listing_data)[0]
                        manager = MetaSocialManager()
                        manager.post_listing(formatted)
                except Exception as e:
                    print(f"SOCIAL MEDIA POSTING ERROR: {e}")

            return JsonResponse({
                'message': 'Listing approved and charged successfully',
                'listing_id': listing_id,
                'subscription_id': subscription.id
            })
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def admin_request_changes(request, listing_id):
    """Request changes for a listing"""
    if request.method == 'POST':
        try:
            # Verify admin
            is_admin, error = _verify_admin(request)
            if not is_admin:
                return JsonResponse({'error': error}, status=403)
            
            data = json.loads(request.body)
            feedback = data.get('feedback', '')
            
            if not feedback:
                 return JsonResponse({'error': 'Feedback is required'}, status=400)
            
            # Update listing status
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE listings 
                    SET approval_status = 'changes_requested',
                        admin_feedback = %s,
                        visible = 0
                    WHERE id = %s
                """, [feedback, listing_id])
            
            return JsonResponse({
                'message': 'Changes requested successfully',
                'listing_id': listing_id
            })
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
def admin_reject_listing(request, listing_id):
    """Reject a pending listing"""
    if request.method == 'POST':
        try:
            # Verify admin
            is_admin, error = _verify_admin(request)
            if not is_admin:
                return JsonResponse({'error': error}, status=403)
            
            # Check listing exists
            with connection.cursor() as cursor:
                cursor.execute("SELECT visible FROM listings WHERE id = %s", [listing_id])
                row = cursor.fetchone()
                if not row:
                    return JsonResponse({'error': 'Listing not found'}, status=404)
                
                current_visible = row[0]
                if current_visible == 0:
                    return JsonResponse({'message': 'Listing is already hidden', 'listing_id': listing_id})
            
            # Reject the listing (make invisible)
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE listings 
                    SET visible = 0 
                    WHERE id = %s
                """, [listing_id])
            
            return JsonResponse({
                'message': 'Listing rejected successfully',
                'listing_id': listing_id
            })
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
