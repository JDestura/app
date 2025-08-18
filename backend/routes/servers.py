from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
from bson import ObjectId

from models.Server import ServerCreate, ServerResponse, ServerUpdate
from auth.auth_utils import get_current_user

router = APIRouter(prefix="/servers", tags=["servers"])

# Get database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]

@router.get("/", response_model=List[ServerResponse])
async def get_user_servers(current_user: dict = Depends(get_current_user)):
    """Get servers where user is a member"""
    user_id = ObjectId(current_user["_id"])
    
    # Find servers where user is a member or owner
    servers = await db.servers.find({
        "$or": [
            {"owner_id": user_id},
            {"members": user_id}
        ]
    }).to_list(1000)
    
    # Convert to response models
    server_responses = []
    for server in servers:
        server_response = ServerResponse(
            _id=server["_id"],
            name=server["name"],
            icon=server.get("icon"),
            owner_id=server["owner_id"],
            members=server.get("members", []),
            created_at=server.get("created_at"),
            updated_at=server.get("updated_at")
        )
        server_responses.append(server_response)
    
    return server_responses

@router.post("/", response_model=ServerResponse)
async def create_server(server: ServerCreate, current_user: dict = Depends(get_current_user)):
    """Create a new server"""
    user_id = ObjectId(current_user["_id"])
    
    # Create server document
    server_doc = {
        "name": server.name,
        "icon": server.icon,
        "owner_id": user_id,
        "members": [user_id],  # Owner is automatically a member
        "created_at": None,  # Will be set by default
        "updated_at": None   # Will be set by default
    }
    
    # Insert server
    result = await db.servers.insert_one(server_doc)
    
    # Create default general channel
    general_channel = {
        "name": "general",
        "type": "text",
        "topic": "General discussion",
        "server_id": result.inserted_id,
        "created_at": None,
        "updated_at": None
    }
    await db.channels.insert_one(general_channel)
    
    # Get created server
    created_server = await db.servers.find_one({"_id": result.inserted_id})
    
    # Return response model
    return ServerResponse(
        _id=created_server["_id"],
        name=created_server["name"],
        icon=created_server.get("icon"),
        owner_id=created_server["owner_id"],
        members=created_server.get("members", []),
        created_at=created_server.get("created_at"),
        updated_at=created_server.get("updated_at")
    )

@router.get("/{server_id}", response_model=ServerResponse)
async def get_server(server_id: str, current_user: dict = Depends(get_current_user)):
    """Get server details"""
    user_id = ObjectId(current_user["_id"])
    
    # Check if server exists and user has access
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
    
    return ServerResponse(
        _id=server["_id"],
        name=server["name"],
        icon=server.get("icon"),
        owner_id=server["owner_id"],
        members=server.get("members", []),
        created_at=server.get("created_at"),
        updated_at=server.get("updated_at")
    )