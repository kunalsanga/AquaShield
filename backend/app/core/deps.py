"""
FastAPI dependency injection helpers for authentication and authorization.
"""
from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models.models import User
from .security import decode_access_token

# The OAuth2 bearer scheme — points to our login endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Decode the bearer JWT and return the authenticated User object.
    Raises 401 if the token is missing, invalid, or the user doesn't exist.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return user


def require_role(allowed_roles: List[str]):
    """
    Factory that returns a FastAPI dependency enforcing at least one of
    the specified roles.

    Usage:
        @router.get("/admin", dependencies=[Depends(require_role(["OFFICIAL"]))])
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden. Required role(s): {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker
