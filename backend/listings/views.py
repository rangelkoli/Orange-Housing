from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from .models import Listing, Photo
import json
from datetime import datetime, date


def _apply_filters(queryset, request):
    """Apply filters from query parameters to a listing queryset"""
    
    # Location filter
    location = request.GET.get('location')
    if location and location.lower() != 'all':
        queryset = queryset.filter(
            Q(location__icontains=location) | 
            Q(address__icontains=location) |
            Q(physicalAddress__icontains=location)
        )
    
    # Building type filter
    building_type = request.GET.get('buildingType')
    if building_type and 'all' not in building_type.lower():
        queryset = queryset.filter(building_type__icontains=building_type)
    
    # Bedrooms filter
    bedrooms = request.GET.get('bedrooms')
    if bedrooms and bedrooms.lower() != 'all':
        if bedrooms.lower() == 'studio':
            queryset = queryset.filter(beds=0)
        elif bedrooms.isdigit():
            queryset = queryset.filter(beds=int(bedrooms))
        elif 'bedroom' in bedrooms.lower():
            # Handle "1 Bedroom", "2 Bedrooms", "3+ Bedrooms" format
            num = ''.join(filter(str.isdigit, bedrooms))
            if num:
                if '+' in bedrooms:
                    queryset = queryset.filter(beds__gte=int(num))
                else:
                    queryset = queryset.filter(beds=int(num))
    
    # Max rent filter
    max_rent = request.GET.get('maxRent')
    if max_rent and max_rent.isdigit():
        queryset = queryset.filter(rent__lte=int(max_rent))
    
    # Pets filter
    pets = request.GET.get('pets')
    if pets and pets.lower() != 'all':
        if 'dogs' in pets.lower():
            queryset = queryset.filter(Q(pets__icontains='dogs') | Q(pets__icontains='yes') | Q(pets__icontains='allowed'))
        elif 'cats' in pets.lower():
            queryset = queryset.filter(Q(pets__icontains='cats') | Q(pets__icontains='yes') | Q(pets__icontains='allowed'))
        elif 'no' in pets.lower():
            queryset = queryset.filter(Q(pets__icontains='no') | Q(pets__isnull=True) | Q(pets=''))
    
    # Furnished filter
    furnished = request.GET.get('furnished')
    if furnished and furnished.lower() != 'all':
        if furnished.lower() == 'furnished':
            queryset = queryset.filter(Q(furnished__icontains='yes') | Q(furnished__icontains='full') | Q(furnished__iexact='furnished'))
        elif furnished.lower() == 'unfurnished':
            queryset = queryset.filter(Q(furnished__icontains='no') | Q(furnished__icontains='unfurnished') | Q(furnished__isnull=True))
        elif furnished.lower() == 'partial':
            queryset = queryset.filter(furnished__icontains='partial')
    
    # Perfect For filter
    perfect_for = request.GET.get('perfectFor')
    if perfect_for and perfect_for.lower() != 'all':
        queryset = queryset.filter(perfect_for__icontains=perfect_for)
    
    # Available date filter
    available_date = request.GET.get('availableDate')
    if available_date and available_date.lower() not in ['available now', 'immediate', '']:
        if available_date.lower() == 'next month':
            # Filter for listings available within next month
            today = date.today()
            next_month = date(today.year, today.month + 1 if today.month < 12 else 1, 1)
            queryset = queryset.filter(date_avail__lte=next_month)
        else:
            # Try to parse the date
            try:
                parsed_date = datetime.strptime(available_date, '%m/%d/%Y').date()
                queryset = queryset.filter(date_avail__lte=parsed_date)
            except ValueError:
                pass  # Invalid date format, skip filter
    
    # Search query (q) - searches across multiple fields
    search_query = request.GET.get('q')
    if search_query:
        queryset = queryset.filter(
            Q(address__icontains=search_query) |
            Q(physicalAddress__icontains=search_query) |
            Q(location__icontains=search_query) |
            Q(details__icontains=search_query) |
            Q(building_type__icontains=search_query) |
            Q(zip__icontains=search_query)
        )
    
    # Listing type filter (from activeTab)
    listing_type = request.GET.get('type')
    if listing_type:
        type_mapping = {
            'Rentals': 1,
            'ShortTerm': 4,  # Assuming short-term has typeCode 4
            'Sublets': 2,
            'RoomForRent': 3,
        }
        type_code = type_mapping.get(listing_type)
        if type_code:
            queryset = queryset.filter(typeCode=type_code)
    
    return queryset


def _get_listings_data(listings):
    """Helper function to format listing data for API response"""
    listings_data = []
    for listing in listings:
        # Get photos for this listing
        photos = listing.photos.all()
        photo_urls = [photo.path for photo in photos]
        
        # If no photos, use a placeholder
        if not photo_urls:
            photo_urls = ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop"]
        
        listings_data.append({
            'id': listing.id,
            'title': f"{listing.beds or 0} Bed {listing.building_type or 'Apartment'}" if not listing.physicalAddress else listing.address,
            'price': f"${listing.rent or 0}/mo",
            'beds': listing.beds or 0,
            'baths': listing.baths or "1",
            'address': listing.address or 'Address not provided',
            'city': f"Syracuse, NY {listing.zip or '13210'}",
            'images': photo_urls,
            'availableDate': str(listing.date_avail) if listing.date_avail else 'Available Now',
            # Additional fields for detail page
            'details': listing.details,
            'pets': listing.pets,
            'utilities': listing.utilities,
            'furnished': listing.furnished,
            'laundry': listing.laundry,
            'parking': listing.parking,
            'building_type': listing.building_type,
            'contact_name': listing.contact_name,
            'contact_email': listing.contact_email,
            'contact_number': listing.contact_number,
            'featured': listing.featured,
            'latLng': listing.latLng,
            'typeCode': listing.typeCode,
            'location': listing.location,
        })
    
    return listings_data


