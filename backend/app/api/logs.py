"""
HTTP layer for system logs.
Handles GET /api/logs endpoint.
"""
from flask import Blueprint, jsonify

logs_bp = Blueprint('logs', __name__, url_prefix='/api')

# In-memory storage for demo purposes
MOCK_LOGS = [
    {"time": "5:51:23 PM", "message": "Anomaly Detected: Abnormal Vibration Pattern", "type": "anomaly"},
    {"time": "5:59:45 PM", "message": "Abnormal Vibration (Unbalance)", "type": "critical"},
    {"time": "5:59:48 PM", "message": "Temp rising above normal", "type": "normal"},
    {"time": "5:59:48 PM", "message": "Abnormal Vibration (Unbalance)", "type": "critical"},
    {"time": "6:01:12 PM", "message": "Temp rising above normal", "type": "normal"},
    {"time": "6:02:33 PM", "message": "System diagnostics completed", "type": "normal"},
    {"time": "6:05:15 PM", "message": "Anomaly Detected: Temperature Spike", "type": "anomaly"},
]

@logs_bp.route('/logs', methods=['GET'])
def get_system_logs():
    """
    Get all system logs.
    Currently returns mock data for demonstration.
    """
    return jsonify(MOCK_LOGS), 200
