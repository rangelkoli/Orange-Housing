"""
Django management command to mark legacy users as having MD5 passwords.
Run this after importing old data from data.sql.
"""
from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = 'Mark existing users imported from old system as having MD5 passwords'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be updated without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        # Find users that don't have bcrypt hash format (bcrypt hashes start with $2)
        users_to_update = []
        
        for user in User.objects.all():
            # bcrypt hashes start with $2a$, $2b$, or $2y$
            is_bcrypt = user.user_pass.startswith('$2')
            
            if not is_bcrypt and user.password_type == User.PasswordType.BCRYPT:
                users_to_update.append(user)
        
        if dry_run:
            self.stdout.write(f'Would update {len(users_to_update)} users to MD5 password type:')
            for user in users_to_update[:10]:  # Show first 10
                self.stdout.write(f'  - {user.user_email}')
            if len(users_to_update) > 10:
                self.stdout.write(f'  ... and {len(users_to_update) - 10} more')
        else:
            count = 0
            for user in users_to_update:
                user.password_type = User.PasswordType.MD5
                user.save(update_fields=['password_type'])
                count += 1
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully updated {count} users to MD5 password type')
            )
