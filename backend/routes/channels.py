from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
from bson import ObjectId

from models.Channel import ChannelCreate, ChannelResponse, ChannelUpdate
from auth.auth_utils import get_current_user

router = APIRouter(prefix="/channels", tags=["channels"])

# Get database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]

@router.get("/server/{server_id}", response_model=List[ChannelResponse])
async def get_server_channels(server_id: str, current_user: dict = Depends(get_current_user)):
    """Get all channels for a server"""
    user_id = ObjectId(current_user["_id"])
    
    # Check if user has access to server
    server = await db.servers.find_one({
        "_id": ObjectId(server_id),
        "$or": [
            {"owner_id": user_id},
            {"members": user_id}
        ]
    })
    
    if not server:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Server not found or access denied"
        )
    
    # Get channels for the server
    channels = await db.channels.find({"server_id": ObjectId(server_id)}).to_list(1000)
    
    # Convert to response models
    channel_responses = []
    for channel in channels:
        channel_response = ChannelResponse(
            _id=channel["_id"],
            name=channel["name"],
            type=channel["type"],
            topic=channel.get("topic"),
            server_id=channel["server_id"],
            created_at=channel.get("created_at"),
            updated_at=channel.get("updated_at")
        )
        channel_responses.append(channel_response)
    
    return channel_responses

@router.post("/", response_model=ChannelResponse)
async def create_channel(channel: ChannelCreate, current_user: dict = Depends(get_current_user)):
    """Create a new channel"""
    user_id = ObjectId(current_user["_id"])
    
    # Check if user is owner of the server
    server = await db.servers.find_one({
        "_id": channel.server_id,
        "owner_id": user_id
    })
    
    if not server:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only server owners can create channels"
        )
    
    # Create channel document
    channel_doc = {
        "name": channel.name,
        "type": channel.type,
        "topic": channel.topic,
        "server_id": channel.server_id,
        "created_at": None,  # Will be set by default
        "updated_at": None   # Will be set by default
    }
    
    # Insert channel
    result = await db.channels.insert_one(channel_doc)
    
    # Get created channel
    created_channel = await db.channels.find_one({"_id": result.inserted_id})
    
    return ChannelResponse(
        _id=created_channel["_id"],
        name=created_channel["name"],
        type=created_channel["type"],
        topic=created_channel.get("topic"),
        server_id=created_channel["server_id"],
        created_at=created_channel.get("created_at"),
        updated_at=created_channel.get("updated_at")
    )