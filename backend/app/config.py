import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_secret_key')
    DEBUG = False
    TESTING = False
    
    # InfluxDB Config
    INFLUX_URL = os.environ.get('INFLUX_URL')
    INFLUX_TOKEN = os.environ.get('INFLUX_TOKEN')
    INFLUX_ORG = os.environ.get('INFLUX_ORG')
    INFLUX_BUCKET = os.environ.get('INFLUX_BUCKET')
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    pass

class TestingConfig(Config):
    TESTING = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
