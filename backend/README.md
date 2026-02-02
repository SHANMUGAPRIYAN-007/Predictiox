# PredictionX Backend

Production-ready Python FastAPI backend for sensor data ingestion and querying with InfluxDB 2.x.

## Architecture

```
Sensors → Python FastAPI Backend → InfluxDB
React Frontend → Python FastAPI Backend → InfluxDB
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
│   ├── main.py                 # FastAPI app, CORS, routers
│   ├── core/
│   │   └── influx.py          # InfluxDB client manager
│   ├── api/
│   │   ├── ingest.py          # Sensor ingestion endpoint
│   │   └── read.py            # Frontend query endpoint
│   ├── models/
│   │   └── schemas.py         # Pydantic request/response models
│   └── services/
│       └── prediction_service.py  # Business logic
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
ENV=development python -m app.main

# Production mode
python -m app.main

# Or using uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000
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

**Response (not found):**
```json
{
  "sensorId": "sensor_999",
  "zone": null,
  "value": null,
  "latencyMs": null,
  "timestamp": null,
  "found": false
}
```

## InfluxDB Data Model

**Measurement:** `sensor_predictions`

**Tags:**
- `sensor_id` - Unique sensor identifier
- `zone` - Sensor zone/location

**Fields:**
- `value` - Sensor reading value (float)
- `latency_ms` - Latency in milliseconds (float)

**Timestamp:** Server time (UTC)

## Interactive API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

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

## Security Notes

- InfluxDB credentials are only in `.env` (never committed)
- Sensors only need the backend URL, not InfluxDB access
- Frontend only needs the backend URL, not InfluxDB access
- All database operations go through the service layer
- CORS is configured for your React frontend origin

## Production Deployment

1. Set `ENV=production` in `.env`
2. Use a production ASGI server (uvicorn with workers)
3. Set proper CORS origins for your frontend domain
4. Use HTTPS in production
5. Secure your `.env` file with proper permissions
6. Consider using environment variables from your hosting platform

Example production command:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Troubleshooting

**Connection Error:**
- Verify InfluxDB is running
- Check `INFLUX_URL` is correct
- Verify `INFLUX_TOKEN` has write/read permissions

**CORS Error:**
- Add your frontend URL to `CORS_ORIGINS` in `.env`

**Import Errors:**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`
