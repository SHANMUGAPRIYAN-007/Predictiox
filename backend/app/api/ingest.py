"""
HTTP layer for sensor data ingestion.
Handles POST /api/ingest endpoint.
"""
from fastapi import APIRouter, HTTPException, status
from influxdb_client.client.exceptions import InfluxDBError

from app.models.schemas import SensorDataRequest, SensorDataResponse, ErrorResponse
from app.services.prediction_service import PredictionService


router = APIRouter(prefix="/api", tags=["Ingestion"])


@router.post(
    "/ingest",
    response_model=SensorDataResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Ingest sensor data",
    description="Receives sensor data from physical sensors and writes to InfluxDB"
)
async def ingest_sensor_data(data: SensorDataRequest):
    """
    Ingest sensor data endpoint.
    
    Validates incoming sensor data and writes it to InfluxDB.
    Sensors should POST to this endpoint with their readings.
    
    Args:
        data: Sensor data payload
        
    Returns:
        Success response with timestamp
        
    Raises:
        HTTPException: On validation or database errors
    """
    try:
        service = PredictionService()
        timestamp = service.write_sensor_data(data)
        
        return SensorDataResponse(
            sensorId=data.sensorId,
            timestamp=timestamp
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
