"""
HTTP layer for system logs.
Handles GET /api/logs endpoint.
"""
from typing import List
from datetime import datetime
from fastapi import APIRouter, status
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["Logs"])

class SystemLog(BaseModel):
    time: str
    message: str
    type: str

# In-memory storage for demo purposes (would be InfluxDB/Postgres in full prod)
# Pre-populating with the sample data to match the UI
MOCK_LOGS = [
    {"time": "5:51:23 PM", "message": "Anomaly Detected: Abnormal Vibration Pattern", "type": "anomaly"},
    {"time": "5:59:45 PM", "message": "Abnormal Vibration (Unbalance)", "type": "critical"},
    {"time": "5:59:48 PM", "message": "Temp rising above normal", "type": "normal"},
    {"time": "5:59:48 PM", "message": "Abnormal Vibration (Unbalance)", "type": "critical"},
    {"time": "6:01:12 PM", "message": "Temp rising above normal", "type": "normal"},
    {"time": "6:02:33 PM", "message": "System diagnostics completed", "type": "normal"},
    {"time": "6:05:15 PM", "message": "Anomaly Detected: Temperature Spike", "type": "anomaly"},
]

@router.get(
    "/logs",
    response_model=List[SystemLog],
    status_code=status.HTTP_200_OK,
    summary="Get system logs",
    description="Retrieves recent system logs and anomalies"
)
async def get_system_logs():
    """
    Get all system logs.
    Currently returns mock data for demonstration.
    """
    return MOCK_LOGS
