#!/bin/bash

# Start Q&A Forum Service
# This script starts the Q&A Forum service on port 8001

echo "🚀 Starting Dabba AI Q&A Forum Service..."
echo "📍 Service will run on: http://localhost:8001"
echo "📚 API Documentation: http://localhost:8001/docs"
echo ""

cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "⚠️  Virtual environment not found. Creating one..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install dependencies if needed
if [ ! -f ".venv/.installed" ]; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
    touch .venv/.installed
fi

# Start the service
echo "✅ Starting service..."
python3 main.py

