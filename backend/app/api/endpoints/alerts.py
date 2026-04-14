"""
Alerts endpoint — OFFICIAL role only.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...models.models import AlertLog
from ...core.deps import require_role

router = APIRouter()

def _priority_from_severity(severity: str) -> str:
    s = (severity or "").strip().lower()
    if s == "high":
        return "Critical"
    if s in ("medium", "moderate"):
        return "Warning"
    return "Info"


def _actions_for_priority(priority: str) -> list[str]:
    p = (priority or "").strip().lower()
    if p == "critical":
        return ["Boil water", "Send health workers", "Issue public warning"]
    if p == "warning":
        return ["Boil water", "Inspect local sources", "Increase community awareness"]
    return ["Maintain hygiene", "Monitor water quality reports"]


@router.get(
    "/",
    summary="Fetch all alert logs (OFFICIAL only)",
    dependencies=[Depends(require_role(["OFFICIAL"]))]
)
def get_alerts(db: Session = Depends(get_db)):
    """
    Returns all recorded alerts ordered by most recent first.
    Restricted to users with the OFFICIAL role.
    """
    alerts = (
        db.query(AlertLog)
        .order_by(AlertLog.timestamp.desc())
        .limit(50)
        .all()
    )
    return [
        {
            "id": a.id,
            "location": a.location,
            "message": a.message,
            "severity": a.severity,
            "priority": _priority_from_severity(a.severity),
            "action": _actions_for_priority(_priority_from_severity(a.severity)),
            "timestamp": a.timestamp.isoformat() if a.timestamp else None,
        }
        for a in alerts
    ]


@router.get(
    "/awareness",
    summary="Public awareness information (all roles allowed)"
)
def get_awareness_info():
    """
    Returns public health awareness information.
    No authentication required.
    """
    return {
        "tips": [
            "Boil drinking water before consumption.",
            "Wash hands with soap and water regularly.",
            "Avoid open defecation — use sanitation facilities.",
            "Report unusual water color or smell to local authorities.",
            "Keep water storage containers covered and clean.",
        ],
        "hotline": "1800-AQUA-HELP",
        "website": "https://aquashield.health",
    }
