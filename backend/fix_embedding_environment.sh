#!/bin/bash

# Script to fix the Embedding Manager Python 3.13 compatibility issue

echo "=========================================="
echo "Embedding Manager Environment Fix"
echo "=========================================="
echo ""

# Check current Python version
echo "Current Python version:"
python3 --version
echo ""

# Check if pyenv is installed
if command -v pyenv &> /dev/null; then
    echo "✓ pyenv is installed"
    echo ""
    
    echo "Available Python versions in pyenv:"
    pyenv versions
    echo ""
    
    # Check if Python 3.11 is installed
    if pyenv versions | grep -q "3.11"; then
        echo "✓ Python 3.11 is already installed"
        echo ""
        echo "To switch to Python 3.11:"
        echo "  cd /Users/chandrilmallick/Downloads/dabba_ai_v4/backend"
        echo "  pyenv local 3.11.7  # or whatever 3.11 version you have"
        echo "  rm -rf .venv"
        echo "  python -m venv .venv"
        echo "  source .venv/bin/activate"
        echo "  pip install -r requirements.txt"
    else
        echo "Python 3.11 not found. To install:"
        echo "  pyenv install 3.11.7"
        echo "  pyenv local 3.11.7"
        echo "  rm -rf .venv"
        echo "  python -m venv .venv"
        echo "  source .venv/bin/activate"
        echo "  pip install -r requirements.txt"
    fi
else
    echo "⚠ pyenv is not installed"
    echo ""
    echo "Option 1: Install pyenv (recommended)"
    echo "  brew install pyenv"
    echo "  pyenv install 3.11.7"
    echo "  pyenv local 3.11.7"
    echo ""
    echo "Option 2: Install Python 3.11 directly"
    echo "  brew install python@3.11"
    echo "  python3.11 -m venv .venv"
    echo "  source .venv/bin/activate"
    echo "  pip install -r requirements.txt"
    echo ""
    echo "Option 3: Use Docker (best for production)"
    echo "  See the Dockerfile in the diagnostic report"
fi

echo ""
echo "=========================================="
echo "Alternative: Docker Setup"
echo "=========================================="
echo ""
echo "For a consistent environment, use Docker:"
echo ""
echo "1. Create Dockerfile in backend directory:"
cat << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

echo ""
echo "2. Build and run:"
echo "  docker build -t dabba-ai-backend ."
echo "  docker run -p 8000:8000 -v \$(pwd)/data:/app/data dabba-ai-backend"
echo ""
echo "=========================================="
