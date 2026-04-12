"""
User management endpoints (protected).
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...models.models import User
from ...schemas.schemas import UserOut
from ...core.deps import get_current_user, require_role

router = APIRouter()


@router.get(
    "/me",
    response_model=UserOut,
    summary="Get current authenticated user profile"
)
def read_current_user(current_user: User = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return current_user


@router.get(
    "/",
    response_model=list[UserOut],
    summary="List all users (OFFICIAL only)",
    dependencies=[Depends(require_role(["OFFICIAL"]))]
)
def read_users(db: Session = Depends(get_db)):
    """Return all registered users. Restricted to OFFICIAL role."""
    return db.query(User).all()
