"""
FastAPI application entry point.
Configures app, CORS, routers, and lifecycle events.
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api import ingest, read, logs
from app.core.influx import InfluxDBManager


# ... (existing code) ...



# (Moved router registration to bottom)



# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup: Verify InfluxDB connection
    try:
        InfluxDBManager.get_client()
        print("✓ InfluxDB connection established")
    except Exception as e:
        print(f"✗ Failed to connect to InfluxDB: {e}")
        raise
    
    yield
    
    # Shutdown: Close InfluxDB connection
    InfluxDBManager.close()
    print("✓ InfluxDB connection closed")


# Create FastAPI application
app = FastAPI(
    title="PredictionX API",
    description="Production-ready backend for sensor data ingestion and querying",
    version="1.0.0",
    lifespan=lifespan
)


# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register routers
app.include_router(ingest.router)
app.include_router(read.router)
app.include_router(logs.router)


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint for health check."""
    return {
        "service": "PredictionX API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "influxdb": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=os.getenv("ENV", "production") == "development"
    )
