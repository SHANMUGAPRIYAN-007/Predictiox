"""
HTTP layer for frontend data queries.
Handles GET /api/latest/{sensor_id} endpoint.
"""
from flask import Blueprint, jsonify, request
from influxdb_client.client.exceptions import InfluxDBError
import random

from ..services.prediction_service import PredictionService

read_bp = Blueprint('read', __name__, url_prefix='/api')

@read_bp.route('/latest/<sensor_id>', methods=['GET'])
def get_latest_sensor_data(sensor_id):
    """
    Get latest sensor data endpoint.
    Queries InfluxDB for the most recent data point for the specified sensor.
    """
    try:
        service = PredictionService()
        data = service.get_latest_sensor_data(sensor_id)
        
        if data is None:
            return jsonify({
                "sensorId": sensor_id,
                "found": False
            }), 404
        
        return jsonify({
            "sensorId": data["sensor_id"],
            "zone": data["zone"],
            "value": data["value"],
            "latencyMs": data["latency_ms"],
            "timestamp": data["timestamp"],
            "found": True
        }), 200
        
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except InfluxDBError as e:
        return jsonify({"success": False, "error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Unexpected error: {str(e)}"}), 500


@read_bp.route('/history/<sensor_id>', methods=['GET'])
def get_sensor_history(sensor_id):
    """Get historical data for a sensor."""
    try:
        minutes = request.args.get('minutes', default=60, type=int)
        service = PredictionService()
        history = service.get_sensor_history(sensor_id, minutes)
        return jsonify(history), 200
    except Exception:
        # Fallback for demo if Influx is empty/down
        return jsonify([]), 200

@read_bp.route('/rul/<machine_id>', methods=['GET'])
def get_rul_prediction(machine_id):
    """Get RUL prediction (Mock logic moved to backend)."""
    # In a real ML backend, this would call the model
    return jsonify({
        "machine_id": machine_id,
        "rul_percentage": random.randint(70, 95), # Mock value
        "status": "Healthy"
    }), 200

@read_bp.route('/power', methods=['GET'])
def get_power_stats():
    """Get Power statistics (Mock logic)."""
    return jsonify({
        "efficiency": random.randint(85, 98),
        "power_usage": random.randint(200, 450),
        "eco_mode": False
    }), 200
