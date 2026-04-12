from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from ..db.session import Base
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    ASHA = "ASHA"
    OFFICIAL = "OFFICIAL"
    PUBLIC = "PUBLIC"

class SensorLog(Base):
    __tablename__ = "sensor_logs"

    id = Column(Integer, primary_key=True, index=True)
    ph = Column(Float)
    turbidity = Column(Float)
    temperature = Column(Float)
    dissolved_oxygen = Column(Float)
    bod = Column(Float)
    coliform = Column(Float)
    rainfall = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AlertLog(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    message = Column(String)
    severity = Column(String)  # Low, Medium, High
    timestamp = Column(DateTime, default=datetime.utcnow)

class PredictionLog(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_name = Column(String, nullable=True)
    ph = Column(Float)
    turbidity = Column(Float)
    temperature = Column(Float)
    dissolved_oxygen = Column(Float)
    bod = Column(Float)
    coliform = Column(Float)
    rainfall = Column(Float)
    risk_score = Column(Float)
    risk_level = Column(String)
    cholera_cases = Column(Integer)
    typhoid_cases = Column(Integer)
    diarrhea_cases = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default=UserRole.PUBLIC, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
