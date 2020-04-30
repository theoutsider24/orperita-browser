from django.contrib.gis import admin

from .models import WorldBorder, Forest, Lake, Province, POI, River

admin.site.register(WorldBorder, admin.GeoModelAdmin)
admin.site.register(Forest, admin.GeoModelAdmin)
admin.site.register(Lake, admin.GeoModelAdmin)
admin.site.register(Province, admin.GeoModelAdmin)
admin.site.register(POI, admin.GeoModelAdmin)
admin.site.register(River, admin.GeoModelAdmin)
# Register your models here.
