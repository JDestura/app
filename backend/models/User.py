from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from utils.object_id import PyObjectId

class UserBase(BaseModel):
    username: str = Field(..., min_length=2, max_length=32)
    email: EmailStr
    discriminator: str = Field(..., min_length=4, max_length=4)
    avatar: Optional[str] = None
    status: str = Field(default="online", pattern="^(online|idle|dnd|offline)$")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=2, max_length=32)
    avatar: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(online|idle|dnd|offline)$")

class UserResponse(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserInDB(UserResponse):
    password_hash: str