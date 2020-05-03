import os
from django.contrib.gis.utils import LayerMapping
from .models import WorldBorder, River, Lake, POI, Forest, Province
from orperitabrowser.settings import MAP_DATA_ROOT

world_mapping = {
    'identifier': 'identifier',
    'name': 'name',
    'mpoly': 'MULTIPOLYGON',
}

river_mapping = {
    'identifier': 'identifier',
    'mpoly': 'MULTIPOLYGON',
}

lake_mapping = {
    'identifier': 'identifier',
    'name': 'name',
    'mpoly': 'MULTIPOLYGON',
}


forest_mapping = {
    'identifier': 'identifier',
    'name': 'name',
    'mpoly': 'MULTIPOLYGON',
}


poi_mapping = {
    'identifier': 'identifier',
    'name': 'name',
    'notes': 'notes',
    'mpoly': 'MULTIPOLYGON',
    'poi_class': 'poi_class'
}

base_dir = MAP_DATA_ROOT

loader = {
    "world": (WorldBorder,     os.path.join(base_dir, 'land_4326.shp'),      world_mapping),
    "river": (River,           os.path.join(base_dir, 'rivers_4326.shp'),    river_mapping),
    "lake": (Lake,             os.path.join(base_dir, 'lakes_4326.shp'),     lake_mapping),
    "poi": (POI,               os.path.join(base_dir, 'poi_4326.shp'),       poi_mapping),
    "forest": (Forest,         os.path.join(base_dir, 'forests_4326.shp'),   forest_mapping),
    "province": (Province,     os.path.join(base_dir, 'provinces_4326.shp'), forest_mapping),
}


def run(verbose=True):
    for data in loader.values():
        lm = LayerMapping(data[0], data[1], data[2],
                          source_srs=4326, transform=False)
        lm.save(strict=True, verbose=verbose)
