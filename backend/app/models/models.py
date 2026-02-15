from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from ..db.session import Base
from datetime import datetime

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
    message = Column(String)
    severity = Column(String) # Low, Medium, High
    timestamp = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # admin, worker, officer
