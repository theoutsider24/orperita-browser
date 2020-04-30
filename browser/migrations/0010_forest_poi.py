# Generated by Django 3.0.5 on 2020-04-26 08:22

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('browser', '0009_lake'),
    ]

    operations = [
        migrations.CreateModel(
            name='Forest',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80, null=True)),
                ('identifier', models.IntegerField(null=True)),
                ('mpoly', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='POI',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80, null=True)),
                ('notes', models.CharField(max_length=256, null=True)),
                ('identifier', models.IntegerField(null=True)),
                ('mpoly', django.contrib.gis.db.models.fields.MultiPointField(srid=4326)),
            ],
        ),
    ]
