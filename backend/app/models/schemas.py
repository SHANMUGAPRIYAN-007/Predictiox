"""
Pydantic models for request/response validation.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


class SensorDataRequest(BaseModel):
    """Request model for sensor data ingestion."""
    
    sensorId: str = Field(..., min_length=1, description="Unique sensor identifier")
    zone: str = Field(..., min_length=1, description="Zone where sensor is located")
    value: float = Field(..., description="Sensor reading value")
    latencyMs: float = Field(..., ge=0, description="Latency in milliseconds")
    
    @field_validator('sensorId', 'zone')
    @classmethod
    def validate_not_empty(cls, v: str) -> str:
        """Ensure string fields are not empty after stripping."""
        if not v.strip():
            raise ValueError("Field cannot be empty or whitespace")
        return v.strip()
    
    class Config:
        json_schema_extra = {
            "example": {
                "sensorId": "sensor_001",
                "zone": "zone_A",
                "value": 42.5,
                "latencyMs": 12.3
            }
        }


class SensorDataResponse(BaseModel):
    """Response model for successful sensor data ingestion."""
    
    success: bool = True
    message: str = "Data ingested successfully"
    sensorId: str
    timestamp: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Data ingested successfully",
                "sensorId": "sensor_001",
                "timestamp": "2026-01-30T14:18:38Z"
            }
        }


class LatestSensorDataResponse(BaseModel):
    """Response model for latest sensor data query."""
    
    sensorId: str
    zone: Optional[str] = None
    value: Optional[float] = None
    latencyMs: Optional[float] = None
    timestamp: Optional[datetime] = None
    found: bool
    
    class Config:
        json_schema_extra = {
            "example": {
                "sensorId": "sensor_001",
                "zone": "zone_A",
                "value": 42.5,
                "latencyMs": 12.3,
                "timestamp": "2026-01-30T14:18:38Z",
                "found": True
            }
        }


class ErrorResponse(BaseModel):
    """Response model for errors."""
    
    success: bool = False
    error: str
    detail: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error": "Validation error",
                "detail": "sensorId cannot be empty"
            }
        }
