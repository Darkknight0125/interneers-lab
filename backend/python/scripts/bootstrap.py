# The purpose of this file is to load the django settings, to allow running the standalone scripts
# with the same environment as the APIs.

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_app.settings")
django.setup()