from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import timedelta
from bson import ObjectId

from models.User import UserCreate, UserLogin, UserResponse, UserInDB
from auth.jwt_handler import create_access_token
from auth.auth_utils import hash_password, verify_password, generate_discriminator, get_current_user

router = APIRouter(prefix="/auth", tags=["authentication"])

# Get database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]

@router.post("/register", response_model=dict)
async def register_user(user: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = hash_password(user.password)
    
    # Create user document
    user_doc = {
        "username": user.username,
        "email": user.email,
        "password_hash": hashed_password,
        "discriminator": generate_discriminator(),
        "avatar": user.avatar,
        "status": user.status,
        "created_at": None,  # Will be set by default
        "updated_at": None   # Will be set by default
    }
    
    # Insert user
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user_id
    }

@router.post("/login", response_model=dict)
async def login_user(user_credentials: UserLogin):
    """Login user"""
    # Find user by email
    user = await db.users.find_one({"email": user_credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user["_id"])
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    # Convert to response model
    user_response = UserResponse(
        _id=current_user["_id"],
        username=current_user["username"],
        email=current_user["email"],
        discriminator=current_user["discriminator"],
        avatar=current_user.get("avatar"),
        status=current_user.get("status", "online"),
        created_at=current_user.get("created_at"),
        updated_at=current_user.get("updated_at")
    )
    return user_response

@router.post("/logout")
async def logout_user():
    """Logout user (client-side should remove token)"""
    return {"message": "Successfully logged out"}