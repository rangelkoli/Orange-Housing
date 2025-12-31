from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Directory


def _format_directory_entry(entry):
    """Format a directory entry for API response"""
    return {
        'id': entry.id,
        'name': entry.name,
        'phone': entry.phone,
        'email': entry.email,
        'contact_name': entry.contact_name,
        'url': entry.url,
        'category': entry.category,
        'date_added': entry.date_added.isoformat() if entry.date_added else None,
        'date_modified': entry.date_modified.isoformat() if entry.date_modified else None,
    }


def landlord_list(request):
    """Get all landlord entries from the directory"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        landlords = Directory.objects.filter(category='Landlord').order_by('name')
        data = [_format_directory_entry(entry) for entry in landlords]
        return JsonResponse({
            'success': True,
            'count': len(data),
            'data': data
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def complex_list(request):
    """Get all complex entries from the directory"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        complexes = Directory.objects.filter(category='Complex').order_by('name')
        data = [_format_directory_entry(entry) for entry in complexes]
        return JsonResponse({
            'success': True,
            'count': len(data),
            'data': data
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def manager_list(request):
    """Get all manager entries from the directory"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        managers = Directory.objects.filter(category='Manager').order_by('name')
        data = [_format_directory_entry(entry) for entry in managers]
        return JsonResponse({
            'success': True,
            'count': len(data),
            'data': data
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def team_syracuse_list(request):
    """Get all Team Syracuse entries from the directory"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        team_syracuse = Directory.objects.filter(category='Team Syracuse').order_by('name')
        data = [_format_directory_entry(entry) for entry in team_syracuse]
        return JsonResponse({
            'success': True,
            'count': len(data),
            'data': data
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def business_list(request):
    """Get all business entries from the directory"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        businesses = Directory.objects.filter(category='Business').order_by('name')
        data = [_format_directory_entry(entry) for entry in businesses]
        return JsonResponse({
            'success': True,
            'count': len(data),
            'data': data
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def directory_list(request):
    """Get all entries from the directory with optional category filter"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        category = request.GET.get('category', None)
        
        if category:
            entries = Directory.objects.filter(category=category).order_by('name')
        else:
            entries = Directory.objects.all().order_by('category', 'name')
        
        data = [_format_directory_entry(entry) for entry in entries]
        return JsonResponse({
            'success': True,
            'count': len(data),
            'data': data
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def directory_detail(request, directory_id):
    """Get a single directory entry by ID"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        entry = Directory.objects.get(id=directory_id)
        return JsonResponse({
            'success': True,
            'data': _format_directory_entry(entry)
        })
    except Directory.DoesNotExist:
        return JsonResponse({'error': 'Directory entry not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
