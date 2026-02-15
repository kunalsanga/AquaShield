from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas import schemas
from ...models import models

router = APIRouter()

@router.post("/", response_model=schemas.SensorRead)
def create_sensor_data(data: schemas.SensorRead, db: Session = Depends(get_db)):
    db_sensor = models.SensorLog(**data.dict())
    db.add(db_sensor)
    db.commit()
    db.refresh(db_sensor)
    return db_sensor

@router.get("/latest", response_model=schemas.SensorRead)
def get_latest_sensor_data(db: Session = Depends(get_db)):
    latest = db.query(models.SensorLog).order_by(models.SensorLog.timestamp.desc()).first()
    if not latest:
        return {"ph": 7.0, "turbidity": 2.0, "temperature": 25.0, "dissolved_oxygen": 8.0}
    return latest
