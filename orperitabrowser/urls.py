"""orperitabrowser URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib.gis import admin
from django.urls import path
from django.conf.urls import url
from djgeojson.views import GeoJSONLayerView
from browser.models import WorldBorder, River, Lake, POI, Forest, Province
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^$', TemplateView.as_view(template_name='index.html'), name='home'),
    url(r'^data.geojson/land$', GeoJSONLayerView.as_view(geometry_field='mpoly',
                                                         model=WorldBorder, srid=4326), name='land_data'),
    url(r'^data.geojson/river$', GeoJSONLayerView.as_view(geometry_field='mpoly',
                                                          model=River, srid=4326), name='river_data'),
    url(r'^data.geojson/lake$', GeoJSONLayerView.as_view(geometry_field='mpoly',
                                                         model=Lake, srid=4326), name='lake_data'),
    url(r'^data.geojson/poi$', GeoJSONLayerView.as_view(geometry_field='mpoly',
                                                        model=POI, srid=4326), name='poi_data'),
    url(r'^data.geojson/forest$', GeoJSONLayerView.as_view(geometry_field='mpoly',
                                                           model=Forest, srid=4326), name='forest_data'),
    url(r'^data.geojson/province$', GeoJSONLayerView.as_view(geometry_field='mpoly',
                                                             model=Province, srid=4326), name='province_data')

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
