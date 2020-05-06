# Generated by Django 3.0.5 on 2020-05-06 19:00

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('browser', '0013_poi_poi_class'),
    ]

    operations = [
        migrations.CreateModel(
            name='MountainShadow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mpoly', django.contrib.gis.db.models.fields.MultiPointField(srid=4326)),
            ],
        ),
    ]
