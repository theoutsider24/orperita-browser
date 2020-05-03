from django.core.management.base import BaseCommand, CommandError
from browser.models import POI, Province, Lake, WorldBorder, Forest, River
from browser.load import *


class Command(BaseCommand):
    help = 'Reloads all data'

    def handle(self, *args, **options):
        models = [item[0] for item in loader.values()]
        for model in models:
            model.objects.all().delete()
        run()
