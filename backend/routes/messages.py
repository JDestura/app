from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
from bson import ObjectId
from datetime import datetime

from ..models.Message import MessageCreate, MessageResponse, MessageUpdate, MessageWithAuthor
from ..auth.auth_utils import get_current_user

router = APIRouter(prefix="/messages", tags=["messages"])

# Get database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]

@router.get("/channel/{channel_id}", response_model=List[MessageWithAuthor])
async def get_channel_messages(channel_id: str, current_user: dict = Depends(get_current_user)):
    """Get messages for a channel"""
    user_id = ObjectId(current_user["_id"])
    
    # Check if user has access to the channel via server membership
    channel = await db.channels.find_one({"_id": ObjectId(channel_id)})
    if not channel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found"
        )
    
    # Check server access
    server = await db.servers.find_one({
        "_id": channel["server_id"],
        "$or": [
            {"owner_id": user_id},
            {"members": user_id}
        ]
    })
    
    if not server:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this channel"
        )
    
    # Get messages with author information
    messages_pipeline = [
        {"$match": {"channel_id": ObjectId(channel_id)}},
        {"$lookup": {
            "from": "users",
            "localField": "author_id",
            "foreignField": "_id",
            "as": "author"
        }},
        {"$unwind": "$author"},
        {"$sort": {"created_at": 1}},
        {"$limit": 100}  # Limit to last 100 messages
    ]
    
    messages = await db.messages.aggregate(messages_pipeline).to_list(1000)
    
    # Convert to response models
    message_responses = []
    for message in messages:
        author_info = {
            "id": str(message["author"]["_id"]),
            "username": message["author"]["username"],
            "avatar": message["author"].get("avatar"),
            "discriminator": message["author"]["discriminator"]
        }
        
        message_response = MessageWithAuthor(
            _id=message["_id"],
            content=message["content"],
            author_id=message["author_id"],
            channel_id=message["channel_id"],
            attachments=message.get("attachments", []),
            created_at=message.get("created_at"),
            updated_at=message.get("updated_at"),
            edited_at=message.get("edited_at"),
            author=author_info
        )
        message_responses.append(message_response)
    
    return message_responses

@router.post("/", response_model=MessageWithAuthor)
async def send_message(message: MessageCreate, current_user: dict = Depends(get_current_user)):
    """Send a message to a channel"""
    user_id = ObjectId(current_user["_id"])
    
    # Check if user has access to the channel
    channel = await db.channels.find_one({"_id": message.channel_id})
    if not channel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found"
        )
    
    # Check server access
    server = await db.servers.find_one({
        "_id": channel["server_id"],
        "$or": [
            {"owner_id": user_id},
            {"members": user_id}
        ]
    })
    
    if not server:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this channel"
        )
    
    # Create message document
    message_doc = {
        "content": message.content,
        "author_id": user_id,
        "channel_id": message.channel_id,
        "attachments": message.attachments or [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert message
    result = await db.messages.insert_one(message_doc)
    
    # Get created message with author info
    created_message = await db.messages.aggregate([
        {"$match": {"_id": result.inserted_id}},
        {"$lookup": {
            "from": "users",
            "localField": "author_id",
            "foreignField": "_id",
            "as": "author"
        }},
        {"$unwind": "$author"}
    ]).next()
    
    # Prepare author info
    author_info = {
        "id": str(created_message["author"]["_id"]),
        "username": created_message["author"]["username"],
        "avatar": created_message["author"].get("avatar"),
        "discriminator": created_message["author"]["discriminator"]
    }
    
    return MessageWithAuthor(
        _id=created_message["_id"],
        content=created_message["content"],
        author_id=created_message["author_id"],
        channel_id=created_message["channel_id"],
        attachments=created_message.get("attachments", []),
        created_at=created_message.get("created_at"),
        updated_at=created_message.get("updated_at"),
        edited_at=created_message.get("edited_at"),
        author=author_info
    )