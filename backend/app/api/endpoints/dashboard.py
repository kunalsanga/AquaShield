"""
Dashboard endpoint — OFFICIAL role only.
Returns aggregated sensor and alert statistics.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
import csv
import os
import math
from typing import List, Optional
from ...db.session import get_db
from ...models.models import SensorLog, AlertLog
from ...core.deps import require_role

router = APIRouter()


@router.get(
    "/",
    summary="Fetch dashboard summary (OFFICIAL only)",
    dependencies=[Depends(require_role(["OFFICIAL"]))]
)
def get_dashboard(db: Session = Depends(get_db)):
    """
    Returns aggregated statistics for the dashboard.
    Restricted to users with the OFFICIAL role.
    """
    total_sensors = db.query(func.count(SensorLog.id)).scalar() or 0
    total_alerts = db.query(func.count(AlertLog.id)).scalar() or 0
    high_alerts = db.query(func.count(AlertLog.id)).filter(AlertLog.severity == "High").scalar() or 0

    latest_sensors = (
        db.query(SensorLog)
        .order_by(SensorLog.timestamp.desc())
        .limit(10)
        .all()
    )

    return {
        "total_sensor_readings": total_sensors,
        "total_alerts": total_alerts,
        "high_severity_alerts": high_alerts,
        "latest_readings": [
            {
                "id": s.id,
                "ph": s.ph,
                "turbidity": s.turbidity,
                "temperature": s.temperature,
                "dissolved_oxygen": s.dissolved_oxygen,
                "bod": s.bod,
                "coliform": s.coliform,
                "rainfall": s.rainfall,
                "timestamp": s.timestamp.isoformat() if s.timestamp else None,
            }
            for s in latest_sensors
        ],
    }

STATE_COORDS = {
    "HIMACHAL PRADESH": (31.1048, 77.1734),
    "PUNJAB": (31.1471, 75.3412),
    "UTTARAKHAND": (30.0668, 79.0193),
    "UTTAR PRADESH": (26.8467, 80.9462),
    "BIHAR": (25.0961, 85.3131),
    "JAMMU & KASHMIR": (33.7782, 76.5762),
    "WEST BENGAL": (22.9868, 87.8550),
    "JHARKHAND": (23.6102, 85.2799),
}

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat/2)**2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2)
    c = 2 * math.asin(math.sqrt(a))
    return R * c

# Cache dataset in memory
_cpcb_cache = []

def get_cpcb_dataset():
    global _cpcb_cache
    if _cpcb_cache:
        return _cpcb_cache
        
    CPCB_FILES = [
        "WQuality_River-Data-2024.csv",
        "Water_pond_tanks_2024.csv",
        "Water_Quality_Drains_STPs__WTPs_2024.csv",
        "Water_Quality_data_of_Med_Min_River_2024.csv",
        "groundwater.csv"
    ]
    
    for csv_path in CPCB_FILES:
        if not os.path.exists(csv_path):
            continue
            
        with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
            reader = csv.reader(f)
            for i, row in enumerate(reader):
                if i < 11: # Ignore generic CPCB headers
                    continue
                if len(row) < 5:
                    continue
                
                station_code = row[0]
                name = row[1].replace('\n', ' ')
                
                # State column floats around index 2 to 3 depending on the dataset
                state = row[2].replace('\n', ' ').strip().upper()
                if "TEMPERATURE" in state or state == "":
                    state = row[3].replace('\n', ' ').strip().upper() if len(row) > 3 else "UNKNOWN"
                
                # Approximate dynamic column grabbing
                try:
                    do = float(row[4]) if len(row) > 4 and row[4] else 6.0
                except:
                    do = 6.0
                    
                try:
                    ph = float(row[6]) if len(row) > 6 and row[6] else 7.0
                except:
                    ph = 7.0
                    
                try:
                    # BOD is generally deep down the row list
                    bod = float(row[-2]) if len(row) > 2 else 2.0
                    if bod > 100: bod = 2.0 # Safety constraint against formatting offset
                except:
                    bod = 2.0

                if bod > 8.0:
                    risk_level = "High"
                elif bod > 3.0:
                    risk_level = "Medium"
                else:
                    risk_level = "Low"

                # Assign approximate lat/lng based on state + hash jitter for spread
                base_lat, base_lng = STATE_COORDS.get(state, (22.3511, 78.6677)) # Defaults to India central
                
                jitter_lat = ((hash(name) % 100) - 50) * 0.05
                jitter_lng = ((hash(station_code) % 100) - 50) * 0.05
                
                _cpcb_cache.append({
                    "id": station_code + "_" + str(i),
                    "location_name": name,
                    "latitude": base_lat + jitter_lat,
                    "longitude": base_lng + jitter_lng,
                    "ph": ph,
                    "dissolved_oxygen": do,
                    "bod": bod,
                    "risk_level": risk_level,
                    "timestamp": "2024-01-01T00:00:00Z"
                })

    # Read synthetic massive model dataset
    synthetic_path = "water_pollution_disease.csv"
    if os.path.exists(synthetic_path):
        with open(synthetic_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)
            for i, row in enumerate(reader):
                if len(row) < 10: continue
                # Village,District,pH,Temperature,Dissolved_Oxygen,BOD,Coliform_Bacteria,Turbidity,Rainfall,Cholera_Cases...
                village, district = row[0], row[1].upper()
                try:
                    ph = float(row[2])
                    do = float(row[4])
                    bod = float(row[5])
                    cholera = int(row[9])
                except:
                    continue
                
                if bod > 6.0 or cholera > 5:
                    risk_level = "High"
                elif bod > 3.0 or cholera > 2:
                    risk_level = "Medium"
                else:
                    risk_level = "Low"
                    
                base_lat, base_lng = STATE_COORDS.get(district, (22.3511, 78.6677))
                lat = base_lat + (((hash(village + "lat") % 100) - 50) * 0.04)
                lng = base_lng + (((hash(village + "lng") % 100) - 50) * 0.04)
                
                _cpcb_cache.append({
                    "id": f"synth_{i}",
                    "location_name": f"{village}, {district}",
                    "latitude": lat,
                    "longitude": lng,
                    "ph": ph,
                    "dissolved_oxygen": do,
                    "bod": bod,
                    "risk_level": risk_level,
                    "timestamp": "2024-05-01T00:00:00Z"
                })
            
    # Load Sambalpur high-accuracy regional dataset directly into map cache
    sambalpur_path = "sambalpur_waterborne_disease_data.csv"
    if os.path.exists(sambalpur_path):
        with open(sambalpur_path, 'r', encoding='utf-8') as sf:
            s_reader = csv.reader(sf)
            next(s_reader)  # Skip header
            for row in s_reader:
                if len(row) < 15:
                    continue
                
                area = row[1]
                lat = float(row[2])
                lng = float(row[3])
                
                # Add micro-jitter so monthly data points spread out and create a Heatmap density effect
                jitter_lat = ((hash(row[11] + area) % 100) - 50) * 0.005
                jitter_lng = ((hash(area + row[11]) % 100) - 50) * 0.005
                
                lat += jitter_lat
                lng += jitter_lng

                ph = float(row[4])
                bod = float(row[5])
                do = float(row[6])
                cholera = int(row[12])
                diarrhea = int(row[14])
                
                # Dynamic risk evaluation incorporating exact outbreak case counts from dataset
                if bod > 6.0 or cholera > 3 or diarrhea > 20:
                    risk_level = "High"
                elif bod > 3.0 or cholera > 1:
                    risk_level = "Medium"
                else:
                    risk_level = "Low"

                _cpcb_cache.append({
                    "id": f"samb_{area}_{row[11]}",
                    "location_name": f"{area}, Sambalpur ({row[11]})",
                    "latitude": lat,
                    "longitude": lng,
                    "ph": ph,
                    "dissolved_oxygen": do,
                    "bod": bod,
                    "risk_level": risk_level,
                    "timestamp": f"2024-{row[11]}-01T00:00:00Z"
                })
                
    return _cpcb_cache


@router.get(
    "/map-data",
    summary="Fetch location-filtered map dataset"
)
def get_map_data(
    lat: float = Query(0.0), 
    lng: float = Query(0.0), 
    radius_km: float = 50.0,
    all_points: bool = Query(False)
):
    dataset = get_cpcb_dataset()
    filtered = []
    
    avg_ph = 0
    avg_bod = 0
    high_risk_count = 0
    
    for point in dataset:
        if all_points:
            dist = 0
        else:
            dist = haversine(lat, lng, point["latitude"], point["longitude"])
            
        if all_points or dist <= radius_km:
            filtered.append(point)
            avg_ph += point["ph"]
            avg_bod += point["bod"]
            if point["risk_level"] == "High":
                high_risk_count += 1
                
    total = len(filtered)
    
    stats = {
        "avg_ph": round(avg_ph / total, 2) if total > 0 else 0,
        "avg_bod": round(avg_bod / total, 2) if total > 0 else 0,
        "high_risk_count": high_risk_count,
        "total_points": total
    }
    
    return {
        "stats": stats,
        "points": filtered
    }
