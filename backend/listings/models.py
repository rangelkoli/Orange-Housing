from django.db import models
from users.models import User


# ==================== LOOKUP TABLES ====================

class Location(models.Model):
    """Lookup table for neighborhood/area locations in Syracuse"""
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    city = models.CharField(max_length=100, default='Syracuse')
    state = models.CharField(max_length=2, default='NY')
    zip_prefix = models.CharField(max_length=5, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'lookup_locations'
        managed = True
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ListingType(models.Model):
    """Lookup table for listing types (Rental, Sublet, Room for Rent, etc.)"""
    
    id = models.AutoField(primary_key=True)
    code = models.PositiveSmallIntegerField(unique=True)  # Maps to old typeCode
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'lookup_listing_types'
        managed = True
        ordering = ['code']
    
    def __str__(self):
        return self.name


class BuildingType(models.Model):
    """Lookup table for building/property types"""
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'lookup_building_types'
        managed = True
        ordering = ['name']
    
    def __str__(self):
        return self.name


# ==================== MAIN MODELS ====================

class Listing(models.Model):
    """Property listing model matching the listings table in structure.sql"""
    
    id = models.AutoField(primary_key=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    zip = models.IntegerField(null=True, blank=True)
    unit = models.IntegerField(default=0)
    beds = models.IntegerField(null=True, blank=True)
    baths = models.CharField(max_length=3, null=True, blank=True)
    rent = models.IntegerField(null=True, blank=True)
    utilities = models.CharField(max_length=7, null=True, blank=True)
    pets = models.CharField(max_length=5, null=True, blank=True)
    details = models.TextField(null=True, blank=True)
    
    # Foreign key to User
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='listings',
        db_column='user_id'
    )
    
    # Dates
    date_avail = models.DateField(null=True, blank=True)
    date_created = models.DateField(auto_now_add=True)
    date_expires = models.DateField()
    
    # Contact information
    contact_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=10, null=True, blank=True)
    contact_email = models.CharField(max_length=255, null=True, blank=True)
    
    # Status fields
    visible = models.BooleanField(default=True)
    featured = models.IntegerField(default=0)
    
    # Location and property details (using lookup tables)
    location_ref = models.ForeignKey(
        Location,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='listings',
        db_column='location_ref_id'
    )
    location = models.CharField(max_length=255, null=True, blank=True)  # Keep original column
    
    perfect_for = models.CharField(max_length=255, null=True, blank=True)
    
    building_type_ref = models.ForeignKey(
        BuildingType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='listings',
        db_column='building_type_ref_id'
    )
    building_type = models.CharField(max_length=255, null=True, blank=True)  # Keep original column
    furnished = models.CharField(max_length=255, null=True, blank=True)
    lease_length = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    tenant_lease_end = models.DateField(null=True, blank=True)
    
    # Amenities
    fireplace = models.CharField(max_length=255, null=True, blank=True)
    dishwasher = models.CharField(max_length=255, null=True, blank=True)
    laundry = models.CharField(max_length=255, null=True, blank=True)
    porch = models.CharField(max_length=255, null=True, blank=True)
    parking = models.CharField(max_length=255, null=True, blank=True)
    smoking = models.CharField(max_length=255, null=True, blank=True)
    is_season = models.CharField(max_length=255, null=True, blank=True)
    
    # Roommate/house details
    total_beds = models.PositiveSmallIntegerField(null=True, blank=True)
    house_kitchen = models.CharField(max_length=255, null=True, blank=True)
    house_chores = models.CharField(max_length=255, null=True, blank=True)
    house_sleep = models.CharField(max_length=255, null=True, blank=True)
    house_clean = models.CharField(max_length=255, null=True, blank=True)
    house_drink = models.CharField(max_length=255, null=True, blank=True)
    we_are = models.CharField(max_length=255, null=True, blank=True)
    we_prefer = models.CharField(max_length=255, null=True, blank=True)
    beds_needed = models.PositiveSmallIntegerField(null=True, blank=True)
    i_am = models.CharField(max_length=255, null=True, blank=True)
    max_rent = models.SmallIntegerField(null=True, blank=True)
    my_gender = models.CharField(max_length=255, null=True, blank=True)
    prefer_gender = models.CharField(max_length=255, null=True, blank=True)
    
    # Spotlight and type (using lookup table)
    spotlightListing = models.DateField(null=True, blank=True, default='2010-01-01')
    listing_type = models.ForeignKey(
        ListingType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='listings',
        db_column='listing_type_id'
    )
    typeCode = models.PositiveSmallIntegerField(default=1)  # Keep for migration, maps to ListingType.code
    
    # Geographic and physical address
    latLng = models.CharField(max_length=20, null=True, blank=True)
    physicalAddress = models.CharField(max_length=255, null=True, blank=True)
    textOk = models.BooleanField(null=True, blank=True)
    
    # Rent type
    rent_type = models.CharField(max_length=255, default='perBed')
    
    # Cover photo
    cover_photo_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'listings'
        managed = True

    def __str__(self):
        return f"{self.address or 'No Address'} - ${self.rent or 0}/mo"


class Photo(models.Model):
    """Photo model for listing images"""
    
    photo_id = models.AutoField(primary_key=True)
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name='photos',
        db_column='listing_id'
    )
    name = models.CharField(max_length=255)
    path = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, default='')
    date_added = models.DateTimeField(auto_now_add=True)
    is_main = models.BooleanField(default=True)

    class Meta:
        db_table = 'photos'
        managed = True

    def __str__(self):
        return f"Photo {self.photo_id} for Listing {self.listing_id}"


class PendingListing(models.Model):
    """Pending listing model for listings awaiting approval"""
    
    id = models.AutoField(primary_key=True)
    date_added = models.DateField(auto_now_add=True)
    months = models.IntegerField()
    featured = models.CharField(max_length=255)
    spotlight = models.CharField(max_length=255)
    userId = models.IntegerField()  # Reference to user, kept as IntegerField to match schema

    class Meta:
        db_table = 'pending_listings'
        managed = True

    def __str__(self):
        return f"Pending Listing {self.id} - User {self.userId}"
