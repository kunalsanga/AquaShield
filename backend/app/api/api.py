from fastapi import APIRouter
from .endpoints import predict, users, sensor_data, auth, dashboard, alerts

api_router = APIRouter()

# Auth (public)
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# Protected endpoints
api_router.include_router(predict.router, prefix="/predict", tags=["predict"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(sensor_data.router, prefix="/sensor", tags=["sensor"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
