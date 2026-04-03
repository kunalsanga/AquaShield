<div align="center">

# 🌊 AquaShield

### Smart Community Health Monitoring System

**AI-powered platform for predicting water-borne disease outbreaks in rural Northeast India**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

</div>

---

## 📖 Overview

AquaShield is a full-stack AI platform that monitors water quality metrics from IoT sensors and uses machine learning models to predict the outbreak risk of **Cholera**, **Typhoid**, and **Diarrhea** in rural communities. It provides an interactive dashboard for health officials and community workers to take early preventive action.

---

## 🏗️ Project Structure

```
AquaShield/
├── backend/                    # FastAPI backend server
│   ├── app/
│   │   ├── api/               # Route handlers
│   │   ├── core/              # Config & settings
│   │   ├── db/                # Database session & models
│   │   ├── models/            # SQLAlchemy ORM models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── main.py            # FastAPI app entry point
│   │   └── ml_utils.py        # ML inference utilities
│   ├── ml_models/             # Trained ML model artifacts (.pkl)
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile
├── web-client/                 # Next.js 14 frontend
│   ├── src/
│   │   ├── app/               # App router pages
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── alerts/        # Alerts page
│   │   │   ├── awareness/     # Health awareness
│   │   │   └── report/        # Reports page
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/               # Utilities & mock data
│   │   └── types/             # TypeScript type definitions
│   ├── package.json
│   └── Dockerfile
├── scripts/
│   ├── generate_data.py       # Synthetic dataset generator
│   └── train_model.py         # ML model training script
├── water_pollution_disease.csv # Training dataset
├── docker-compose.yml
└── .gitignore
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Prediction Engine** | XGBoost models predicting Cholera, Typhoid & Diarrhea risk scores |
| 📊 **Interactive Dashboard** | Real-time charts for water quality metrics and risk trends |
| 🚨 **Alert System** | Automated risk-level alerts for health officials |
| 📡 **IoT Sensor API** | REST endpoints for ingesting live sensor data |
| 📋 **Report Generation** | Download detailed health & water quality reports |
| 🔐 **Secure API** | JWT-based authentication with bcrypt password hashing |
| 🐳 **Docker Support** | Full containerized deployment with Docker Compose |

---

## 🛠️ Prerequisites

Make sure the following are installed on your system:

| Tool | Version | Link |
|---|---|---|
| Python | 3.9+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Comes with Node.js |
| Git | Any | [git-scm.com](https://git-scm.com) |
| Docker *(optional)* | Latest | [docker.com](https://docker.com) |

---

## 🚀 Quick Start (Local Development)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/kunalsanga/AquaShield.git
cd AquaShield
```

---

### Step 2 — Backend Setup

#### 2a. Create a Python Virtual Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate it
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```

#### 2b. Install Python Dependencies

```bash
pip install -r backend/requirements.txt
```

#### 2c. Train the ML Models *(first-time only)*

This step reads `water_pollution_disease.csv` and generates the model `.pkl` files in `backend/ml_models/`.

```bash
python scripts/train_model.py
```

#### 2d. Start the Backend Server

```bash
uvicorn backend.app.main:app --reload
```

✅ Backend is now running at:
- **API Base:** `http://localhost:8000`
- **Interactive Docs (Swagger):** `http://localhost:8000/docs`
- **Alternative Docs (ReDoc):** `http://localhost:8000/redoc`

---

### Step 3 — Frontend Setup

Open a **new terminal** window/tab:

#### 3a. Navigate to the Frontend Directory

```bash
cd web-client
```

#### 3b. Install Node Dependencies

```bash
npm install
```

#### 3c. Start the Development Server

```bash
npm run dev
```

✅ Frontend is now running at:
- **Web App:** `http://localhost:3000`

---

## 🐳 Docker Deployment (Recommended)

Run the entire stack (backend + frontend + PostgreSQL) with a single command:

```bash
# Build and start all services
docker-compose up --build

# Run in detached (background) mode
docker-compose up --build -d

# Stop all services
docker-compose down
```

| Service | URL |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8000` |
| API Docs | `http://localhost:8000/docs` |
| PostgreSQL | `postgres://postgres:password@localhost:5432/aquashield` |

---

## ⚙️ Environment Variables

For local development, you can create a `.env` file in the project root. **Do not commit this file** — it is already in `.gitignore`.

```env
# Backend
DATABASE_URL=postgresql://postgres:password@localhost:5432/aquashield
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=aquashield
SECRET_KEY=your-very-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend (create web-client/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Note:** For local dev without Docker, the backend uses SQLite by default (`sql_app.db`). PostgreSQL is used when running via Docker Compose.

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/docs` | Swagger UI |
| `POST` | `/api/v1/predict/` | Get disease risk predictions from water quality data |
| `POST` | `/api/v1/sensor/` | Ingest IoT sensor readings |
| `GET` | `/api/v1/sensor/latest` | Fetch the latest sensor data |

### Example Prediction Request

```bash
curl -X POST "http://localhost:8000/api/v1/predict/" \
  -H "Content-Type: application/json" \
  -d '{
    "ph": 6.5,
    "turbidity": 4.2,
    "dissolved_oxygen": 7.1,
    "conductivity": 320.0,
    "temperature": 28.5
  }'
```

---

## ☁️ Cloud Deployment

### Frontend → Vercel / Netlify

1. Connect your GitHub repository.
2. Set the **Root Directory** to `web-client`.
3. Build command: `npm run build` | Output directory: `.next`
4. Add environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>`

### Backend → Render / Railway

1. Connect your GitHub repository.
2. Select **Python** as the environment.
3. Set **Root Directory** to `backend`.
4. Build Command: `pip install -r requirements.txt && python ../scripts/train_model.py`
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add all required environment variables.

---

## 🧪 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Recharts |
| **Backend** | FastAPI, Python 3.9+, Uvicorn |
| **ML Models** | Scikit-learn, XGBoost, Pandas, NumPy |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **ORM** | SQLAlchemy |
| **Auth** | JWT (python-jose) + bcrypt (passlib) |
| **Containerization** | Docker, Docker Compose |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ for rural communities in Northeast India
</div>
