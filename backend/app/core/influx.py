"""
InfluxDB client initialization and shared access.
Provides singleton client instance for write and query operations.
"""
import os
from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS




class InfluxDBManager:
    """Manages InfluxDB client connection and provides write/query API access."""
    
    _client = None
    _write_api = None
    _query_api = None
    
    @classmethod
    def get_client(cls) -> InfluxDBClient:
        """Get or create InfluxDB client instance."""
        if cls._client is None:
            url = os.getenv("INFLUXDB_URL", "http://localhost:8086")
            token = os.getenv("INFLUXDB_TOKEN")
            org = os.getenv("INFLUXDB_ORG")
            
            if not all([url, token, org]):
                raise ValueError(
                    "Missing required InfluxDB configuration. "
                    "Ensure INFLUXDB_URL, INFLUXDB_TOKEN, and INFLUXDB_ORG are set."
                )
            
            cls._client = InfluxDBClient(
                url=url,
                token=token,
                org=org
            )
        
        return cls._client
    
    @classmethod
    def get_write_api(cls):
        """Get write API instance with synchronous mode."""
        if cls._write_api is None:
            client = cls.get_client()
            cls._write_api = client.write_api(write_options=SYNCHRONOUS)
        
        return cls._write_api
    
    @classmethod
    def get_query_api(cls):
        """Get query API instance."""
        if cls._query_api is None:
            client = cls.get_client()
            cls._query_api = client.query_api()
        
        return cls._query_api
    
    @classmethod
    def close(cls):
        """Close InfluxDB client connection."""
        if cls._client is not None:
            cls._client.close()
            cls._client = None
            cls._write_api = None
            cls._query_api = None
