from fastapi import APIRouter
from .endpoints import predict, users, sensor_data

api_router = APIRouter()
api_router.include_router(predict.router, prefix="/predict", tags=["predict"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(sensor_data.router, prefix="/sensor", tags=["sensor"])
