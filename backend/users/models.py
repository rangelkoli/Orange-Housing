from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    user_name = models.CharField(max_length=24, unique=True, null=True, blank=True)
    user_email = models.EmailField(max_length=255, unique=True)
    user_pass = models.CharField(max_length=60)
    user_salt = models.CharField(max_length=32)
    user_last_login = models.DateTimeField(null=True, blank=True)
    user_login_time = models.DateTimeField(null=True, blank=True)
    user_session_id = models.CharField(max_length=40, null=True, blank=True)
    user_date = models.DateTimeField(auto_now_add=True)
    user_modified = models.DateTimeField(auto_now=True, null=True, blank=True)
    user_agent_string = models.CharField(max_length=32, null=True, blank=True)
    user_level = models.PositiveSmallIntegerField()
    
    class BannedStatus(models.TextChoices):
        NOT_BANNED = '0', 'Not Banned'
        BANNED = '1', 'Banned'

    user_banned = models.CharField(
        max_length=1,
        choices=BannedStatus.choices,
        default=BannedStatus.NOT_BANNED
    )
    
    passwd_recovery_code = models.CharField(max_length=60, null=True, blank=True)
    passwd_recovery_date = models.DateTimeField(null=True, blank=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=255)
    last_ip = models.CharField(max_length=45, null=True, blank=True)

    class Meta:
        db_table = 'users'
        managed = False  # Set to False if the table already exists and shouldn't be managed by Django migrations

    def __str__(self):
        return self.user_email
