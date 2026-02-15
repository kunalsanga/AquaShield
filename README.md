# Aquashield: Smart Community Health Monitoring System

Aquashield is an AI-powered platform for predicting water-borne disease outbreaks in rural Northeast India.

## Project Structure

- `backend/`: FastAPI application for predictions and data management.
- `scripts/`: ML training scripts and data generation.
- `frontend-src/`: Source code for the Next.js frontend (components and pages).

## Prerequisites

- Python 3.9+
- Node.js 18+
- Docker & Docker Compose (optional but recommended)

## Setup Instructions

### 1. Backend Setup

You can run the backend using Docker or locally.

**Using Docker:**
```bash
docker-compose up --build
```

uvicorn backend.app.main:app --reload

**Running Locally:**
1. Navigate to the root directory.
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Run the ML training script to generate the model:
   ```bash
   python scripts/train_model.py
   ```
4. Start the backend server:
   ```bash
   uvicorn backend.app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`. API Docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

The frontend has been initialized in the `web-client` directory.

1. Navigate to the frontend directory:
   ```bash
   cd web-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## Features

- **AI Prediction Engine**: Predicts Cholera, Typhoid, and Diarrhea cases based on water quality metrics (pH, Turbidity, etc.).
- **Interactive Dashboard**: Visualizes risk scores and historical trends.
- **REST API**: Fully documented API for data ingestion and prediction.
- **Scalable Architecture**: Dockerized services with PostgreSQL integration ready.

## API Endpoints

- `POST /api/v1/predict/`: Submit water quality data to get disease risk assessment.
- `POST /api/v1/sensor/`: Ingest IoT sensor data.
- `GET /api/v1/sensor/latest`: Get real-time sensor readings.

