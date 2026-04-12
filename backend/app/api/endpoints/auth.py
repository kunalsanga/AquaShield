"""
Authentication endpoints: register and login.
POST /api/v1/auth/register
POST /api/v1/auth/login
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...models.models import User
from ...schemas.schemas import RegisterRequest, LoginRequest, TokenResponse, UserOut
from ...core.security import hash_password, verify_password, create_access_token

router = APIRouter()


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user"
)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Create a new user account.
    - **email**: unique user email
    - **password**: plaintext (hashed server-side with bcrypt)
    - **role**: one of ASHA | OFFICIAL | PUBLIC
    """
    # Check for duplicate email
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and receive a JWT token"
)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate with email + password.
    Returns a signed JWT containing the user's email and role.
    """
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user.email, "role": user.role})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        role=user.role,
        email=user.email,
    )