def listing_list(request):
    """Get all visible listings with their photos, with optional filtering"""
    if request.method == 'GET':
        try:
            listings = Listing.objects.filter(visible=True).select_related('user').prefetch_related('photos')
            
            # Apply filters from query parameters
            listings = _apply_filters(listings, request)
            
            listings_data = _get_listings_data(listings)
            
            return JsonResponse({
                'listings': listings_data,
                'count': len(listings_data),
                'filters_applied': {k: v for k, v in request.GET.items()}
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def rentals_list(request):
    """Get all visible rental listings (typeCode=1) with optional filtering"""
    if request.method == 'GET':
        try:
            listings = Listing.objects.filter(visible=True, typeCode=1).select_related('user').prefetch_related('photos')
            
            # Apply filters from query parameters
            listings = _apply_filters(listings, request)
            
            listings_data = _get_listings_data(listings)
            
            return JsonResponse({
                'listings': listings_data,
                'count': len(listings_data),
                'type': 'rentals',
                'filters_applied': {k: v for k, v in request.GET.items()}
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def sublets_list(request):
    """Get all visible sublet listings (typeCode=2) with optional filtering"""
    if request.method == 'GET':
        try:
            listings = Listing.objects.filter(visible=True, typeCode=2).select_related('user').prefetch_related('photos')
            
            # Apply filters from query parameters
            listings = _apply_filters(listings, request)
            
            listings_data = _get_listings_data(listings)
            
            return JsonResponse({
                'listings': listings_data,
                'count': len(listings_data),
                'type': 'sublets',
                'filters_applied': {k: v for k, v in request.GET.items()}
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def rooms_list(request):
    """Get all visible room for rent listings (typeCode=3) with optional filtering"""
    if request.method == 'GET':
        try:
            listings = Listing.objects.filter(visible=True, typeCode=3).select_related('user').prefetch_related('photos')
            
            # Apply filters from query parameters
            listings = _apply_filters(listings, request)
            
            listings_data = _get_listings_data(listings)
            
            return JsonResponse({
                'listings': listings_data,
                'count': len(listings_data),
                'type': 'rooms',
                'filters_applied': {k: v for k, v in request.GET.items()}
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)



def listing_detail(request, listing_id):
    """Get a single listing by ID"""
    if request.method == 'GET':
        try:
            listing = Listing.objects.select_related('user').prefetch_related('photos').get(id=listing_id)
            
            # Get photos for this listing
            photos = listing.photos.all()
            photo_urls = [photo.path for photo in photos]
            
            if not photo_urls:
                photo_urls = ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop"]
            
            listing_data = {
                'id': listing.id,
                'title': f"{listing.beds or 0} Bed {listing.building_type or 'Apartment'}",
                'price': f"${listing.rent or 0}/mo",
                'rent': listing.rent,
                'beds': listing.beds or 0,
                'baths': listing.baths or "1",
                'address': listing.address or 'Address not provided',
                'city': f"Syracuse, NY {listing.zip or '13210'}",
                'zip': listing.zip,
                'images': photo_urls,
                'availableDate': str(listing.date_avail) if listing.date_avail else 'Available Now',
                'details': listing.details,
                'pets': listing.pets,
                'utilities': listing.utilities,
                'furnished': listing.furnished,
                'laundry': listing.laundry,
                'parking': listing.parking,
                'building_type': listing.building_type,
                'contact_name': listing.contact_name,
                'contact_email': listing.contact_email,
                'contact_number': listing.contact_number,
                'featured': listing.featured,
                'latLng': listing.latLng,
                'physicalAddress': listing.physicalAddress,
                'lease_length': str(listing.lease_length) if listing.lease_length else None,
                'fireplace': listing.fireplace,
                'dishwasher': listing.dishwasher,
                'porch': listing.porch,
                'smoking': listing.smoking,
                'perfect_for': listing.perfect_for,
                'location': listing.location,
                'date_created': str(listing.date_created),
                'date_expires': str(listing.date_expires),
            }
            
            return JsonResponse({'listing': listing_data})
        except Listing.DoesNotExist:
            return JsonResponse({'error': 'Listing not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def listing_create(request):
    """Create a new listing"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # TODO: Get user from authentication
            # For now, we'll require user_id in the request
            user_id = data.get('user_id')
            if not user_id:
                return JsonResponse({'error': 'user_id is required'}, status=400)
            
            from users.models import User
            try:
                user = User.objects.get(user_id=user_id)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
            
            listing = Listing(
                user=user,
                address=data.get('address'),
                zip=data.get('zip'),
                unit=data.get('unit', 0),
                beds=data.get('beds'),
                baths=data.get('baths'),
                rent=data.get('rent'),
                utilities=data.get('utilities'),
                pets=data.get('pets'),
                details=data.get('details'),
                date_avail=data.get('date_avail'),
                date_expires=data.get('date_expires'),
                contact_name=data.get('contact_name', ''),
                contact_number=data.get('contact_number'),
                contact_email=data.get('contact_email'),
                visible=data.get('visible', True),
                featured=data.get('featured', 0),
                location=data.get('location'),
                building_type=data.get('building_type'),
                furnished=data.get('furnished'),
                laundry=data.get('laundry'),
                parking=data.get('parking'),
                latLng=data.get('latLng'),
                physicalAddress=data.get('physicalAddress'),
            )
            listing.save()
            
            return JsonResponse({
                'message': 'Listing created successfully',
                'listing': {
                    'id': listing.id,
                    'address': listing.address
                }
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
