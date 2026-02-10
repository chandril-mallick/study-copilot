#!/bin/bash

# Restart script for Dabba AI Backend
echo "🔄 Restarting Dabba AI Backend Server..."

# Kill any existing process on port 8000
echo "Stopping existing server..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || echo "No existing server found"

# Wait a moment
sleep 2

# Start the server
echo "Starting server on http://localhost:8000..."
echo "Press Ctrl+C to stop"
echo ""

# Run with uvicorn for better CORS handling
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

