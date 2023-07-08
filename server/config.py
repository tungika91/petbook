import os
from dotenv import load_dotenv
load_dotenv()

EMAIL = os.environ.get("GMAIL_EMAIL")
PASSWORD = os.environ.get("GMAIL_PASSWORD")
SQLALCHEMY_DATABASE_URI = os.environ.get("ELEPHANTSQL_URI") # toggle to PROGRESQL_URI for local database
# SQLALCHEMY_DATABASE_URI = os.environ.get("PROGRESQL_URI") # toggle to PROGRESQL_URI for local database
AWS_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_ACCESS_SECRET")
AWS_S3_BUCKET = os.environ.get("AWS_S3_BUCKET")
AWS_REGION = os.environ.get("AWS_REGION")

class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = '6523798hgnvdkjsrq09yias;lkjqt'
    # DATABASE
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # FLASK MAIL
    MAIL_SERVER='smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = EMAIL
    MAIL_PASSWORD = PASSWORD
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    
class ProductionConfig(Config):
    DEBUG = False

class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True

class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True

class TestingConfig(Config):
    TESTING = True