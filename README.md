<div align="center">

# 🌊 AquaShield

### Smart Community Health Monitoring System

**AI-powered platform for predicting water-borne disease outbreaks in rural Northeast India using 2024 CPCB Water Quality Datasets.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

</div>

---

## 📖 Overview

AquaShield is a full-stack ML-driven platform that monitors water quality metrics and predicts the outbreak risk of **Cholera**, **Typhoid**, and **Diarrhea** in rural communities. By analyzing core metrics like **pH, BOD, Dissolved Oxygen, and Coliform** from genuine Central Pollution Control Board (CPCB) data, AquaShield provides intuitive tools for the Public, alongside secure data-entry workflows for ASHA Workers and Health Officials.

---

## 🚀 Recent Major Updates: The Public Expansion

The application has recently undergone massive upgrades to provide a seamless, rich visual experience heavily powered by real-world datasets:

- **Central Pollution Control Board (CPCB) 2024 Dataset Integration**: Migrated the internal prediction engine from synthetic CSVs to authentic national-level river statistics. Includes a custom `prepare_dataset.py` pipeline that automatically synthesizes minimum/maximum bounds into actionable features (Turbidity, Target Output Cases, etc.).
- **Public Interactive Heatmap (`/map`)**: Added a Nationwide Water Quality Heatmap leveraging `react-leaflet`. Public users can see localized risks, and officials can switch between 50km radius markers and total-country overlap rendering.
- **Smart Geolocation Risk Checker (`/check-risk`)**: Public users can evaluate their exact contamination probability. Includes a custom `<MapSelector>` that allows them to pinpoint their location manually, use HTML5 Device Geolocation to auto-pan (`flyTo`), or automatically reverse-geocode district names in an autocomplete `<datalist>`.
- **Public Health Trends (`/stats`)**: Historical aggregation visually mapped out over dynamic `Recharts` graphs covering rolling weekly outbreak figures.
- **Modernized UI Engine**: Full theme persistence (Dark/Light mode support), fluid background wave computations (`WaterBackground`), dynamic awareness UI guidelines, and strict API layer optimizations.

---

## 🏗️ Project Structure

```
AquaShield/
├── backend/                    # FastAPI backend server
│   ├── app/
│   │   ├── api/endpoints/     # Route handlers (auth, dashboard, predict, sensor, users)
│   │   ├── core/              # Config & settings (RBAC)
│   │   ├── db/                # Database session & models
│   │   ├── models/            # SQLAlchemy ORM models
│   │   ├── schemas/           # Pydantic validation models
│   │   ├── main.py            # FastAPI entry point
│   │   └── ml_utils.py        # ML inference loading utilities
│   ├── ml_models/             # Random Forest/XGB Trained artifacts (.pkl)
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile
├── web-client/                 # Next.js 14 frontend environment
│   ├── src/
│   │   ├── app/               # App router pages
│   │   │   ├── check-risk/    # Location-based dynamic threat modeling
│   │   │   ├── map/           # National Heatmap & API overlay
│   │   │   ├── stats/         # Visual data reporting with Recharts
│   │   │   ├── dashboard/     # Official dashboard
│   │   │   ├── alerts/        # Realtime Alerts feed
│   │   │   ├── awareness/     # Contextual safety manuals
│   │   │   └── report/        # Map-integrated clinical reporting
│   │   ├── components/        # MapSelector, Navbar, UI Primitives
│   │   └── lib/               # Shared logic & mock fallback state
│   └── package.json
├── scripts/
│   ├── prepare_dataset.py     # Aggregates CPCB multi-row data
│   ├── generate_data.py       # Fallback mock generator
│   └── train_model.py         # Sklearn/XGB ingest compiler
├── WQuality_River-Data-2024.csv # Authentic CPCB national parameters
├── docker-compose.yml
└── .gitignore
```

---

## ✨ Features by Role

### 🔓 **Public (Unauthenticated)**
| Feature | Description |
|---|---|
| 📍 **Check Risk** | Find localized water risk via Device GPS, Map Pinpointing, or Search. |
| 🗺️ **India Heatmap** | Interactive Leaflet map displaying real-time National or Regional water states. |
| 📊 **Community Stats**| Visualize health outcomes (Diarrhea, Cholera, Typhoid cases). |
| 🆘 **Actionable Safety**| Dynamic `/awareness` tutorials that shift tone based on current risk states. |

### 🩺 **ASHA Worker / Community Health**
| Feature | Description |
|---|---|
| 📝 **Clinical Map Reports** | Form input heavily augmented by HTML5 Map interactions reverse geolocating clinics. |
| 🚨 **Local Alerts** | Review system-generated hazard thresholds. |

### 🏛️ **Official**
| Feature | Description |
|---|---|
| 📈 **Admin Dashboard** | Oversight panel analyzing system-wide stats and aggregate sensor deployments. |
| ⚙️ **User Management** | Future-proofed administration endpoints for local health workers. |

---

## 🛠️ Prerequisites

Make sure the following are installed on your system:

| Tool | Version |
|---|---|
| Python | 3.9+ |
| Node.js | 18+  |
| npm | 9+     |
| Git | Any    |

---

## 🚀 Quick Start (Local Development)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/kunalsanga/AquaShield.git
cd AquaShield
```

### Step 2 — Backend & ML Setup

#### 2a. Enable Environment & Install Dependencies

```bash
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r backend/requirements.txt
```

#### 2b. Prepare Dataset & Train Model

We have successfully migrated to the new CPCB dataset. You **must** run the preparation step to synthesize parameters before injecting them into the ML models.

```bash
python scripts/prepare_dataset.py
python scripts/train_model.py
```

#### 2c. Start the Backend Server

```bash
uvicorn backend.app.main:app --reload
```
✅ **API Running at:** `http://localhost:8000/docs`

---

### Step 3 — Frontend Setup

Open a **new terminal** window/tab:

```bash
cd web-client
npm install
npm run dev
```

✅ **Frontend Running at:** `http://localhost:3000`

---

## 🐳 Docker Deployment (Recommended)

Run the entire stack (backend + frontend + PostgreSQL) with a single command:

```bash
docker-compose up --build -d
```

| Service | URL |
|---|---|
| Web App | `http://localhost:3000` |
| API Docs | `http://localhost:8000/docs` |
| PostgreSQL | `postgresql://postgres:password@localhost:5432/aquashield` |

---

## 📡 Essential Endpoints Update

The Core API was vastly augmented to power the new map interactions:
- `GET /api/v1/dashboard/map-data?lat=X&lng=Y&radius_km=50.0&all_points=false`
Now safely handles public heatmapping logic and executes Haversine filters over live dataset snapshots. 

---

<div align="center">
Made with ❤️ for rural communities in Northeast India
</div>
