"""
HTTP layer for sensor data ingestion.
Handles POST /api/ingest endpoint.
"""
from flask import Blueprint, request, jsonify
from influxdb_client.client.exceptions import InfluxDBError
from pydantic import ValidationError

from ..models.schemas import SensorDataRequest
from ..services.prediction_service import PredictionService

ingest_bp = Blueprint('ingest', __name__, url_prefix='/api')

@ingest_bp.route('/ingest', methods=['POST'])
def ingest_sensor_data():
    """
    Ingest sensor data endpoint.
    Retrieves sensor data from physical sensors and writes to InfluxDB.
    """
    try:
        # Validate request data using Pydantic
        json_data = request.get_json()
        if not json_data:
            return jsonify({"success": False, "error": "No input data provided"}), 400
            
        data = SensorDataRequest(**json_data)
        
        service = PredictionService()
        timestamp = service.write_sensor_data(data)
        
        return jsonify({
            "success": True,
            "message": "Data ingested successfully",
            "sensorId": data.sensorId,
            "timestamp": timestamp
        }), 201
        
    except ValidationError as e:
        return jsonify({"success": False, "error": "Validation error", "detail": str(e)}), 400
    except ValueError as e:
        return jsonify({"success": False, "error": "Value error", "detail": str(e)}), 400
    except InfluxDBError as e:
        return jsonify({"success": False, "error": "Database error", "detail": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": "Unexpected error", "detail": str(e)}), 500
