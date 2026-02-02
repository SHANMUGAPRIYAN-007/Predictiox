# PredictionX Backend

Production-ready Python Flask backend for sensor data ingestion and querying with InfluxDB 2.x.

## Architecture

```
Sensors → Python Flask Backend → InfluxDB
React Frontend → Python Flask Backend → InfluxDB
```

**Key Design Principles:**
- Sensors never access InfluxDB directly
- Frontend never sees InfluxDB credentials
- All database access routed through service layer
- Clean separation of concerns (API → Service → Database)

## Project Structure

```
backend/
├── app/
│   ├── __init__.py            # Flask Application Factory
│   ├── config.py              # Configuration loading
│   ├── core/
│   │   └── influx.py          # InfluxDB client manager
│   ├── api/
│   │   ├── ingest.py          # Sensor ingestion Blueprint
│   │   ├── read.py            # Frontend query Blueprint
│   │   └── logs.py            # System logs Blueprint
│   ├── models/
│   │   └── schemas.py         # Pydantic (V2) request/response models
│   └── services/
│       └── prediction_service.py  # Business logic
├── run.py                     # Entry point (from backend root)
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

### 1. Prerequisites

- Python 3.9+
- InfluxDB 2.x running and accessible
- InfluxDB organization and bucket created

### 2. Install Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your InfluxDB credentials:

```env
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=your-actual-token
INFLUX_ORG=your-org-name
INFLUX_BUCKET=predictionx
```

### 4. Run the Server

```bash
# Development mode (with auto-reload)
python run.py

# Production mode
# Gunicorn is recommended for production (pip install gunicorn)
# gunicorn -w 4 -b 0.0.0.0:8000 "app:create_app('production')"
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check

```http
GET /
GET /health
```

### Sensor Ingestion (for sensors)

```http
POST /api/ingest
Content-Type: application/json

{
  "sensorId": "sensor_001",
  "zone": "zone_A",
  "value": 42.5,
  "latencyMs": 12.3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data ingested successfully",
  "sensorId": "sensor_001",
  "timestamp": "2026-01-30T14:18:38Z"
}
```

### Latest Sensor Data (for frontend)

```http
GET /api/latest/{sensor_id}
```

**Response (found):**
```json
{
  "sensorId": "sensor_001",
  "zone": "zone_A",
  "value": 42.5,
  "latencyMs": 12.3,
  "timestamp": "2026-01-30T14:18:38Z",
  "found": true
}
```

## Testing with curl

### Ingest sensor data:
```bash
curl -X POST http://localhost:8000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": "sensor_001",
    "zone": "zone_A",
    "value": 42.5,
    "latencyMs": 12.3
  }'
```

### Query latest data:
```bash
curl http://localhost:8000/api/latest/sensor_001
```
