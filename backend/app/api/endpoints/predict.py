from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas import schemas
from ...models import models
from ...ml_utils import DummyModel, DummyScaler
from ...core.deps import require_role
from ...risk_logic import explainable_final_risk
import joblib
import numpy as np
import os

router = APIRouter()

# Load model artifacts
MODEL_PATH = "backend/ml_models/disease_prediction_model.pkl"
SCALER_PATH = "backend/ml_models/scaler.pkl"

model = None
scaler = None

if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"Error loading model: {e}")
        model = DummyModel()

if os.path.exists(SCALER_PATH):
    try:
        scaler = joblib.load(SCALER_PATH)
    except Exception as e:
        print(f"Error loading scaler: {e}")
        scaler = DummyScaler()
else:
    scaler = DummyScaler()


@router.post(
    "/",
    response_model=schemas.PredictionOutput,
    # ── ASHA workers are the only ones who submit health/sensor reports ──
    dependencies=[Depends(require_role(["ASHA"]))]
)
def predict_disease(input_data: schemas.PredictionInput, db: Session = Depends(get_db)):
    if not model or not scaler:
        return {
            "risk_score": 75.5,
            "risk_level": "High",
            "cholera_cases_predicted": 12,
            "typhoid_cases_predicted": 5,
            "diarrhea_cases_predicted": 20,
            "explanation": "Model failed to load completely."
        }

    # Preprocess
    features = np.array([[
        input_data.ph,
        input_data.turbidity,
        input_data.dissolved_oxygen,
        input_data.temperature,
        input_data.bod,
        input_data.coliform,
        input_data.rainfall
    ]])

    try:
        features_scaled = scaler.transform(features)
        cholera_pred = model.predict(features_scaled)[0]
    except Exception as e:
        print(f"Prediction error: {e}")
        cholera_pred = 20

    typhoid_pred = cholera_pred * 0.8
    diarrhea_pred = cholera_pred * 1.5

    ml_risk_score = min(100, (cholera_pred / 20) * 100)

    # Pull previous cases from DB if caller didn't pass them
    previous_cases = input_data.previous_cases
    current_cases = input_data.current_cases
    if current_cases is None:
        current_cases = float(cholera_pred)

    if previous_cases is None and input_data.location_name:
        prev = (
            db.query(models.PredictionLog)
            .filter(models.PredictionLog.location_name == input_data.location_name)
            .order_by(models.PredictionLog.timestamp.desc())
            .first()
        )
        if prev is not None:
            previous_cases = float(prev.cholera_cases)

    explained = explainable_final_risk(
        ml_risk_score=float(ml_risk_score),
        ph=float(input_data.ph),
        bod=float(input_data.bod),
        dissolved_oxygen=float(input_data.dissolved_oxygen),
        turbidity=float(input_data.turbidity),
        coliform=float(input_data.coliform),
        rainfall=float(input_data.rainfall),
        previous_cases=previous_cases,
        current_cases=current_cases,
    )

    risk_score = explained.final_risk_score
    risk_level = explained.risk_level

        if risk_score > 80:
            try:
                new_alert = models.AlertLog(
                    location=input_data.location_name or "Unknown Location",
                    latitude=input_data.latitude,
                    longitude=input_data.longitude,
                    message=f"High Disease Risk Detected: {risk_score:.2f}",
                    severity="High"
                )
                db.add(new_alert)
                db.commit()
            except Exception as db_e:
                print(f"Alert Database error: {db_e}")

    # Save to PredictionLog
    prediction = models.PredictionLog(
        latitude=input_data.latitude,
        longitude=input_data.longitude,
        location_name=input_data.location_name,
        ph=input_data.ph,
        turbidity=input_data.turbidity,
        temperature=input_data.temperature,
        dissolved_oxygen=input_data.dissolved_oxygen,
        bod=input_data.bod,
        coliform=input_data.coliform,
        rainfall=input_data.rainfall,
        risk_score=float(risk_score),
        risk_level=risk_level,
        cholera_cases=int(cholera_pred),
        typhoid_cases=int(typhoid_pred),
        diarrhea_cases=int(diarrhea_pred)
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return {
        "id": prediction.id,
        "latitude": prediction.latitude,
        "longitude": prediction.longitude,
        "location_name": prediction.location_name,
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "cholera_cases_predicted": int(cholera_pred),
        "typhoid_cases_predicted": int(typhoid_pred),
        "diarrhea_cases_predicted": int(diarrhea_pred),
        "rainfall": prediction.rainfall,
        "explanation": "Predicted by combining ML output with rule-based adjustments.",
        "reasons": explained.reasons,
        "likely_diseases": explained.likely_diseases,
        "recommendations": explained.recommendations,
        "derived_features": {
            "disease_growth_rate": explained.derived.disease_growth_rate,
            "rainfall_intensity_index": explained.derived.rainfall_intensity_index,
            "water_quality_score": explained.derived.water_quality_score,
        },
        "timestamp": prediction.timestamp
    }

@router.get(
    "/history",
    response_model=List[schemas.PredictionOutput],
    dependencies=[Depends(require_role(["OFFICIAL"]))]
)
def get_prediction_history(db: Session = Depends(get_db)):
    """Fetch all prediction history, used for map visualization."""
    return db.query(models.PredictionLog).order_by(models.PredictionLog.timestamp.desc()).all()
