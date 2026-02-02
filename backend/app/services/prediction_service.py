"""
Business logic for sensor data operations.
Handles writing to and querying from InfluxDB.
"""
import os
from datetime import datetime
from typing import Optional, Dict, Any, List
from influxdb_client import Point
from influxdb_client.client.exceptions import InfluxDBError

from ..core.influx import InfluxDBManager
from ..models.schemas import SensorDataRequest


class PredictionService:
    """Service layer for sensor prediction data operations."""
    
    MEASUREMENT = "sensor_predictions"
    
    def __init__(self):
        """Initialize service with InfluxDB configuration."""
        self.bucket = os.getenv("INFLUX_BUCKET")
        self.org = os.getenv("INFLUX_ORG")
        
        if not self.bucket:
            raise ValueError("INFLUX_BUCKET environment variable is required")
        if not self.org:
            raise ValueError("INFLUX_ORG environment variable is required")
    
    def write_sensor_data(self, data: SensorDataRequest) -> datetime:
        """
        Write sensor data to InfluxDB.
        
        Args:
            data: Validated sensor data from request
            
        Returns:
            Timestamp when data was written
            
        Raises:
            InfluxDBError: If write operation fails
        """
        write_api = InfluxDBManager.get_write_api()
        timestamp = datetime.utcnow()
        
        # Create point with measurement, tags, and fields
        point = (
            Point(self.MEASUREMENT)
            .tag("sensor_id", data.sensorId)
            .tag("zone", data.zone)
            .field("value", data.value)
            .field("latency_ms", data.latencyMs)
            .time(timestamp)
        )
        
        try:
            write_api.write(bucket=self.bucket, org=self.org, record=point)
            return timestamp
        except InfluxDBError as e:
            raise InfluxDBError(f"Failed to write sensor data: {str(e)}")
    
    def get_latest_sensor_data(self, sensor_id: str) -> Optional[Dict[str, Any]]:
        """
        Query latest data point for a specific sensor.
        
        Args:
            sensor_id: Sensor identifier to query
            
        Returns:
            Dictionary with sensor data or None if not found
            
        Raises:
            InfluxDBError: If query operation fails
        """
        query_api = InfluxDBManager.get_query_api()
        
        # Flux query to get the latest record for the sensor
        query = f'''
        from(bucket: "{self.bucket}")
            |> range(start: -30d)
            |> filter(fn: (r) => r["_measurement"] == "{self.MEASUREMENT}")
            |> filter(fn: (r) => r["sensor_id"] == "{sensor_id}")
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> sort(columns: ["_time"], desc: true)
            |> limit(n: 1)
        '''
        
        try:
            result = query_api.query(org=self.org, query=query)
            
            # Parse result
            if not result or len(result) == 0:
                return None
            
            # Get first table and first record
            for table in result:
                for record in table.records:
                    return {
                        "sensor_id": record.values.get("sensor_id"),
                        "zone": record.values.get("zone"),
                        "value": record.values.get("value"),
                        "latency_ms": record.values.get("latency_ms"),
                        "timestamp": record.get_time()
                    }
            
            return None
            
        except InfluxDBError as e:
            raise InfluxDBError(f"Failed to query sensor data: {str(e)}")

    def get_sensor_history(self, sensor_id: str, minutes: int = 60) -> List[Dict[str, Any]]:
        """
        Query historical data for a specific sensor.
        
        Args:
            sensor_id: Sensor identifier to query
            minutes: Time range in minutes (default 60)
            
        Returns:
            List of data points
        """
        query_api = InfluxDBManager.get_query_api()
        
        query = f'''
        from(bucket: "{self.bucket}")
            |> range(start: -{minutes}m)
            |> filter(fn: (r) => r["_measurement"] == "{self.MEASUREMENT}")
            |> filter(fn: (r) => r["sensor_id"] == "{sensor_id}")
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> sort(columns: ["_time"], desc: false)
        '''
        
        try:
            result = query_api.query(org=self.org, query=query)
            history = []
            
            for table in result:
                for record in table.records:
                    history.append({
                        "sensor_id": record.values.get("sensor_id"),
                        "value": record.values.get("value"),
                        "timestamp": record.get_time()
                    })
            
            return history
            
        except InfluxDBError as e:
            raise InfluxDBError(f"Failed to query history: {str(e)}")
