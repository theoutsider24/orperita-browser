#!/bin/bash

# Apply database migrations
python manage.py migrate

# Create super user (if doesn't already exist)
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@myproject.com', 'admin', first_name = 'System', last_name = 'Admin')" | python manage.py shell
# Collect static items for admin page
python manage.py collectstatic --no-input

# Set permissions to allow access for apache
chgrp -R www-data /code
chmod -R g+w /code

# Start server
echo "Starting server"
httpd -D FOREGROUND -f /etc/apache2/httpd.conf
