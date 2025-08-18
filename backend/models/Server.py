from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from utils.object_id import PyObjectId

class ServerBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    icon: Optional[str] = None

class ServerCreate(ServerBase):
    pass

class ServerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    icon: Optional[str] = None

class ServerResponse(ServerBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    owner_id: PyObjectId
    members: List[PyObjectId] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ServerInDB(ServerResponse):
    pass