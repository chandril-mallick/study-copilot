# WebSocket Support for Real-Time Features

from fastapi import WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List
import json
from datetime import datetime

from routes.auth import get_current_user
from models.user import User

class ConnectionManager:
    """Manage WebSocket connections"""
    
    def __init__(self):
        # Store active connections by user_id
        self.active_connections: Dict[int, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int):
        """Accept and store WebSocket connection"""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, user_id: int):
        """Remove WebSocket connection"""
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
    
    async def send_personal_message(self, message: dict, user_id: int):
        """Send message to specific user"""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)
    
    async def broadcast(self, message: dict):
        """Broadcast message to all connected users"""
        for user_connections in self.active_connections.values():
            for connection in user_connections:
                await connection.send_json(message)
    
    async def broadcast_to_role(self, message: dict, role: str):
        """Broadcast to all users with specific role"""
        # TODO: Filter by role (need to track user roles in connections)
        await self.broadcast(message)

# Global connection manager
manager = ConnectionManager()

async def get_websocket_user(websocket: WebSocket) -> User:
    """Authenticate WebSocket connection via token"""
    # Get token from query params
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008, reason="Missing authentication token")
        return None
    
    # Validate token (simplified - in production, use proper JWT validation)
    from auth.jwt_handler import decode_token
    payload = decode_token(token)
    if not payload:
        await websocket.close(code=1008, reason="Invalid token")
        return None
    
    # Get user from database
    from database.connection import SessionLocal
    db = SessionLocal()
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    db.close()
    
    return user

async def handle_websocket_message(websocket: WebSocket, user: User, data: dict):
    """Handle incoming WebSocket messages"""
    message_type = data.get("type")
    
    if message_type == "ping":
        await websocket.send_json({"type": "pong", "timestamp": datetime.now().isoformat()})
    
    elif message_type == "chat":
        # Handle chat message
        await manager.send_personal_message({
            "type": "chat_response",
            "message": f"Echo: {data.get('message')}",
            "timestamp": datetime.now().isoformat()
        }, user.id)
    
    elif message_type == "notification_subscribe":
        # Subscribe to notifications
        await websocket.send_json({
            "type": "subscribed",
            "channels": ["notifications", "updates"]
        })

# Notification helper functions
async def send_notification(user_id: int, notification: dict):
    """Send notification to specific user"""
    await manager.send_personal_message({
        "type": "notification",
        "data": notification,
        "timestamp": datetime.now().isoformat()
    }, user_id)

async def broadcast_announcement(announcement: dict):
    """Broadcast announcement to all users"""
    await manager.broadcast({
        "type": "announcement",
        "data": announcement,
        "timestamp": datetime.now().isoformat()
    })
