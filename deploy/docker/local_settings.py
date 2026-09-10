import os

FRONTEND_HOST = os.getenv('FRONTEND_HOST', 'http://localhost')
PORTAL_NAME = os.getenv('PORTAL_NAME', 'Blue Penny')
PORTAL_DESCRIPTION = os.getenv('PORTAL_DESCRIPTION', 'Original shows from Blue Penny')
REDIS_LOCATION = os.getenv('REDIS_LOCATION', 'redis://redis:6379/1')

DEFAULT_THEME = 'dark'
GLOBAL_LOGIN_REQUIRED = True
LOGIN_ALLOWED = True
REGISTER_ALLOWED = True
USERS_CAN_SELF_REGISTER = True
UPLOAD_MEDIA_ALLOWED = False
CAN_ADD_MEDIA = 'advancedUser'
CAN_COMMENT = 'email_verified'
CAN_LIKE_MEDIA = True
CAN_DISLIKE_MEDIA = False
CAN_REPORT_MEDIA = True
CAN_SHARE_MEDIA = True
ALLOW_ANONYMOUS_ACTIONS = []
CAN_SEE_MEMBERS_PAGE = 'admins'
SIDEBAR_FOOTER_TEXT = 'Blue Penny Streaming'
EXTRA_CSS_PATHS = ['/static/css/blue-penny.css']

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv('POSTGRES_NAME', 'mediacms'),
        "HOST": os.getenv('POSTGRES_HOST', 'db'),
        "PORT": os.getenv('POSTGRES_PORT', '5432'),
        "USER": os.getenv('POSTGRES_USER', 'mediacms'),
        "PASSWORD": os.getenv('POSTGRES_PASSWORD', 'mediacms'),
        "OPTIONS": {
            "pool": {
                "min_size": 2,
                "max_size": 8,
                "timeout": 10,
                "max_lifetime": 30 * 60,
                "max_idle": 10 * 60,
            }
        },
    }
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_LOCATION,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}

BROKER_URL = REDIS_LOCATION
CELERY_RESULT_BACKEND = BROKER_URL

MP4HLS_COMMAND = "/home/mediacms.io/bento4/bin/mp4hls"

DEBUG = os.getenv('DEBUG', 'False') == 'True'
