import json
import bcrypt
import hashlib
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import User


def verify_md5_password(password, stored_hash, salt):
    """
    Verify password using MD5 hash (legacy format).
    The old system used: MD5(password + salt)
    """
    # Try different MD5 combinations that might have been used
    combinations = [
        hashlib.md5((password + salt).encode('utf-8')).hexdigest(),
        hashlib.md5((salt + password).encode('utf-8')).hexdigest(),
        hashlib.md5(password.encode('utf-8')).hexdigest(),
    ]
    
    return stored_hash in combinations


def verify_bcrypt_password(password, stored_hash):
    """Verify password using bcrypt."""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
    except Exception:
        return False


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract fields
            email = data.get('email')
            password = data.get('password')
            first_name = data.get('firstName', '')
            last_name = data.get('lastName', '')
            contact_number = data.get('contactNumber', '')

            # Basic Validation
            if not email or not password:
                return JsonResponse({'error': 'Email and password are required'}, status=400)

            if User.objects.filter(user_email=email).exists():
                return JsonResponse({'error': 'Email already registered'}, status=400)

            # Hash password with bcrypt
            salt = bcrypt.gensalt()
            hashed_pass = bcrypt.hashpw(password.encode('utf-8'), salt)

            user = User(
                user_email=email,
                user_pass=hashed_pass.decode('utf-8'),
                user_salt=salt.decode('utf-8'),
                first_name=first_name,
                last_name=last_name,
                contact_number=contact_number,
                user_level=0,  # Default standard user
                user_banned=User.BannedStatus.NOT_BANNED,
                password_type=User.PasswordType.BCRYPT  # New users always use bcrypt
            )
            user.save()

            return JsonResponse({
                'message': 'User created successfully',
                'user': {
                    'id': user.user_id,
                    'email': user.user_email
                }
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'error': 'Email and password are required'}, status=400)

            try:
                user = User.objects.get(user_email=email)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)

            # Check if user is banned
            if user.user_banned == User.BannedStatus.BANNED:
                return JsonResponse({'error': 'Account is banned'}, status=403)

            password_valid = False
            requires_password_update = False

            # Check password based on password_type
            if user.password_type == User.PasswordType.BCRYPT:
                # Modern bcrypt password
                password_valid = verify_bcrypt_password(password, user.user_pass)
            else:
                # Legacy MD5 password - try to verify
                password_valid = verify_md5_password(password, user.user_pass, user.user_salt)
                if password_valid:
                    requires_password_update = True  # User needs to update password

            if password_valid:
                # Update login info
                now = timezone.now()
                user.user_last_login = user.user_login_time
                user.user_login_time = now
                user.save()

                response_data = {
                    'message': 'Login successful',
                    'user': {
                        'id': user.user_id,
                        'email': user.user_email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'is_banned': user.user_banned == User.BannedStatus.BANNED,
                        'user_level': user.user_level,
                    },
                    'requires_password_update': requires_password_update
                }

                if requires_password_update:
                    response_data['message'] = 'Login successful. Please update your password for improved security.'

                return JsonResponse(response_data)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def update_password(request):
    """
    Endpoint to update user password from MD5 to bcrypt.
    Requires the old password (for verification) and new password.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            old_password = data.get('oldPassword')
            new_password = data.get('newPassword')

            if not email or not old_password or not new_password:
                return JsonResponse({
                    'error': 'Email, old password, and new password are required'
                }, status=400)

            if len(new_password) < 8:
                return JsonResponse({
                    'error': 'New password must be at least 8 characters long'
                }, status=400)

            try:
                user = User.objects.get(user_email=email)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

            # Verify old password
            password_valid = False
            if user.password_type == User.PasswordType.BCRYPT:
                password_valid = verify_bcrypt_password(old_password, user.user_pass)
            else:
                password_valid = verify_md5_password(old_password, user.user_pass, user.user_salt)

            if not password_valid:
                return JsonResponse({'error': 'Current password is incorrect'}, status=401)

            # Hash new password with bcrypt
            salt = bcrypt.gensalt()
            hashed_pass = bcrypt.hashpw(new_password.encode('utf-8'), salt)

            # Update user
            user.user_pass = hashed_pass.decode('utf-8')
            user.user_salt = salt.decode('utf-8')
            user.password_type = User.PasswordType.BCRYPT
            user.user_modified = timezone.now()
            user.save()

            return JsonResponse({
                'message': 'Password updated successfully',
                'user': {
                    'id': user.user_id,
                    'email': user.user_email
                }
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def change_password(request):
    """
    Endpoint for authenticated users to change their password.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('userId')
            old_password = data.get('oldPassword')
            new_password = data.get('newPassword')

            if not user_id or not old_password or not new_password:
                return JsonResponse({
                    'error': 'User ID, old password, and new password are required'
                }, status=400)

            if len(new_password) < 8:
                return JsonResponse({
                    'error': 'New password must be at least 8 characters long'
                }, status=400)

            try:
                user = User.objects.get(user_id=user_id)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

            # Verify old password
            password_valid = False
            if user.password_type == User.PasswordType.BCRYPT:
                password_valid = verify_bcrypt_password(old_password, user.user_pass)
            else:
                password_valid = verify_md5_password(old_password, user.user_pass, user.user_salt)

            if not password_valid:
                return JsonResponse({'error': 'Current password is incorrect'}, status=401)

            # Hash new password with bcrypt
            salt = bcrypt.gensalt()
            hashed_pass = bcrypt.hashpw(new_password.encode('utf-8'), salt)

            # Update user
            user.user_pass = hashed_pass.decode('utf-8')
            user.user_salt = salt.decode('utf-8')
            user.password_type = User.PasswordType.BCRYPT
            user.user_modified = timezone.now()
            user.save()

            return JsonResponse({
                'message': 'Password changed successfully'
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)