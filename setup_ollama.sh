#!/bin/bash

# Dabba AI - Ollama Setup and Testing Script
# This script helps set up and test the Ollama integration

echo " Dabba AI - Ollama Integration Setup"
echo "======================================"

# Check if Ollama is installed
echo "1. Checking Ollama installation..."
if ! command -v ollama &> /dev/null; then
    echo " Ollama is not installed. Please install Ollama first:"
    echo "   curl -fsSL https://ollama.ai/install.sh | sh"
    exit 1
fi
echo " Ollama is installed"

# Check if Ollama service is running
echo "2. Checking Ollama service..."
if ! pgrep -x "ollama" > /dev/null; then
    echo " Ollama service is not running. Starting service..."
    ollama serve &
    sleep 3
    if ! pgrep -x "ollama" > /dev/null; then
        echo " Failed to start Ollama service"
        exit 1
    fi
fi
echo " Ollama service is running"

# Check and pull the default model
echo "3. Checking and pulling gemma3:1b model..."
if ! ollama list | grep -q "gemma3:1b"; then
    echo " Pulling gemma3:1b model (this may take a few minutes)..."
    if ollama pull gemma3:1b; then
        echo " Successfully pulled gemma3:1b model"
    else
        echo " Failed to pull gemma3:1b model"
        exit 1
    fi
else
    echo " gemma3:1b model is already available"
fi

# Test the model
echo "4. Testing the model..."
if ollama run gemma3:1b "Hello! Please respond with 'Ollama test successful' if you can read this." | grep -q "Ollama test successful"; then
    echo " Model test successful"
else
    echo " Model test failed"
    exit 1
fi

# Check Python dependencies
echo "5. Checking Python dependencies..."
python3 -c "import fastapi, uvicorn, ollama" 2>/dev/null
if [ $? -eq 0 ]; then
    echo " Python dependencies are installed"
else
    echo " Installing Python dependencies..."
    pip install fastapi uvicorn ollama python-multipart
fi

echo ""
echo " Setup Complete!"
echo ""
echo "Available models:"
ollama list
echo ""
echo "To start the Dabba AI backend server:"
echo "cd backend && python main.py"
echo ""
echo "The server will be available at: http://localhost:8000"
echo ""
echo "Test endpoints:"
echo "- Health check: curl http://localhost:8000/health"
echo "- Ollama status: curl http://localhost:8000/ollama/status"
echo "- Test model: curl -X POST http://localhost:8000/ollama/test -H 'Content-Type: application/json' -d '{\"model\": \"gemma3:1b\"}'"
