from django.db import models


class Alert(models.Model):
    """Alert model for user search notifications"""
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    beds = models.IntegerField()
    email = models.EmailField(max_length=255)
    search = models.IntegerField()
    delete_key = models.IntegerField()

    class Meta:
        db_table = 'alerts'
        managed = True

    def __str__(self):
        return f"Alert for {self.name or 'Unknown'} - {self.beds} beds"
