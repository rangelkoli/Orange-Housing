from django.db import models


class Directory(models.Model):
    """Directory model for business/landlord/complex listings"""
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=10, null=True, blank=True)
    email = models.CharField(max_length=255, null=True, blank=True)
    contact_name = models.CharField(max_length=255, null=True, blank=True)
    url = models.CharField(max_length=255, null=True, blank=True)
    date_added = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True, null=True, blank=True)
    
    # Category choices
    CATEGORY_CHOICES = [
        ('Landlord', 'Landlord'),
        ('Manager', 'Manager'),
        ('Complex', 'Complex'),
        ('Business', 'Business'),
        ('Team Syracuse', 'Team Syracuse'),
    ]
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES)

    class Meta:
        db_table = 'directory'
        managed = True
        verbose_name_plural = 'Directories'

    def __str__(self):
        return f"{self.name or 'Unnamed'} ({self.category})"
