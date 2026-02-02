from flask import Flask
from flask_cors import CORS
from .config import config
from .core.influx import InfluxDBManager

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    
    # Initialize Core (InfluxDB check)
    with app.app_context():
        try:
            InfluxDBManager.get_client()
            print("✓ InfluxDB connection established")
        except Exception as e:
            print(f"✗ Failed to connect to InfluxDB: {e}")
            # We don't raise here to allow app to start even if DB is down (unless critical)

    # Register Blueprints
    from .api.ingest import ingest_bp
    from .api.read import read_bp
    from .api.logs import logs_bp
    
    app.register_blueprint(ingest_bp)
    app.register_blueprint(read_bp)
    app.register_blueprint(logs_bp)
    
    @app.route('/health')
    def health_check():
        return {
            "status": "healthy",
            "influxdb": "connected"
        }
        
    @app.route('/')
    def root():
        return {
            "service": "PredictionX API",
            "status": "running",
            "version": "1.0.0"
        }

    return app
