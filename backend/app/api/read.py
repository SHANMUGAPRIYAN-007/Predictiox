"""
HTTP layer for frontend data queries.
Handles GET /api/latest/{sensor_id} endpoint.
"""
from fastapi import APIRouter, HTTPException, status, Path
from influxdb_client.client.exceptions import InfluxDBError

from app.models.schemas import LatestSensorDataResponse, ErrorResponse
from app.services.prediction_service import PredictionService


router = APIRouter(prefix="/api", tags=["Read"])


@router.get(
    "/latest/{sensor_id}",
    response_model=LatestSensorDataResponse,
    status_code=status.HTTP_200_OK,
    responses={
        404: {"model": ErrorResponse, "description": "Sensor data not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Get latest sensor data",
    description="Retrieves the most recent data point for a specific sensor from InfluxDB"
)
async def get_latest_sensor_data(
    sensor_id: str = Path(..., description="Unique sensor identifier", min_length=1)
):
    """
    Get latest sensor data endpoint.
    
    Queries InfluxDB for the most recent data point for the specified sensor.
    Used by the React frontend to display current sensor readings.
    
    Args:
        sensor_id: Sensor identifier to query
        
    Returns:
        Latest sensor data or not found response
        
    Raises:
        HTTPException: On database errors
    """
    try:
        service = PredictionService()
        data = service.get_latest_sensor_data(sensor_id)
        
        if data is None:
            return LatestSensorDataResponse(
                sensorId=sensor_id,
                found=False
            )
        
        return LatestSensorDataResponse(
            sensorId=data["sensor_id"],
            zone=data["zone"],
            value=data["value"],
            latencyMs=data["latency_ms"],
            timestamp=data["timestamp"],
            found=True
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except InfluxDBError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )


@router.get("/history/{sensor_id}")
async def get_sensor_history(
    sensor_id: str = Path(..., min_length=1),
    minutes: int = 60
):
    """Get historical data for a sensor."""
    try:
        service = PredictionService()
        return service.get_sensor_history(sensor_id, minutes)
    except Exception as e:
        # Fallback for demo if Influx is empty/down
        return []

@router.get("/rul/{machine_id}")
async def get_rul_prediction(machine_id: str):
    """Get RUL prediction (Mock logic moved to backend)."""
    # In a real ML backend, this would call the model
    import random
    return {
        "machine_id": machine_id,
        "rul_percentage": random.randint(70, 95), # Mock value
        "status": "Healthy"
    }

@router.get("/power")
async def get_power_stats():
    """Get Power statistics (Mock logic)."""
    import random
    return {
        "efficiency": random.randint(85, 98),
        "power_usage": random.randint(200, 450),
        "eco_mode": False
    }
