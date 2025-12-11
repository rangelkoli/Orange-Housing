from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.db import connection
import json
from datetime import datetime, date


def _get_raw_listings(visible=True, type_code=None, filters=None):
    """Get listings directly from database to avoid Django ORM date parsing issues"""
    with connection.cursor() as cursor:
        # Build the query
        query = """
            SELECT 
                l.id, l.address, l.zip, l.unit, l.beds, l.baths, l.rent, 
                l.utilities, l.pets, l.details, l.date_avail, l.date_created, 
                l.date_expires, l.contact_name, l.contact_number, l.contact_email,
                l.visible, l.featured, l.location, l.perfect_for, l.building_type,
                l.furnished, l.lease_length, l.tenant_lease_end, l.fireplace,
                l.dishwasher, l.laundry, l.porch, l.parking, l.smoking,
                l.is_season, l.total_beds, l.typeCode, l.latLng, l.physicalAddress,
                l.textOk, l.rent_type, l.cover_photo_id, l.user_id
            FROM listings l
            WHERE 1=1
        """
        params = []
        
        if visible:
            query += " AND l.visible = 1"
        
        if type_code is not None:
            query += " AND l.typeCode = %s"
            params.append(type_code)
        
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
            SELECT listing_id, path FROM photos 
            WHERE listing_id IN ({placeholders})
            ORDER BY is_main DESC, photo_id ASC
        """, listing_ids)
        
        photos_by_listing = {}
        for row in cursor.fetchall():
            listing_id = row[0]
            path = row[1]
            if listing_id not in photos_by_listing:
                photos_by_listing[listing_id] = []
            photos_by_listing[listing_id].append(path)
        
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


def _format_listings_data(listings):
    """Format raw listing data for API response"""
    if not listings:
        return []
    
    # Get photos for all listings
    listing_ids = [l['id'] for l in listings]
    photos_by_listing = _get_photos_for_listings(listing_ids)
    
    placeholder_image = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop"
    
    listings_data = []
    for listing in listings:
        photo_urls = photos_by_listing.get(listing['id'], [])
        if not photo_urls:
            photo_urls = [placeholder_image]
        
        # Build title
        beds = listing.get('beds') or 0
        building_type = listing.get('building_type') or 'Apartment'
        title = f"{beds} Bed {building_type}"
        
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
            'utilities': listing.get('utilities'),
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
        })
    
    return listings_data


def listing_list(request):
    """Get all visible listings with their photos, with optional filtering"""
    if request.method == 'GET':
        try:
            filters = {k: v for k, v in request.GET.items()}
            listings = _get_raw_listings(visible=True, filters=filters)
            listings_data = _format_listings_data(listings)
            
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
            listings_data = _format_listings_data(listings)
            
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
            listings_data = _format_listings_data(listings)
            
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
            listings_data = _format_listings_data(listings)
            
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
                        l.id, l.address, l.zip, l.unit, l.beds, l.baths, l.rent, 
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
            
            listings_data = _format_listings_data(listings)
            
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
                        l.id, l.address, l.zip, l.unit, l.beds, l.baths, l.rent, 
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
            photo_urls = photos.get(listing_id, [])
            
            placeholder_image = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop"
            if not photo_urls:
                photo_urls = [placeholder_image]
            
            beds = listing.get('beds') or 0
            building_type = listing.get('building_type') or 'Apartment'
            
            listing_data = {
                'id': listing['id'],
                'title': f"{beds} Bed {building_type}",
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
                'utilities': listing.get('utilities'),
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
            date_avail = data.get('date_avail')
            date_expires = data.get('date_expires')
            if not date_expires:
                # Default to 3 months from now
                from datetime import timedelta
                date_expires = (date.today() + timedelta(days=90)).isoformat()
            
            # Insert the listing
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO listings (
                        address, zip, unit, beds, baths, rent, utilities, pets, details,
                        user_id, date_avail, date_created, date_expires, contact_name,
                        contact_number, contact_email, visible, featured, location,
                        building_type, furnished, laundry, parking, latLng, physicalAddress,
                        typeCode, rent_type
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, [
                    data.get('address'),
                    data.get('zip'),
                    data.get('unit', 0),
                    data.get('beds'),
                    data.get('baths'),
                    data.get('rent'),
                    data.get('utilities'),
                    data.get('pets'),
                    data.get('details'),
                    user_id,
                    date_avail,
                    date.today().isoformat(),
                    date_expires,
                    data.get('contact_name', ''),
                    data.get('contact_number'),
                    data.get('contact_email'),
                    1 if data.get('visible', True) else 0,
                    data.get('featured', 0),
                    data.get('location'),
                    data.get('building_type'),
                    data.get('furnished'),
                    data.get('laundry'),
                    data.get('parking'),
                    data.get('latLng'),
                    data.get('physicalAddress'),
                    data.get('typeCode', 1),
                    data.get('rent_type', 'perBed')
                ])
                
                listing_id = cursor.lastrowid
            
            return JsonResponse({
                'message': 'Listing created successfully',
                'listing': {
                    'id': listing_id,
                    'address': data.get('address')
                }
            }, status=201)
        except Exception as e:
            import traceback
            return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
