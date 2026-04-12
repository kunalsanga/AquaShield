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
        
    csv_path = "WQuality_River-Data-2024.csv"
    if not os.path.exists(csv_path):
        return []
        
    # Read ignoring first two lines as they are complex multi-line headers
    # Actuall data usually starts at line 12 based on the file inspection!
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for i, row in enumerate(reader):
            if i < 11: # Ignore headers
                continue
            if len(row) < 10:
                continue
            
            station_code = row[0]
            name = row[1].replace('\n', ' ')
            state = row[2].replace('\n', ' ').strip().upper()
            
            try:
                # Get max values corresponding to DO, pH, BOD
                do = float(row[4]) if row[4] else 6.0
            except ValueError:
                do = 6.0
                
            try:
                ph = float(row[6]) if row[6] else 7.0
            except ValueError:
                ph = 7.0
                
            try:
                bod = float(row[12]) if row[12] else 2.0
            except ValueError:
                bod = 2.0

            # Determine risk based on BOD
            if bod > 10:
                risk_level = "High"
            elif bod > 3:
                risk_level = "Medium"
            else:
                risk_level = "Low"

            # Assign approximate lat/lng based on state + hash jitter for spread
            base_lat, base_lng = STATE_COORDS.get(state, (22.3511, 78.6677))
            
            # Simple deterministic jitter so points aren't stacked
            jitter_lat = ((hash(name) % 100) - 50) * 0.02
            jitter_lng = ((hash(station_code) % 100) - 50) * 0.02
            
            lat = base_lat + jitter_lat
            lng = base_lng + jitter_lng
            
            _cpcb_cache.append({
                "id": station_code,
                "location_name": name,
                "latitude": lat,
                "longitude": lng,
                "ph": ph,
                "dissolved_oxygen": do,
                "bod": bod,
                "risk_level": risk_level,
                "timestamp": "2024-01-01T00:00:00Z"
            })
            
    return _cpcb_cache


@router.get(
    "/map-data",
    summary="Fetch location-filtered map dataset",
    dependencies=[Depends(require_role(["OFFICIAL", "ASHA"]))]
)
def get_map_data(lat: float = Query(...), lng: float = Query(...), radius_km: float = 50.0):
    dataset = get_cpcb_dataset()
    filtered = []
    
    avg_ph = 0
    avg_bod = 0
    high_risk_count = 0
    
    for point in dataset:
        dist = haversine(lat, lng, point["latitude"], point["longitude"])
        if dist <= radius_km:
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
