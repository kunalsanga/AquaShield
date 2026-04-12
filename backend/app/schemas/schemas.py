from pydantic import BaseModel, EmailStr
from typing import Optional, List, Literal
from datetime import datetime

# ── Sensor ─────────────────────────────────────────────────────────────────────
class SensorRead(BaseModel):
    ph: float
    turbidity: float
    temperature: float
    dissolved_oxygen: float
    bod: float
    coliform: float
    rainfall: float
    timestamp: datetime = datetime.now()

# ── Prediction ─────────────────────────────────────────────────────────────────
class PredictionInput(BaseModel):
    ph: float
    turbidity: float
    temperature: float
    dissolved_oxygen: float
    bod: float
    coliform: float
    rainfall: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None

class PredictionOutput(BaseModel):
    id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    risk_score: float         # 0-100
    risk_level: str           # Low, Medium, High
    cholera_cases_predicted: int
    typhoid_cases_predicted: int
    diarrhea_cases_predicted: int
    explanation: Optional[str] = None
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

# ── Auth ───────────────────────────────────────────────────────────────────────
UserRole = Literal["ASHA", "OFFICIAL", "PUBLIC"]

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: UserRole = "PUBLIC"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    email: str

class UserOut(BaseModel):
    id: int
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True
