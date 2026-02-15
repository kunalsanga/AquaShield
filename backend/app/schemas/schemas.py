from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SensorRead(BaseModel):
    ph: float
    turbidity: float
    temperature: float
    dissolved_oxygen: float
    bod: float
    coliform: float
    rainfall: float
    timestamp: datetime = datetime.now()

class PredictionInput(BaseModel):
    ph: float
    turbidity: float
    temperature: float
    dissolved_oxygen: float
    bod: float
    coliform: float
    rainfall: float

class PredictionOutput(BaseModel):
    risk_score: float # 0-100
    risk_level: str # Low, Medium, High
    cholera_cases_predicted: int
    typhoid_cases_predicted: int
    diarrhea_cases_predicted: int
    explanation: Optional[str] = None

class User(BaseModel):
    username: str
    password: str 
