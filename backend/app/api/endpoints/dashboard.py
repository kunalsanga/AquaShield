"""
Dashboard endpoint — OFFICIAL role only.
Returns aggregated sensor and alert statistics.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
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
