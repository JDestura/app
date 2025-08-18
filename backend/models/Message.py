from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from utils.object_id import PyObjectId

class MessageBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    attachments: Optional[List[str]] = []

class MessageCreate(MessageBase):
    channel_id: PyObjectId

class MessageUpdate(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)

class MessageResponse(MessageBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    author_id: PyObjectId
    channel_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    edited_at: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class MessageInDB(MessageResponse):
    pass

# Extended response with author information
class MessageWithAuthor(MessageResponse):
    author: dict  # Will contain author information