from .settings import *


GDAL_LIBRARY_PATH = r'/usr/lib/libgdal.so'
GEOS_LIBRARY_PATH = r'/usr/local/lib/libgeos_c.so'

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'pass',
        'HOST': 'db'
    },
}