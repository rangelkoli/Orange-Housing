"""
Django management command to migrate existing files from local storage to Cloudflare R2.

Usage:
    python manage.py migrate_to_r2

This command will:
1. Read all files from the local uploads directory
2. Upload each file to Cloudflare R2
3. Track progress and handle errors

Prerequisites:
- R2 credentials must be configured in environment variables
- boto3 must be installed (pip install boto3)
"""

import os
import mimetypes
from pathlib import Path
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

try:
    import boto3
    from botocore.exceptions import ClientError
except ImportError:
    boto3 = None


class Command(BaseCommand):
    help = 'Migrate existing media files from local storage to Cloudflare R2'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Simulate the migration without actually uploading files',
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=0,
            help='Limit the number of files to process (0 = no limit)',
        )
        parser.add_argument(
            '--skip',
            type=int,
            default=0,
            help='Skip the first N files (useful for resuming)',
        )

    def handle(self, *args, **options):
        if boto3 is None:
            raise CommandError('boto3 is not installed. Run: pip install boto3')

        # Check R2 configuration
        r2_access_key = getattr(settings, 'R2_ACCESS_KEY_ID', None)
        r2_secret_key = getattr(settings, 'R2_SECRET_ACCESS_KEY', None)
        r2_bucket = getattr(settings, 'R2_BUCKET_NAME', None)
        r2_account_id = getattr(settings, 'R2_ACCOUNT_ID', None)

        if not all([r2_access_key, r2_secret_key, r2_bucket, r2_account_id]):
            raise CommandError(
                'R2 credentials not configured. Set R2_ACCESS_KEY_ID, '
                'R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_ACCOUNT_ID in environment.'
            )

        # Get the uploads directory
        uploads_dir = Path(settings.BASE_DIR) / 'uploads'
        if not uploads_dir.exists():
            raise CommandError(f'Uploads directory not found: {uploads_dir}')

        dry_run = options['dry_run']
        limit = options['limit']
        skip = options['skip']

        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN - No files will be uploaded'))

        # Initialize R2 client
        endpoint_url = f"https://{r2_account_id}.r2.cloudflarestorage.com"
        
        s3_client = boto3.client(
            's3',
            endpoint_url=endpoint_url,
            aws_access_key_id=r2_access_key,
            aws_secret_access_key=r2_secret_key,
            region_name='auto',  # R2 uses 'auto' as region
        )

        # Get list of files
        files = list(uploads_dir.glob('*'))
        total_files = len(files)
        
        self.stdout.write(f'Found {total_files} files in {uploads_dir}')

        if skip > 0:
            files = files[skip:]
            self.stdout.write(f'Skipping first {skip} files, {len(files)} remaining')

        if limit > 0:
            files = files[:limit]
            self.stdout.write(f'Processing only {limit} files')

        uploaded = 0
        skipped = 0
        errors = 0

        for i, file_path in enumerate(files, 1):
            if not file_path.is_file():
                continue

            file_name = file_path.name
            
            # Guess content type
            content_type, _ = mimetypes.guess_type(str(file_path))
            if content_type is None:
                content_type = 'application/octet-stream'

            try:
                if dry_run:
                    self.stdout.write(f'[DRY RUN] Would upload: {file_name}')
                    uploaded += 1
                else:
                    # Check if file already exists in R2
                    try:
                        s3_client.head_object(Bucket=r2_bucket, Key=file_name)
                        self.stdout.write(f'[SKIP] Already exists: {file_name}')
                        skipped += 1
                        continue
                    except ClientError as e:
                        if e.response['Error']['Code'] != '404':
                            raise

                    # Upload file
                    with open(file_path, 'rb') as f:
                        s3_client.put_object(
                            Bucket=r2_bucket,
                            Key=file_name,
                            Body=f,
                            ContentType=content_type,
                            CacheControl='max-age=31536000',  # 1 year cache
                        )
                    
                    uploaded += 1
                    
                    if uploaded % 100 == 0:
                        self.stdout.write(
                            self.style.SUCCESS(f'Progress: {uploaded}/{len(files)} uploaded')
                        )

            except Exception as e:
                errors += 1
                self.stdout.write(
                    self.style.ERROR(f'Error uploading {file_name}: {e}')
                )

        # Summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(self.style.SUCCESS('Migration Complete'))
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(f'Total files found: {total_files}')
        self.stdout.write(f'Files uploaded: {uploaded}')
        self.stdout.write(f'Files skipped (already exist): {skipped}')
        self.stdout.write(f'Errors: {errors}')

        if errors > 0:
            self.stdout.write(
                self.style.WARNING(f'\n{errors} files failed to upload. Check the logs above.')
            )
