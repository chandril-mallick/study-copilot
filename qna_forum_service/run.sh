#!/bin/bash

# Q&A Forum Service - Robust Run Script

echo "🚀 Starting Q&A Forum Service..."
echo ""

# Ensure we are in the script's directory
cd "$(dirname "$0")"

# remove existing venv if it's broken (optional, but safer if they have a bad state)
# rm -rf .venv 

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv .venv
fi

# Use explicit paths to ensure we use the venv
VENV_PYTHON="./.venv/bin/python"
VENV_PIP="./.venv/bin/pip"

# Install dependencies using the venv's pip
echo "📥 Installing dependencies..."
"$VENV_PIP" install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📄 Creating .env file..."
    cp .env.example .env
fi

# Start the service using the venv's python
echo "🌟 Starting service on http://localhost:8001"
echo "📚 API Documentation: http://localhost:8001/docs"
echo "🔄 Press Ctrl+C to stop"
echo ""

"$VENV_PYTHON" main.py
