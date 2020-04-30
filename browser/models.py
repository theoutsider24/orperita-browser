# Create your models here.
from django.contrib.gis.db import models


class WorldBorder(models.Model):
    # Regular Django fields corresponding to the attributes in the
    # world borders shapefile.
    name = models.CharField(max_length=80, null=True)
    identifier = models.IntegerField(null=True)

    mpoly = models.MultiPolygonField(srid=4326)

    # Returns the string representation of the model.
    def __str__(self):
        return self.name or str(self.identifier) or "null"


class River(models.Model):
    identifier = models.IntegerField(null=True)

    # GeoDjango-specific: a geometry field (MultiPolygonField)
    mpoly = models.MultiLineStringField(srid=4326)

    # Returns the string representation of the model.
    def __str__(self):
        return str(self.identifier) or "null"


class Lake(models.Model):
    name = models.CharField(max_length=80, null=True)
    identifier = models.IntegerField(null=True)
    mpoly = models.MultiPolygonField(srid=4326)

    def __str__(self):
        return self.name or str(self.identifier) or "null"


class Forest(models.Model):
    name = models.CharField(max_length=80, null=True)
    identifier = models.IntegerField(null=True)
    mpoly = models.MultiPolygonField(srid=4326)

    def __str__(self):
        return self.name or str(self.identifier) or "null"


class Province(models.Model):
    name = models.CharField(max_length=80, null=True)
    identifier = models.IntegerField(null=True)
    mpoly = models.MultiPolygonField(srid=4326)

    def __str__(self):
        return self.name or str(self.identifier) or "null"


class POI(models.Model):
    name = models.CharField(max_length=80, null=True)
    notes = models.CharField(max_length=256, null=True)
    identifier = models.IntegerField(null=True)
    mpoly = models.MultiPointField(srid=4326)

    def __str__(self):
        return self.name or str(self.identifier) or "null"
