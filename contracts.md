# Discord Clone - Backend Integration Contracts

## API Contracts

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### Server Endpoints
- `GET /api/servers` - Get user's servers
- `POST /api/servers` - Create new server
- `GET /api/servers/:serverId` - Get server details
- `PUT /api/servers/:serverId` - Update server
- `DELETE /api/servers/:serverId` - Delete server

### Channel Endpoints
- `GET /api/servers/:serverId/channels` - Get server channels
- `POST /api/servers/:serverId/channels` - Create channel
- `PUT /api/channels/:channelId` - Update channel
- `DELETE /api/channels/:channelId` - Delete channel

### Message Endpoints
- `GET /api/channels/:channelId/messages` - Get channel messages
- `POST /api/channels/:channelId/messages` - Send message
- `PUT /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message

### Direct Message Endpoints
- `GET /api/direct-messages` - Get user's DM conversations
- `POST /api/direct-messages` - Start DM conversation
- `GET /api/direct-messages/:conversationId/messages` - Get DM messages
- `POST /api/direct-messages/:conversationId/messages` - Send DM

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:userId` - Get user by ID

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  discriminator: String,
  avatar: String (URL),
  status: String (online, idle, dnd, offline),
  createdAt: Date,
  updatedAt: Date
}
```

### Server Model
```javascript
{
  _id: ObjectId,
  name: String,
  icon: String (URL),
  ownerId: ObjectId (User),
  members: [ObjectId] (Users),
  createdAt: Date,
  updatedAt: Date
}
```

### Channel Model
```javascript
{
  _id: ObjectId,
  name: String,
  type: String (text, voice),
  topic: String,
  serverId: ObjectId (Server),
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  _id: ObjectId,
  content: String,
  authorId: ObjectId (User),
  channelId: ObjectId (Channel),
  attachments: [String] (URLs),
  createdAt: Date,
  updatedAt: Date,
  editedAt: Date
}
```

### DirectMessage Model
```javascript
{
  _id: ObjectId,
  participants: [ObjectId] (Users),
  createdAt: Date,
  updatedAt: Date
}
```

### DirectMessageMessage Model
```javascript
{
  _id: ObjectId,
  content: String,
  authorId: ObjectId (User),
  conversationId: ObjectId (DirectMessage),
  attachments: [String] (URLs),
  createdAt: Date,
  updatedAt: Date
}
```

## Mock Data Replacement

### Current Mock Data in `/app/frontend/src/data/mockData.js`:
- `mockUser` → Replace with API call to `/api/auth/me`
- `mockServers` → Replace with API call to `/api/servers`
- `mockChannels` → Replace with API call to `/api/servers/:serverId/channels`
- `mockMessages` → Replace with API call to `/api/channels/:channelId/messages`
- `mockDirectMessages` → Replace with API call to `/api/direct-messages`

## Frontend & Backend Integration Plan

### Phase 1: Authentication
1. Create JWT-based authentication system
2. Add login/register forms to frontend
3. Implement protected routes
4. Store auth token in localStorage

### Phase 2: Server & Channel Management
1. Replace server list with real data from API
2. Replace channel list with real data from API
3. Implement server creation/joining functionality
4. Add channel creation functionality

### Phase 3: Real-time Messaging
1. Replace message fetching with API calls
2. Replace message sending with API calls
3. Implement WebSocket for real-time updates
4. Add message editing/deletion

### Phase 4: Direct Messages
1. Implement DM conversation creation
2. Replace DM messages with API calls
3. Add real-time DM functionality

### Phase 5: User Management
1. Add user profile management
2. Implement user status updates
3. Add friend system (optional)
4. Add server member management

## Error Handling
- Implement proper HTTP status codes
- Add error boundaries in frontend
- Display user-friendly error messages
- Handle network errors gracefully

## Security Considerations
- Input validation and sanitization
- Rate limiting for API endpoints
- JWT token expiration handling
- Password hashing with bcrypt
- CORS configuration
- File upload security (for avatars/attachments)

## WebSocket Events (Future Enhancement)
- `message:new` - New message received
- `message:edit` - Message edited
- `message:delete` - Message deleted
- `user:status` - User status changed
- `channel:created` - New channel created
- `server:updated` - Server information updated