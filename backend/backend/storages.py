"""
Custom Storage Backend for Cloudflare R2

Cloudflare R2 is S3-compatible, so we use django-storages' S3Boto3Storage
with a custom endpoint URL pointing to Cloudflare R2.
"""

from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings


class R2Storage(S3Boto3Storage):
    """
    Custom storage backend for Cloudflare R2.
    
    R2 uses the S3 API, so we extend S3Boto3Storage with R2-specific configuration.
    """
    
    def __init__(self, *args, **kwargs):
        # Set R2-specific defaults
        kwargs.setdefault('access_key', getattr(settings, 'R2_ACCESS_KEY_ID', None))
        kwargs.setdefault('secret_key', getattr(settings, 'R2_SECRET_ACCESS_KEY', None))
        kwargs.setdefault('bucket_name', getattr(settings, 'R2_BUCKET_NAME', None))
        kwargs.setdefault('endpoint_url', getattr(settings, 'R2_ENDPOINT_URL', None))
        kwargs.setdefault('custom_domain', getattr(settings, 'R2_CUSTOM_DOMAIN', None))
        
        # R2 doesn't support ACLs, so we need to disable them
        kwargs.setdefault('default_acl', None)
        kwargs.setdefault('querystring_auth', False)  # Use public URLs
        
        # Set file overwrite behavior
        kwargs.setdefault('file_overwrite', False)
        
        # Set cache control for browser caching
        kwargs.setdefault('object_parameters', {
            'CacheControl': 'max-age=31536000'  # 1 year cache
        })
        
        super().__init__(*args, **kwargs)
    
    def url(self, name):
        """
        Return the public URL for a file.
        
        If a custom domain is set (R2_PUBLIC_URL), use that instead of 
        the S3-style URL for cleaner public access.
        """
        if self.custom_domain:
            # Use custom domain for public URLs
            return f"https://{self.custom_domain}/{name}"
        return super().url(name)


class R2StaticStorage(R2Storage):
    """
    Storage backend for static files on R2.
    Use this if you want to serve static files from R2 as well.
    """
    location = 'static'
    default_acl = None


class R2MediaStorage(R2Storage):
    """
    Storage backend for media files on R2.
    This is the main storage class for user uploads.
    """
    location = ''  # Store at bucket root or set to 'media' if preferred
    default_acl = None
