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

- **Python 3.11** (Required for stable Pydantic v2 builds)
- InfluxDB 2.x running and accessible
- InfluxDB organization and bucket created

### 2. Install Dependencies

It is recommended to use `uv` for lightning-fast environment management and automatic Python version handling.

```bash
cd backend

# Create .venv with Python 3.11
uv venv .venv --python 3.11

# Install dependencies using uv
uv pip install -r requirements.txt --python .venv/Scripts/python.exe
```

*Note: If you are not using uv, ensure you use py -3.11 -m venv .venv*

### 3. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your InfluxDB credentials:

```env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-actual-token
INFLUXDB_ORG=your-org-name
INFLUXDB_BUCKET=predictiox
```

### 4. Run the Server

```bash
# Activation (Windows)
.venv\Scripts\activate

# Run the server
python run.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check

```http
GET /api/health
```
**Response:** `{"status": "ok"}`

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
