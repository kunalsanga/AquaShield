"""
User management endpoints (protected).
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
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
    summary="List all users (Temporarily Unprotected)"
    # dependencies=[Depends(require_role(["OFFICIAL"]))]
)
def read_users(db: Session = Depends(get_db)):
    """Return all registered users. Restricted to OFFICIAL role."""
    return db.query(User).all()

@router.delete(
    "/{user_id}",
    summary="Delete a user by ID (Temporarily Unprotected)"
    # dependencies=[Depends(require_role(["OFFICIAL"]))]
)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user from the system."""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}

class RoleUpdate(BaseModel):
    role: str

@router.patch(
    "/{user_id}/role",
    summary="Update user role (Temporarily Unprotected)",
    # dependencies=[Depends(require_role(["OFFICIAL"]))]
)
def update_user_role(user_id: int, role_data: RoleUpdate, db: Session = Depends(get_db)):
    """Update a user's role. Allowed values: PUBLIC, ASHA, OFFICIAL"""
    valid_roles = ["PUBLIC", "ASHA", "OFFICIAL"]
    
    if role_data.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {valid_roles}")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.role = role_data.role
    db.commit()
    db.refresh(user)
    
    return {"message": f"User role updated to {user.role}", "user_id": user.id, "role": user.role}
