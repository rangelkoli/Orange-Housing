from django.db import models


class Ad(models.Model):
    """Ad model for advertisements"""
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=10)
    description = models.TextField()
    url = models.CharField(max_length=255)
    expires = models.DateField()
    logo = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'ads'
        managed = True

    def __str__(self):
        return f"Ad: {self.name}"
