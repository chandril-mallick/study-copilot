# WebSocket Routes

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from websocket_manager import manager, get_websocket_user, handle_websocket_message
import json

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time communication
    
    Connect with: ws://localhost:8000/ws?token=YOUR_JWT_TOKEN
    """
    user = await get_websocket_user(websocket)
    if not user:
        return
    
    await manager.connect(websocket, user.id)
    
    try:
        # Send welcome message
        await websocket.send_json({
            "type": "connected",
            "message": f"Welcome {user.name}!",
            "user_id": user.id,
            "role": user.role.value
        })
        
        # Listen for messages
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            await handle_websocket_message(websocket, user, message_data)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user.id)
        print(f"User {user.id} disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, user.id)

@router.websocket("/ws/chat/{session_id}")
async def chat_websocket(websocket: WebSocket, session_id: int):
    """
    WebSocket endpoint for AI chat sessions
    
    Provides real-time streaming responses from AI
    """
    user = await get_websocket_user(websocket)
    if not user:
        return
    
    await manager.connect(websocket, user.id)
    
    try:
        await websocket.send_json({
            "type": "chat_ready",
            "session_id": session_id
        })
        
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get("type") == "chat_message":
                # TODO: Stream AI response in real-time
                prompt = message_data.get("message")
                
                # Simulate streaming response
                await websocket.send_json({
                    "type": "chat_response_start",
                    "session_id": session_id
                })
                
                # In production, stream from Ollama
                response = f"AI response to: {prompt}"
                
                await websocket.send_json({
                    "type": "chat_response_chunk",
                    "content": response
                })
                
                await websocket.send_json({
                    "type": "chat_response_end",
                    "session_id": session_id
                })
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, user.id)
