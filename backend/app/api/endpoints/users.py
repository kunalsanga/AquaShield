from fastapi import APIRouter
from ...schemas import schemas

router = APIRouter()

@router.get("/", response_model=list[schemas.User])
def read_users():
    return [{"username": "admin", "role": "admin"}]

@router.post("/login")
def login(user: schemas.User):
    return {"token": "fake-jwt-token"}
