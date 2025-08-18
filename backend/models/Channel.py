from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from utils.object_id import PyObjectId

class ChannelBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str = Field(..., pattern="^(text|voice)$")
    topic: Optional[str] = Field(None, max_length=1024)

class ChannelCreate(ChannelBase):
    server_id: PyObjectId

class ChannelUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    topic: Optional[str] = Field(None, max_length=1024)

class ChannelResponse(ChannelBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    server_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ChannelInDB(ChannelResponse):
    pass